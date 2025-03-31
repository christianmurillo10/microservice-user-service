import { Router } from "express";
import create from "../controllers/users/create.controller";
import read from "../controllers/users/read.controller";
import update from "../controllers/users/update.controller";
import remove from "../controllers/users/delete.controller";
import list from "../controllers/users/list.controller";
import deleteByIds from "../controllers/users/delete-by-ids.controller";
import changePassword from "../controllers/users/change-password.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);
router.use(changePassword);

export default router;