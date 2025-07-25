import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import BusinessService from "../../../services/business.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import BusinessKafkaProducer from "../../../events/producer/business.producer";

const router = Router();
const businessService = new BusinessService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, auth, userRequestHeader } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const existingBusiness = await businessService.getById(id);
    const newBusiness = await businessService.delete(id);

    // Send to Kafka
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.businessDeletedEventEmitter(
      {
        oldDetails: existingBusiness,
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
      statusCode: 200,
      message: MESSAGE_DATA_DELETED,
      data: newBusiness
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.delete(
  "/:id",
  authenticate,
  controller
);