import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import BusinessesService from "../../../services/businesses.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import BusinessKafkaProducer from "../../../events/producer/business.producer";

const router = Router();
const businessesService = new BusinessesService();

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

    const existingBusiness = await businessesService.getById(id);
    const newBusiness = await businessesService.delete(id);

    // Send to Kafka
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.businessDeletedEventEmitter(
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
      message: MESSAGE_DATA_DELETED,
      result: newBusiness
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