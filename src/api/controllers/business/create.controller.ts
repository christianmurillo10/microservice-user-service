import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../middlewares/validators/business.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import BusinessService from "../../../services/business.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import BusinessKafkaProducer from "../../../events/producer/business.producer";
import BusinessModel from "../../../models/business.model";

const router = Router();
const upload = multer();
const businessService = new BusinessService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, file, auth, userRequestHeader } = req;
    const existingBusiness = await businessService.getByName(body.name)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingBusiness) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newBusiness = await businessService.save(body, file);

    // Send to Kafka
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.businessCreatedEventEmitter(
      {
        oldDetails: {} as BusinessModel,
        newDetails: newBusiness
      },
      auth.id!,
      {
        ipAddress: userRequestHeader.ipAddress ?? undefined,
        host: userRequestHeader.host ?? undefined,
        userAgent: userRequestHeader.userAgent ?? undefined
      }
    );

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newBusiness
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