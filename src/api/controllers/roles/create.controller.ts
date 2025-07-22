import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../middlewares/validators/roles.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import RolesService from "../../../services/roles.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import RoleKafkaProducer from "../../../events/producer/role.producer";
import RolesModel from "../../../models/roles.model";

const router = Router();
const rolesService = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, auth, businesses, userRequestHeader } = req;
    const condition = { business_id: businesses?.id || body.business_id || undefined };
    const existingRole = await rolesService.getByName({
      name: body.name,
      condition
    })
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingRole) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newRole = await rolesService.save(body);

    // Send to Kafka
    const roleProducer = new RoleKafkaProducer();
    await roleProducer.roleCreatedEventEmitter(
      {
        old_details: {} as RolesModel,
        new_details: newRole
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
      data: newRole
    });
  } catch (error) {
    console.error(`${ERROR_ON_CREATE}: `, error);
    next(error);
  };
};

export default router.post(
  "/",
  authenticate,
  validator,
  controller
);