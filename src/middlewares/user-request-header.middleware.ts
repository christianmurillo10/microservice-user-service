import { Request, Response, NextFunction } from "express";
import UserRequestHeaderEntity from "../entities/user-request-header.entity";

const userRequestHeader = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userRequestHeader = new UserRequestHeaderEntity();
  userRequestHeader.userAgent = req.headers["user-agent"] ?? null;
  userRequestHeader.host = req.headers["host"] ?? null;
  userRequestHeader.ipAddress = req.ip ?? null;
  userRequestHeader.timestamp = new Date();
  req.userRequestHeader = userRequestHeader;
  next();
};

export default userRequestHeader;