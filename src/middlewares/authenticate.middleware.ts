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
    const apiKey = req.query.apiKey as string;

    if (!authorization) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    };

    const authenticateService = new AuthenticateService({
      token: authorization.split(" ")[1],
      apiKey: apiKey
    });
    const authenticateOutput = await authenticateService.execute();

    if (authenticateOutput.organization) {
      req.organization = authenticateOutput.organization;
      req.body.organizationId = authenticateOutput.organization.id;
    }

    req.auth = authenticateOutput.user;
    next();
  } catch (error) {
    next(error);
  };
};

export default authenticate;