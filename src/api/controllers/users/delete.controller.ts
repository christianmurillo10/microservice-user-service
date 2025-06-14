import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import UserKafkaProducer from "../../../events/producer/user.producer";

const router = Router();
const usersService = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, auth, businesses, userRequestHeader } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = businesses ? { business_id: businesses.id } : undefined;
    const oldUser = await usersService.getById({ id: id, condition });
    const newUser = await usersService.delete(id);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserDeleted(
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
      message: MESSAGE_DATA_DELETED,
      result: newUser
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.delete(
  "/:id",
  authenticate,
  controller
);