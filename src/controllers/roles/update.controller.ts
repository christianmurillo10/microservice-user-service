import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../shared/constants/error.constant";
import { update as validator } from "../../middlewares/validators/roles.validator";
import RolesService from "../../services/roles.service";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

const router = Router();
const service = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, body, companies } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = companies ? { clinic_id: companies.id } : undefined;
    const record = await service.getById({ id, condition });
    return await service.save({ ...record, ...body });
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_UPDATE}: `, err);
    next(err)
  });

export default router.put(
  "/:id",
  validator,
  controller
);