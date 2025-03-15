import { ValidationError } from "joi";
import config from "../../config/server.config";
import { ERROR_ON_SERVER, MESSAGE_ERROR_SERVER } from "../helpers/constant";
import BadRequestException from "../exceptions/BadRequestException";
import ErrorException from "../exceptions/ErrorException";

type ApiResponseInput = {
  service?: string,
  version?: string,
  status_code: number,
  status?: string,
  message?: string,
  errors?: string[],
  result?: unknown,
};

export const apiResponse = (input: ApiResponseInput) => ({
  service: config.app_name,
  version: config.version,
  status_code: input.status_code ?? 200,
  status: input.status ?? "success",
  message: input.message,
  errors: input.errors ?? undefined,
  result: input.result ?? undefined,
});

export const apiErrorResponse = (err: Error) => {
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

  return apiResponse({
    status_code: status_code,
    status: "error",
    message: message,
    errors: errors,
  });
};