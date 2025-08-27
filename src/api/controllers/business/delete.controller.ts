import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import OrganizationService from "../../../services/organization.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import OrganizationKafkaProducer from "../../../events/producer/organization.producer";

const router = Router();
const organizationService = new OrganizationService();

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

    const existingOrganization = await organizationService.getById(id);
    const newOrganization = await organizationService.delete(id);

    // Send to Kafka
    const organizationProducer = new OrganizationKafkaProducer();
    await organizationProducer.organizationDeletedEventEmitter(
      {
        oldDetails: existingOrganization,
        newDetails: newOrganization
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
      data: newOrganization
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