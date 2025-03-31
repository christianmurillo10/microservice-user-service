import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_FIND, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_READ } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const router = Router();
const service = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, businesses } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = businesses ? { clinic_id: businesses.id } : undefined;
    return await service.getById({ id, condition });
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