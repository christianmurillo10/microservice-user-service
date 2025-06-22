import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { changePassword as validator } from "../../../middlewares/validators/users.validator";
import { MESSAGE_DATA_PASSWORD_CHANGED } from "../../../shared/constants/message.constant";
import { ERROR_ON_CHANGE_PASSWORD } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";
import UserKafkaProducer from "../../../events/producer/user.producer";

const router = Router();
const usersService = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body, auth, userRequestHeader } = req;
    const id = params.id;
    const oldUser = await usersService.getById({ id: id });
    const newUser = await usersService.changePassword(
      id,
      oldUser.password as string,
      body.old_password,
      body.new_password
    );

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userPasswordChangedEventEmitter(
      {
        old_details: oldUser,
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
      status_code: 200,
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