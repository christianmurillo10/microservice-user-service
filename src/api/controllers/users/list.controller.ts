import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { list as validator } from "../../../middlewares/validators/users.validator";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";

const router = Router();
const usersService = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query, businesses } = req;
    const condition = businesses ? { business_id: businesses.id } : undefined;
    const users = await usersService.getAll({ query, condition });
    const usersCount = users.length;
    const allUsersCount = await usersService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (users.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      status_code: 200,
      message,
      data: {
        all_data_count: allUsersCount,
        data_count: usersCount,
        data: users
      }
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