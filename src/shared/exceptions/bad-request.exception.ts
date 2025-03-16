import ErrorException from "./error.exception";
import { MESSAGE_ERROR_BAD_REQUEST } from "../constants/message.constant";

class BadRequestException extends ErrorException {
  status_code = 400;
  message = MESSAGE_ERROR_BAD_REQUEST;
};

export default BadRequestException;