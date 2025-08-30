import { Router } from "express";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.middleware";
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
  listValidation,
  UserController.list
);

router.post(
  "/",
  authenticate,
  upload.single("image"),
  createValidation,
  UserController.create
);

router.get(
  "/:id",
  authenticate,
  UserController.read
);

router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  updateValidation,
  UserController.update
);

router.put(
  "/change-password/:id",
  authenticate,
  changePasswordValidation,
  UserController.changePassword
);

router.delete(
  "/:id",
  authenticate,
  UserController.remove
);

router.post(
  "/delete-by-ids",
  authenticate,
  deleteByIdsValidation,
  UserController.deleteByIds
);

export default router;