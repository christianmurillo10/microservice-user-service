import ErrorException from "./error.exception";
import { MESSAGE_ERROR_CONFLICT } from "../constants/message.constant";

class ConflictException extends ErrorException {
  statusCode = 409;
  message = MESSAGE_ERROR_CONFLICT;
};

export default ConflictException;