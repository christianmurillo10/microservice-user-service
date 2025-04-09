import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { changePassword as validator } from "../../../middlewares/validators/users.validator";
import { MESSAGE_DATA_PASSWORD_CHANGED } from "../../../shared/constants/message.constant";
import { ERROR_ON_CHANGE_PASSWORD } from "../../../shared/constants/error.constant";
import UsersService from "../../../services/users.service";

const router = Router();
const service = new UsersService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, body } = req;
    const id = params.id;
    const record = await service.getById({ id: id });
    await service.changePassword(
      id,
      record.password as string,
      body.old_password,
      body.new_password
    );
  })
  .then(() => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_PASSWORD_CHANGED
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_CHANGE_PASSWORD}: `, err);
    next(err)
  });

export default router.put(
  "/change-password/:id",
  authenticate,
  validator,
  controller
);