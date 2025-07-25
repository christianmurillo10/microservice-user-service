import { Response } from "express";
import { ValidationError } from "joi";
import config from "../../config/server.config";
import BadRequestException from "../exceptions/bad-request.exception";
import ErrorException from "../exceptions/error.exception";
import { MESSAGE_ERROR_SERVER } from "../constants/message.constant";
import { ERROR_ON_SERVER } from "../constants/error.constant";
import { ApiResponseInput } from "../types/common.type";

export const apiResponse = (
  res: Response,
  input: ApiResponseInput
) => res.status(input.statusCode ?? 200).send({
  service: config.appName,
  version: config.version,
  statusCode: input.statusCode ?? 200,
  status: input.status ?? "success",
  message: input.message,
  errors: input.errors ?? undefined,
  data: input.data ?? undefined,
  pagination: input.pagination ?? undefined,
});

export const apiErrorResponse = (
  res: Response,
  err: Error
) => {
  let statusCode = 500;
  let message = MESSAGE_ERROR_SERVER;
  let errors = [ERROR_ON_SERVER];

  if (err instanceof ValidationError) {
    err = new BadRequestException(err.details.map((_) => _.message));
  };

  if (err instanceof ErrorException) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  };

  if (statusCode === 500) {
    console.log(err);
  };

  return apiResponse(res, {
    statusCode: statusCode,
    status: "error",
    message: message,
    errors: errors,
  }).end;
};