import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { list as validator } from "../../../middlewares/validators/organization.validator";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../shared/constants/error.constant";
import { getPagination } from "../../../shared/helpers/common.helper";
import OrganizationService from "../../../services/organization.service";

const router = Router();
const organizationService = new OrganizationService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req;
    const organization = await organizationService.getAll({ query });
    const organizationCount = organization.length;
    const allOrganizationCount = await organizationService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (organization.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      statusCode: 200,
      message,
      data: organization,
      pagination: getPagination(
        allOrganizationCount,
        organizationCount,
        Number(query.page ?? 1),
        Number(query.pageSize ?? 10)
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