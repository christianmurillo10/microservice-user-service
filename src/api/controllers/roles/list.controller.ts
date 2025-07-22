import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { list as validator } from "../../../middlewares/validators/roles.validator";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../shared/constants/error.constant";
import { getPagination } from "../../../shared/helpers/common.helper";
import RolesService from "../../../services/roles.service";

const router = Router();
const rolesService = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query, businesses } = req;
    const condition = businesses ? { business_id: businesses.id } : undefined;
    const roles = await rolesService.getAll({ query, condition });
    const rolesCount = roles.length;
    const allRolesCount = await rolesService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (roles.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      status_code: 200,
      message,
      data: roles,
      pagination: getPagination(
        allRolesCount,
        rolesCount,
        Number(query.page ?? 1),
        Number(query.limit ?? 10)
      )
    })
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