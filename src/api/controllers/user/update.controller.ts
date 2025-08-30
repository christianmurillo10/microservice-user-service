import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { update as validator } from "../../../middlewares/validators/user.validator";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import UserService from "../../../services/user.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import UserKafkaProducer from "../../../events/producer/user.producer";

const router = Router();
const upload = multer();
const userService = new UserService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body, file, auth, userRequestHeader } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const oldUser = await userService.getById(id);
    const newUser = await userService.save({ ...oldUser, ...body }, file);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userUpdatedEventEmitter(
      {
        oldDetails: oldUser,
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
      statusCode: 200,
      message: MESSAGE_DATA_UPDATED,
      data: newUser
    });
  } catch (error) {
    console.error(`${ERROR_ON_UPDATE}: `, error);
    next(error);
  };
};

export default router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  validator,
  controller
);