import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../middlewares/validators/users.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import UserKafkaProducer from "../../../events/producer/user.producer";
import UsersModel from "../../../models/users.model";

const router = Router();
const upload = multer();
const usersService = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, file, auth, businesses, userRequestHeader } = req;
    const condition = { business_id: businesses?.id || body.business_id || undefined };
    const oldUser = await usersService.getByUsernameOrEmail({
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

    const newUser = await usersService.save(body, file);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserCreated(
      {
        old_details: {} as UsersModel,
        new_details: newUser
      },
      auth.id!,
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    );

    apiResponse(res, {
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result: newUser
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