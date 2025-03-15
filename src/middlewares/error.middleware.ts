import { Request, Response, NextFunction } from "express";
import { apiErrorResponse } from "../shared/utils/api-response";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const response = apiErrorResponse(err);
  res.status(response.status_code)
    .send(response).
    end;
};

export default errorHandler;