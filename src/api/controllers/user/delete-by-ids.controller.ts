import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { deleteByIds as validator } from "../../../middlewares/validators/user.validator";
import { MESSAGE_DATA_DELETED } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
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
    const { body, auth, userRequestHeader } = req;
    await userService.deleteMany(body.ids);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userBulkDeletedEventEmitter(
      {
        oldDetails: {},
        newDetails: body
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
      message: MESSAGE_DATA_DELETED,
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.post(
  "/delete-by-ids",
  authenticate,
  validator,
  controller
);