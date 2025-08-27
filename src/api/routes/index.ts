import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import organizationRoute from "./organization.route";
import userRoute from "./user.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    statusCode: 200,
    message: `Welcome to ${config.appName}`
  }).end();
});

router.use("/organization", organizationRoute);
router.use("/user", userRoute);

export default router;