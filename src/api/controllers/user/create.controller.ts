import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../middlewares/validators/user.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import UserService from "../../../services/user.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import UserKafkaProducer from "../../../events/producer/user.producer";
import UserModel from "../../../models/user.model";

const router = Router();
const upload = multer();
const userService = new UserService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, file, auth, business, userRequestHeader } = req;
    const condition = { businessId: business?.id || body.businessId || undefined };
    const oldUser = await userService.getByUsernameOrEmail({
      username: body.username,
      email: body.email,
      condition
    })
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (oldUser) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newUser = await userService.save(body, file);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userCreatedEventEmitter(
      {
        oldDetails: {} as UserModel,
        newDetails: newUser
      },
      auth.id!,
      {
        ipAddress: userRequestHeader.ipAddress ?? undefined,
        host: userRequestHeader.host ?? undefined,
        userAgent: userRequestHeader.userAgent ?? undefined
      }
    );

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newUser
    });
  } catch (error) {
    console.error(`${ERROR_ON_CREATE}: `, error);
    next(error);
  };
};

export default router.post(
  "/",
  authenticate,
  upload.single("image"),
  validator,
  controller
);