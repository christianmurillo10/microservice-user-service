import { Request, Response, NextFunction } from "express";
import NotFoundException from "../shared/exceptions/not-found.exception";

const routeNotFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => next(new NotFoundException(["Route not found! Please check your request."]));

export default routeNotFoundHandler;