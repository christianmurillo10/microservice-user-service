import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import BusinessesService from "../../../services/businesses.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const router = Router();
const service = new BusinessesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    await service.getById(id);
    return await service.delete(id);
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
  authenticate,
  controller
);