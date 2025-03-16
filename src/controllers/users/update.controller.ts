import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import _ from "lodash";
import { apiResponse } from "../../shared/utils/api-response";
import { changePassword as validator } from "../../middlewares/validators/users.validator";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../shared/constants/error.constant";
import UsersRepository from "../../shared/repositories/users.repository";
import Users from "../../shared/entities/users.entity";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../shared/exceptions/not-found.exception";
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
    const { params, body, file, companies } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const condition = companies ? { clinic_id: companies.id } : undefined;
    const record = await repository.findById({
      id,
      condition
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const oldData = new Users(record);
    const result = await repository.update({
      id,
      params: {
        ...oldData,
        ...body,
        image_path: setUploadPath(file, repository.imagePath) || oldData.image_path || ""
      },
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
  upload.single("image"),
  validator,
  controller
);