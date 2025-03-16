import ErrorException from "./error.exception";
import { MESSAGE_ERROR_CONFLICT } from "../constants/message.constant";

class ConflictException extends ErrorException {
  status_code = 409;
  message = MESSAGE_ERROR_CONFLICT;
};

export default ConflictException;