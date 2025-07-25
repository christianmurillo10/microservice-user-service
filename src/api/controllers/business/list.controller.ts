import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { list as validator } from "../../../middlewares/validators/business.validator";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../shared/constants/error.constant";
import { getPagination } from "../../../shared/helpers/common.helper";
import BusinessService from "../../../services/business.service";

const router = Router();
const businessService = new BusinessService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req;
    const business = await businessService.getAll({ query });
    const businessCount = business.length;
    const allBusinessCount = await businessService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (business.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      statusCode: 200,
      message,
      data: business,
      pagination: getPagination(
        allBusinessCount,
        businessCount,
        Number(query.page ?? 1),
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