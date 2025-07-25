import ErrorException from "./error.exception";
import { MESSAGE_ERROR_NOT_FOUND } from "../constants/message.constant";

class NotFoundException extends ErrorException {
  statusCode = 404;
  message = MESSAGE_ERROR_NOT_FOUND;
};

export default NotFoundException;