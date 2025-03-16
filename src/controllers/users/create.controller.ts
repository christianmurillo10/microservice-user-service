import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import _ from "lodash";
import { apiResponse } from "../../shared/utils/api-response";
import { create as validator } from "../../middlewares/validators/users.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../shared/constants/error.constant";
import UsersRepository from "../../shared/repositories/users.repository";
import Users from "../../shared/entities/users.entity";
import ConflictException from "../../shared/exceptions/conflict.exception";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload.helper";

const router = Router();
const upload = multer();
const repository = new UsersRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, file, companies } = req;
    const condition = { clinic_id: companies?.id || body.clinic_id || undefined };
    const record = await repository.findByUsernameOrEmail({
      username: body.username,
      email: body.email,
      condition
    });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Users({
      ...body,
      image_path: setUploadPath(file, repository.imagePath)
    });
    const result = await repository.create({
      params: data,
      include: ["roles", "companies"],
      exclude: ["deleted_at", "password"]
    });

    if (!_.isUndefined(file) && result.image_path) {
      uploadFile(result.image_path, file);
    };

    return result;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_CREATE}: `, err);
    next(err)
  });

export default router.post(
  "/",
  upload.single("image"),
  validator,
  controller
);