import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_DELETED, MESSAGE_DATA_NOT_EXIST, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../shared/constants/error.constant";
import UsersRepository from "../../shared/repositories/users.repository";
import NotFoundException from "../../shared/exceptions/not-found.exception";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

const router = Router();
const repository = new UsersRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, companies } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = companies ? { clinic_id: companies.id } : undefined;
    const record = await repository.findById({
      id,
      condition
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const result = await repository.softDelete({
      id,
      exclude: ["password"]
    });

    return result;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_DELETED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_DELETE}: `, err);
    next(err)
  });

export default router.delete(
  "/:id",
  controller
);