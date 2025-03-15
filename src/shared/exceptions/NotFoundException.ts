import ErrorException from "./ErrorException";
import { MESSAGE_ERROR_NOT_FOUND } from "../helpers/constant";

class NotFoundException extends ErrorException {
  status_code = 404;
  message = MESSAGE_ERROR_NOT_FOUND;
};

export default NotFoundException;