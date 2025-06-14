import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { update as validator } from "../../../middlewares/validators/roles.validator";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import RolesService from "../../../services/roles.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import RoleKafkaProducer from "../../../events/producer/role.producer";

const router = Router();
const service = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body, auth, businesses, userRequestHeader } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = businesses ? { business_id: businesses.id } : undefined;
    const oldRole = await service.getById({ id, condition });
    const newRole = await service.save({ ...oldRole, ...body });

    // Send to Kafka
    const roleProducer = new RoleKafkaProducer();
    await roleProducer.publishRoleUpdated(
      {
        old_details: oldRole,
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
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result: newRole
    });
  } catch (error) {
    console.error(`${ERROR_ON_UPDATE}: `, error);
    next(error);
  };
};

export default router.put(
  "/:id",
  authenticate,
  validator,
  controller
);