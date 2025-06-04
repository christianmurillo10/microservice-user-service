import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { update as validator } from "../../../middlewares/validators/businesses.validator";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import BusinessesService from "../../../services/businesses.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import BusinessKafkaProducer from "../../../events/producer/business.producer";

const router = Router();
const upload = multer();
const service = new BusinessesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, body, file, userRequestHeader } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const record = await service.getById(id);
    const result = await service.save({ ...record, ...body }, file);

    // Execute producer
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.publishBusinessUpdated(
      {
        old_details: record,
        new_details: result
      },
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      });

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
  authenticate,
  upload.single("logo"),
  validator,
  controller
);