import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import RolesService from "../../../services/roles.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import RoleKafkaProducer from "../../../events/producer/role.producer";

const router = Router();
const rolesService = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, auth, businesses, userRequestHeader } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = businesses ? { business_id: businesses.id } : undefined;
    const existingRole = await rolesService.getById({ id: Number(id), condition });
    const newRole = await rolesService.delete(Number(id));

    // Send to Kafka
    const roleProducer = new RoleKafkaProducer();
    await roleProducer.roleDeletedEventEmitter(
      {
        old_details: existingRole,
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
      message: MESSAGE_DATA_DELETED,
      data: newRole
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