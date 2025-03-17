import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import _ from "lodash";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../shared/constants/error.constant";
import { create as validator } from "../../middlewares/validators/companies.validator";
import CompaniesRepository from "../../shared/repositories/companies.repository";
import Companies from "../../shared/entities/companies.entity";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../shared/exceptions/not-found.exception";
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
    const { params, body, file } = req;
    const id = params.id;

    if (id === ":id" || typeof id !== "number") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const record = await repository.findById({ id: Number(id) });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const oldData = new Companies(record);
    const result = await repository.update({
      id: Number(id),
      params: {
        ...oldData,
        ...body,
        logo_path: setUploadPath(file, repository.logoPath) || oldData.logo_path || ""
      },
      exclude: ["deleted_at"]
    });

    if (!_.isUndefined(file) && result.logo_path) {
      uploadFile(result.logo_path, file);
    };

    return result;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_UPDATE}: `, err);
    next(err)
  });

export default router.put(
  "/:id",
  upload.single("logo"),
  validator,
  controller
);