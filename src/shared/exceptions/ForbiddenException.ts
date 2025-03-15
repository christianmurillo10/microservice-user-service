import ErrorException from "./ErrorException";
import { MESSAGE_ERROR_FORBIDDEN } from "../helpers/constant";

class ForbiddenException extends ErrorException {
  status_code = 403;
  message = MESSAGE_ERROR_FORBIDDEN;
};

export default ForbiddenException;