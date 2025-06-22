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
): Promise<void> => {
  try {
    const { params, body, file, auth, userRequestHeader } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const existingBusiness = await service.getById(id);
    const newBusiness = await service.save({ ...existingBusiness, ...body }, file);

    // Send to Kafka
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.businessUpdatedEventEmitter(
      {
        old_details: existingBusiness,
        new_details: newBusiness
      },
      auth.id!,
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    );

    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result: newBusiness
    });
  } catch (error) {
    console.error(`${ERROR_ON_UPDATE}: `, error);
    next(error);
  };
};

export default router.put(
  "/:id",
  authenticate,
  upload.single("logo"),
  validator,
  controller
);