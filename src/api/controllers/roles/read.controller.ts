import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_FIND, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_READ } from "../../../shared/constants/error.constant";
import RolesService from "../../../services/roles.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const router = Router();
const rolesService = new RolesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, businesses } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = businesses ? { business_id: businesses.id } : undefined;
    const role = await rolesService.getById({ id, condition });

    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_FIND,
      data: role
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