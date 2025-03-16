import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { create as validator } from "../../middlewares/validators/roles.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../shared/constants/error.constant";
import RolesRepository from "../../shared/repositories/roles.repository";
import Roles from "../../shared/entities/roles.entity";
import ConflictException from "../../shared/exceptions/conflict.exception";

const router = Router();
const repository = new RolesRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, companies } = req;
    const condition = { clinic_id: companies?.id || body.clinic_id || undefined };
    const record = await repository.findByName({
      name: body.name,
      condition
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Roles(body);
    const result = await repository.create({
      params: data,
      include: ["companies"],
      exclude: ["deleted_at"]
    });

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
  validator,
  controller
);