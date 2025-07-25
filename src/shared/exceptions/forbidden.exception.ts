import ErrorException from "./error.exception";
import { MESSAGE_ERROR_FORBIDDEN } from "../constants/message.constant";

class ForbiddenException extends ErrorException {
  statusCode = 403;
  message = MESSAGE_ERROR_FORBIDDEN;
};

export default ForbiddenException;