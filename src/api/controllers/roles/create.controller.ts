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
const service = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, auth, businesses, userRequestHeader } = req;
    const condition = { business_id: businesses?.id || body.business_id || undefined };
    const record = await service.getByName({
      name: body.name,
      condition
    })
      .catch(err => {
        if (err instanceof NotFoundException) {
          return null;
        }

        throw err;
      });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const result = await service.save(body);

    // Execute producer
    const roleProducer = new RoleKafkaProducer();
    await roleProducer.publishRoleCreated(
      {
        old_details: {} as RolesModel,
        new_details: result
      },
      auth.id!,
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    );

    return result;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_CREATE}: `, err);
    next(err)
  });

export default router.post(
  "/",
  authenticate,
  validator,
  controller
);