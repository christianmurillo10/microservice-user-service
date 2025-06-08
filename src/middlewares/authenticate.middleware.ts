import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED, MESSAGE_INVALID_API_KEY, MESSAGE_REQUIRED_API_KEY } from "../shared/constants/message.constant";
import { verifyToken } from "../shared/helpers/jwt.helper";
import UsersService from "../services/users.service";
import BusinessesService from "../services/businesses.service";
import NotFoundException from "../shared/exceptions/not-found.exception";
import ForbiddenException from "../shared/exceptions/forbidden.exception";
import { UsersAccessType } from "../entities/users.entity";

const validateUserRecord = async (id: string) => {
  const usersService = new UsersService();
  const usersRecord = await usersService.getById({ id })
    .catch(err => {
      if (err instanceof NotFoundException) {
        return null;
      }

      throw err;
    });

  return usersRecord;
};

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
) => Promise.resolve(req)
  .then(async (req) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    };

    const token = authorization.split(" ")[1];
    const tokenData = verifyToken(token);

    if (!tokenData) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    return tokenData
  })
  .then(async (tokenData) => {
    // Validate users logged status
    const usersRecord = await validateUserRecord(tokenData.id as unknown as string);

    if (!usersRecord) {
      throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
    }

    if (Boolean(usersRecord.is_logged) === false) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    }

    // Validate via api_key if token client is BUSINESS
    if (tokenData.client === UsersAccessType.Business) {
      const { api_key } = req.query;

      if (!api_key) {
        throw new ForbiddenException([MESSAGE_REQUIRED_API_KEY]);
      };

      const businessesRecord = await validateApiKey(api_key as string);

      if (!businessesRecord) {
        throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
      }

      req.businesses = businessesRecord;
      req.body.business_id = businessesRecord.id;
    }

    req.auth = usersRecord;
    next();
  })
  .catch(err => next(err));

export default authenticate;