import { Router } from "express";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { changePasswordSchema, createSchema, deleteByIdsSchema, listSchema, updateSchema } from "../../validations/user.schema";
import * as UserController from "../controllers/user";

const upload = multer();
const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "user"),
  validateQuery(listSchema),
  UserController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "user"),
  upload.single("image"),
  validateBody(createSchema),
  UserController.create
);

router.get(
  "/:id",
  authorize("read", "user"),
  authenticate,
  UserController.read
);

router.put(
  "/:id",
  authenticate,
  authorize("update", "user"),
  upload.single("image"),
  validateBody(updateSchema),
  UserController.update
);

router.put(
  "/change-password/:id",
  authenticate,
  authorize("changePassword", "user"),
  validateBody(changePasswordSchema),
  UserController.changePassword
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "user"),
  UserController.remove
);

router.post(
  "/delete-by-ids",
  authenticate,
  authorize("delete", "user"),
  validateBody(deleteByIdsSchema),
  UserController.deleteByIds
);

export default router;