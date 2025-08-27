import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { update as validator } from "../../../middlewares/validators/organization.validator";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import OrganizationService from "../../../services/organization.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import OrganizationKafkaProducer from "../../../events/producer/organization.producer";

const router = Router();
const upload = multer();
const service = new OrganizationService();

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

    const existingOrganization = await service.getById(id);
    const newOrganization = await service.save({ ...existingOrganization, ...body }, file);

    // Send to Kafka
    const organizationProducer = new OrganizationKafkaProducer();
    await organizationProducer.organizationUpdatedEventEmitter(
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
      message: MESSAGE_DATA_UPDATED,
      data: newOrganization
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