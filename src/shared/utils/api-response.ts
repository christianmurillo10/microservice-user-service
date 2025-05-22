import { Response } from "express";
import { ValidationError } from "joi";
import config from "../../config/server.config";
import BadRequestException from "../exceptions/bad-request.exception";
import ErrorException from "../exceptions/error.exception";
import { MESSAGE_ERROR_SERVER } from "../constants/message.constant";
import { ERROR_ON_SERVER } from "../constants/error.constant";
import { TApiResponseInput } from "../types/common.type";

export const apiResponse = (
  res: Response,
  input: TApiResponseInput
) => res.status(input.status_code ?? 200).send({
  service: config.app_name,
  version: config.version,
  status_code: input.status_code ?? 200,
  status: input.status ?? "success",
  message: input.message,
  errors: input.errors ?? undefined,
  result: input.result ?? undefined,
});

export const apiErrorResponse = (
  res: Response,
  err: Error
) => {
  let status_code = 500;
  let message = MESSAGE_ERROR_SERVER;
  let errors = [ERROR_ON_SERVER];

  if (err instanceof ValidationError) {
    err = new BadRequestException(err.details.map((_) => _.message));
  };

  if (err instanceof ErrorException) {
    status_code = err.status_code;
    message = err.message;
    errors = err.errors;
  };

  if (status_code === 500) {
    console.log(err);
  };

  return apiResponse(res, {
    status_code: status_code,
    status: "error",
    message: message,
    errors: errors,
  }).end;
};