import ErrorException from "./error.exception";
import { MESSAGE_ERROR_UNAUTHORIZED } from "../constants/message.constant";

class UnauthorizedException extends ErrorException {
  status_code = 401;
  message = MESSAGE_ERROR_UNAUTHORIZED;
};

export default UnauthorizedException;