import { Router } from "express";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  changePassword as changePasswordValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validators/user.validator";
import * as UserController from "../controllers/user";

const upload = multer();
const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "user"),
  listValidation,
  UserController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "user"),
  upload.single("image"),
  createValidation,
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
  updateValidation,
  UserController.update
);

router.put(
  "/change-password/:id",
  authenticate,
  authorize("changePassword", "user"),
  changePasswordValidation,
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
  deleteByIdsValidation,
  authorize("delete", "user"),
  UserController.deleteByIds
);

export default router;