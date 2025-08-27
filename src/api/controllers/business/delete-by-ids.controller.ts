import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { deleteByIds as validator } from "../../../middlewares/validators/organization.validator";
import { MESSAGE_DATA_DELETED } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import OrganizationService from "../../../services/organization.service";
import OrganizationKafkaProducer from "../../../events/producer/organization.producer";

const router = Router();
const organizationService = new OrganizationService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, auth, userRequestHeader } = req;
    await organizationService.deleteMany(body.ids);

    // Send to Kafka
    const organizationProducer = new OrganizationKafkaProducer();
    await organizationProducer.organizationBulkDeletedEventEmitter(
      {
        oldDetails: {},
        newDetails: body
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
      message: MESSAGE_DATA_DELETED
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.post(
  "/delete-by-ids",
  authenticate,
  validator,
  controller
);