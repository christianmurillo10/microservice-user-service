import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { deleteByIds as validator } from "../../middlewares/validators/users.validator";
import { MESSAGE_DATA_DELETED } from "../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../shared/constants/error.constant";
import UsersRepository from "../../shared/repositories/users.repository";

const router = Router();
const repository = new UsersRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body } = req;
    await repository.softDeleteMany({ ids: body.ids });
  })
  .then(() => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_DELETED,
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_DELETE}: `, err);
    next(err)
  });

export default router.post(
  "/delete-by-ids",
  validator,
  controller
);