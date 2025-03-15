import { MESSAGE_ERROR_SERVER } from "../helpers/constant";

class ErrorException extends Error {
  status_code = 500;
  errors: string[] = [];
  message = MESSAGE_ERROR_SERVER;

  constructor(errors?: string[], message?: string, status_code?: number) {
    super();

    this.status_code = status_code || this.status_code;
    this.message = message || this.message;
    this.errors = errors || this.errors;
  };
};

export default ErrorException;