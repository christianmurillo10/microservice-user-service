import { Request, Response, NextFunction } from "express";
import { MESSAGE_DATA_NOT_LOGGED } from "../shared/constants/message.constant";
import AuthenticateService from "../services/authenticate.service";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    };

    const token = authorization.split(" ")[1];
    const authenticateService = new AuthenticateService(token);
    const authenticateOutput = await authenticateService.execute();

    req.auth = authenticateOutput.user;
    next();
  } catch (error) {
    next(error);
  };
};

export default authenticate;