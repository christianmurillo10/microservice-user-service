import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import BusinessesService from "../../../services/businesses.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import BusinessKafkaProducer from "../../../events/producer/business.producer";

const router = Router();
const service = new BusinessesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, userRequestHeader } = req;
    const id = Number(params.id);

    if (isNaN(id)) {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const record = await service.getById(id);
    const result = await service.delete(id);

    // Execute producer
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.publishBusinessDeleted(
      {
        old_details: record,
        new_details: result
      },
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    );

    return result;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_DELETED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_DELETE}: `, err);
    next(err)
  });

export default router.delete(
  "/:id",
  authenticate,
  controller
);