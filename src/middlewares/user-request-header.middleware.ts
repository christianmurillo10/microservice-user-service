import { Request, Response, NextFunction } from "express";
import UserRequestHeaderModel from "../models/user-request-header.model";

const userRequestHeader = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userRequestHeader = new UserRequestHeaderModel();
  userRequestHeader.userAgent = req.headers["user-agent"] ?? null;
  userRequestHeader.host = req.headers["host"] ?? null;
  userRequestHeader.ipAddress = req.ip ?? null;
  userRequestHeader.timestamp = new Date();
  req.userRequestHeader = userRequestHeader;
  next();
};

export default userRequestHeader;