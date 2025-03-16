import { Request, Response, NextFunction } from "express";
import { apiErrorResponse } from "../shared/utils/api-response";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  apiErrorResponse(res, err)
};

export default errorHandler;