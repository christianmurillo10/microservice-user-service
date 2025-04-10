import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED, MESSAGE_INVALID_API_KEY, MESSAGE_REQUIRED_API_KEY } from "../shared/constants/message.constant";
import { verifyToken } from "../shared/helpers/jwt.helper";
import { JWT_CLIENT_BUSINESS } from "../shared/constants/jwt.constant";
import BusinessesService from "../services/businesses.service";
import NotFoundException from "../shared/exceptions/not-found.exception";
import ForbiddenException from "../shared/exceptions/forbidden.exception";

const validateApiKey = async (api_key: string) => {
  const businessesService = new BusinessesService();
  const businessesRecord = await businessesService.getByApiKey(api_key)
    .catch(err => {
      if (err instanceof NotFoundException) {
        return null;
      }

      throw err;
    });

  return businessesRecord;
};

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]));
  };

  const token = authorization.split(" ")[1];
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return next(new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]));
  };

  // Validate via api_key if token client is BUSINESS
  if (tokenData.client === JWT_CLIENT_BUSINESS) {
    const { api_key } = req.query;

    if (!api_key) {
      return next(new ForbiddenException([MESSAGE_REQUIRED_API_KEY]));
    };

    const businessesRecord = await validateApiKey(api_key as string);

    if (!businessesRecord) {
      return next(new NotFoundException([MESSAGE_INVALID_API_KEY]));
    }

    req.businesses = businessesRecord;
    req.body.business_id = businessesRecord.id;
  }

  next();
};

export default authenticate;