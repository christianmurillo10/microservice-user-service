import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { MESSAGE_DATA_NOT_LOGGED } from "../shared/constants/message.constant";
import AuthenticateService from "../services/authenticate.service";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;
    const apiKey = req.query.api_key as string;

    if (!authorization) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    };

    const authenticateService = new AuthenticateService({
      token: authorization.split(" ")[1],
      api_key: apiKey
    });
    const authenticateOutput = await authenticateService.execute();

    if (authenticateOutput.businesses) {
      req.businesses = authenticateOutput.businesses;
      req.body.business_id = authenticateOutput.businesses.id;
    }

    req.auth = authenticateOutput.users;
    next();
  } catch (error) {
    next(error);
  };
};

export default authenticate;