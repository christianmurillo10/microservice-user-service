import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../middlewares/validators/organization.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import OrganizationService from "../../../services/organization.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";
import OrganizationKafkaProducer from "../../../events/producer/organization.producer";
import OrganizationModel from "../../../models/organization.model";

const router = Router();
const upload = multer();
const organizationService = new OrganizationService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, file, auth, userRequestHeader } = req;
    const existingOrganization = await organizationService.getByName(body.name)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingOrganization) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newOrganization = await organizationService.save(body, file);

    // Send to Kafka
    const organizationProducer = new OrganizationKafkaProducer();
    await organizationProducer.organizationCreatedEventEmitter(
      {
        oldDetails: {} as OrganizationModel,
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
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newOrganization
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