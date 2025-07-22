import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { list as validator } from "../../../middlewares/validators/businesses.validator";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../shared/constants/error.constant";
import BusinessesService from "../../../services/businesses.service";
import { getPagination } from "../../../shared/helpers/common.helper";

const router = Router();
const businessesService = new BusinessesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req;
    const businesses = await businessesService.getAll({ query });
    const businessesCount = businesses.length;
    const allBusinessesCount = await businessesService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (businesses.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      status_code: 200,
      message,
      data: businesses,
      pagination: getPagination(
        allBusinessesCount,
        businessesCount,
        Number(query.offset ?? 1) + 1,
        Number(query.limit ?? 10)
      )
    });
  } catch (error) {
    console.error(`${ERROR_ON_LIST}: `, error);
    next(error);
  };
};

export default router.get(
  "/",
  authenticate,
  validator,
  controller
);