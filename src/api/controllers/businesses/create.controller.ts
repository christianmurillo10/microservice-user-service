import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../middlewares/validators/businesses.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import BusinessesService from "../../../services/businesses.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import BusinessKafkaProducer from "../../../events/producer/business.producer";
import BusinessesModel from "../../../models/businesses.model";

const router = Router();
const upload = multer();
const businessesService = new BusinessesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, file, auth, userRequestHeader } = req;
    const existingBusiness = await businessesService.getByName(body.name)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingBusiness) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newBusiness = await businessesService.save(body, file);

    // Send to Kafka
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.publishBusinessCreated(
      {
        old_details: {} as BusinessesModel,
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
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result: newBusiness
    });
  } catch (error) {
    console.error(`${ERROR_ON_CREATE}: `, error);
    next(error);
  };
};

export default router.post(
  "/",
  authenticate,
  upload.single("logo"),
  validator,
  controller
);