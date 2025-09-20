import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import UserService from "../../../services/user.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import UserKafkaProducer from "../../../events/producer/user.producer";
import UserEntity from "../../../entities/user.entity";

const userService = new UserService();

const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, file, auth, userRequestHeader } = req;
    const organizationId = auth.organizationId!;
    const oldUser = await userService.getByUsernameOrEmail(body.username, body.email)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (oldUser) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newUser = await userService.save({ ...body, organizationId }, file);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userCreatedEventEmitter(
      {
        oldDetails: {} as UserEntity,
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

export default createController