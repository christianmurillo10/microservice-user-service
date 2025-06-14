import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { update as validator } from "../../../middlewares/validators/users.validator";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import UserKafkaProducer from "../../../events/producer/user.producer";

const router = Router();
const upload = multer();
const usersService = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body, file, auth, businesses, userRequestHeader } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = businesses ? { business_id: businesses.id } : undefined;
    const oldUser = await usersService.getById({ id, condition });
    const newUser = await usersService.save({ ...oldUser, ...body }, file);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserUpdated(
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
      message: MESSAGE_DATA_UPDATED,
      result: newUser
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