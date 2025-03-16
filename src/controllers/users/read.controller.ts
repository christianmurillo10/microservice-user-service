import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_FIND, MESSAGE_DATA_NOT_EXIST, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_READ } from "../../shared/constants/error.constant";
import UsersRepository from "../../shared/repositories/users.repository";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../shared/exceptions/not-found.exception";

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
      condition,
      include: ["roles", "companies"],
      exclude: ["deleted_at", "password"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_FIND,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_READ}: `, err);
    next(err)
  });

export default router.get(
  "/:id",
  controller
);