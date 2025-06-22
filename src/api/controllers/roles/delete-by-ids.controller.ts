import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { deleteByIds as validator } from "../../../middlewares/validators/roles.validator";
import { MESSAGE_DATA_DELETED } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import RolesService from "../../../services/roles.service";
import RoleKafkaProducer from "../../../events/producer/role.producer";

const router = Router();
const rolesService = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, auth, userRequestHeader } = req;
    await rolesService.deleteMany(body.ids);

    // Send to Kafka
    const roleProducer = new RoleKafkaProducer();
    await roleProducer.roleBulkDeletedEventEmitter(
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

    apiResponse(res, {
      status_code: 200,
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