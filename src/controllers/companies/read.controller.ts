import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_FIND, MESSAGE_DATA_NOT_EXIST } from "../../shared/constants/message.constant";
import { ERROR_ON_READ } from "../../shared/constants/error.constant";
import CompaniesRepository from "../../shared/repositories/companies.repository";
import NotFoundException from "../../shared/exceptions/not-found.exception";

const router = Router();
const repository = new CompaniesRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params } = req;
    const record = await repository.findById({
      id: Number(params.id),
      exclude: ["deleted_at"]
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