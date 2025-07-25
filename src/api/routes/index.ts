import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import businessRoute from "./business.route";
import userRoute from "./user.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    statusCode: 200,
    message: `Welcome to ${config.appName}`
  }).end();
});

router.use("/business", businessRoute);
router.use("/user", userRoute);

export default router;