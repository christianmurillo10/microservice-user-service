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
const service = new BusinessesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body, file, auth, userRequestHeader } = req;
    const record = await service.getByName(body.name)
      .catch(err => {
        if (err instanceof NotFoundException) {
          return null;
        }

        throw err;
      });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const result = await service.save(body, file);

    console.log("auth", auth)

    console.log("TEST",
      {
        old_details: {} as BusinessesModel,
        new_details: result
      },
      auth.id!,
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    )

    // Execute producer
    const businessProducer = new BusinessKafkaProducer();
    await businessProducer.publishBusinessCreated(
      {
        old_details: {} as BusinessesModel,
        new_details: result
      },
      auth.id!,
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
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_CREATE}: `, err);
    next(err)
  });

export default router.post(
  "/",
  authenticate,
  upload.single("logo"),
  validator,
  controller
);