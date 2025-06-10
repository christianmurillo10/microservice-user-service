import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { deleteByIds as validator } from "../../../middlewares/validators/users.validator";
import { MESSAGE_DATA_DELETED } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";
import UserKafkaProducer from "../../../events/producer/user.producer";

const router = Router();
const service = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, auth, userRequestHeader } = req;
    await service.deleteMany(body.ids);

    // Execute producer
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserBulkDeleted(
      {
        old_details: {},
        new_details: body
      },
      auth.id!,
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    );
  })
  .then(() => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_DELETED,
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_DELETE}: `, err);
    next(err)
  });

export default router.post(
  "/delete-by-ids",
  authenticate,
  validator,
  controller
);