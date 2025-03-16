import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { changePassword as validator } from "../../middlewares/validators/users.validator";
import { MESSAGE_DATA_INCORRECT_OLD_PASSWORD, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_PASSWORD_CHANGED, MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD } from "../../shared/constants/message.constant";
import { ERROR_ON_CHANGE_PASSWORD } from "../../shared/constants/error.constant";
import UsersRepository from "../../shared/repositories/users.repository";
import NotFoundException from "../../shared/exceptions/not-found.exception";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import { comparePassword } from "../../shared/utils/bcrypt";

const router = Router();
const repository = new UsersRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, body } = req;
    const record = await repository.findById({ id: params.id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const compareOldPassword = comparePassword(body.old_password, record.password as string);

    if (!compareOldPassword) {
      throw new BadRequestException([MESSAGE_DATA_INCORRECT_OLD_PASSWORD]);
    };

    const compareNewPassword = comparePassword(body.new_password, record.password as string);

    if (compareNewPassword) {
      throw new BadRequestException([MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD]);
    };

    await repository.changePassword({ id: params.id, new_password: body.new_password });
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
  validator,
  controller
);