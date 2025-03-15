import { Router, Request, Response } from "express";
import { apiResponse } from "../shared/utils/api-response";
import config from "../config/server.config";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(
    apiResponse({
      status_code: 200,
      message: `Welcome to ${config.app_name}`
    })
  ).end()
});

export default router;