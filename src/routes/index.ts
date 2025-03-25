import { Router, Request, Response } from "express";
import { apiResponse } from "../shared/utils/api-response";
import config from "../config/server.config";
import businessesRoute from "./businesses.route";
import rolesRoute from "./roles.route";
import usersRoute from "./users.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    status_code: 200,
    message: `Welcome to ${config.app_name}`
  }).end();
});

router.use("/businesses", businessesRoute);
router.use("/roles", rolesRoute);
router.use("/users", usersRoute);

export default router;