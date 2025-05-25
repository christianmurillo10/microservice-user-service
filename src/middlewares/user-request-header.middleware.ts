import { Request, Response, NextFunction } from "express";
import UserRequestHeaderModel from "../models/user-request-header.model";

const userRequestHeader = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userRequestHeader = new UserRequestHeaderModel();
  userRequestHeader.user_agent = req.headers["user-agent"] ?? null;
  userRequestHeader.host = req.headers["host"] ?? null;
  userRequestHeader.ip_address = req.ip ?? null;
  userRequestHeader.timestamp = new Date();
  req.userRequestHeader = userRequestHeader;
  next();
};

export default userRequestHeader;