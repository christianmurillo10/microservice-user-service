import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED } from "../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../shared/constants/error.constant";
import { update as validator } from "../../middlewares/validators/roles.validator";
import RolesRepository from "../../shared/repositories/roles.repository";
import Roles from "../../shared/entities/roles.entity";
import NotFoundException from "../../shared/exceptions/not-found.exception";

const router = Router();
const repository = new RolesRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, body, companies } = req;
    const condition = companies ? { clinic_id: companies.id } : undefined;
    const record = await repository.findById({
      id: Number(params.id),
      condition
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const oldData = new Roles(record);
    const result = await repository.update({
      id: Number(params.id),
      params: {
        ...oldData,
        ...body,
      },
      include: ["companies"],
      exclude: ["deleted_at"]
    });

    return result;
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