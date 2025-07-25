import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { changePassword as validator } from "../../../middlewares/validators/user.validator";
import { MESSAGE_DATA_PASSWORD_CHANGED } from "../../../shared/constants/message.constant";
import { ERROR_ON_CHANGE_PASSWORD } from "../../../shared/constants/error.constant";
import UserService from "../../../services/user.service";
import UserKafkaProducer from "../../../events/producer/user.producer";

const router = Router();
const userService = new UserService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body, auth, userRequestHeader } = req;
    const id = params.id;
    const oldUser = await userService.getById({ id: id });
    const newUser = await userService.changePassword(
      id,
      oldUser.password as string,
      body.oldPassword,
      body.newPassword
    );

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userPasswordChangedEventEmitter(
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
      message: MESSAGE_DATA_PASSWORD_CHANGED
    });
  } catch (error) {
    console.error(`${ERROR_ON_CHANGE_PASSWORD}: `, error);
    next(error);
  };
};

export default router.put(
  "/change-password/:id",
  authenticate,
  validator,
  controller
);