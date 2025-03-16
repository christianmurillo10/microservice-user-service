import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import _ from "lodash";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../shared/constants/error.constant";
import { create as validator } from "../../middlewares/validators/comanies.validator";
import CompaniesRepository from "../../shared/repositories/companies.repository";
import Companies from "../../shared/entities/companies.entity";
import ConflictException from "../../shared/exceptions/conflict.exception";
import { setUploadPath, uploadFile } from "../../shared/helpers/upload.helper";

const router = Router();
const upload = multer();
const repository = new CompaniesRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, file } = req;
    const record = await repository.findByName({ name: body.name });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const data = new Companies({
      ...body,
      logo_path: setUploadPath(file, repository.logoPath)
    });
    const result = await repository.create({
      params: data,
      exclude: ["deleted_at"]
    });

    if (!_.isUndefined(file) && result.logo_path) {
      uploadFile(result.logo_path, file);
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
  upload.single("logo"),
  validator,
  controller
);