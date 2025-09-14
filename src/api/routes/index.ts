import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import userRoute from "./user.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    statusCode: 200,
    message: `Welcome to ${config.appName}`
  }).end();
});

router.use("/organizations/:organizationId/users", userRoute);

export default router;