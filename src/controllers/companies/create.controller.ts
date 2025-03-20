import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../shared/constants/error.constant";
import { create as validator } from "../../middlewares/validators/companies.validator";
import CompaniesService from "../../services/companies.service";
import ConflictException from "../../shared/exceptions/conflict.exception";
import NotFoundException from "../../shared/exceptions/not-found.exception";

const router = Router();
const upload = multer();
const service = new CompaniesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, file } = req;
    const record = await service.getByName(body.name)
      .catch(err => {
        if (err instanceof NotFoundException) {
          return null;
        }

        throw err;
      });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    return await service.save(body, file);
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