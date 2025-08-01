import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_FIND, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_READ } from "../../../shared/constants/error.constant";
import UserService from "../../../services/user.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const router = Router();
const userService = new UserService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, business } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = business ? { businessId: business.id } : undefined;
    const user = await userService.getById({ id, condition });

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_FIND,
      data: user
    });
  } catch (error) {
    console.error(`${ERROR_ON_READ}: `, error);
    next(error);
  };
};

export default router.get(
  "/:id",
  authenticate,
  controller
);