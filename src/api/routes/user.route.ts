import { Router } from "express";
import create from "../controllers/user/create.controller";
import read from "../controllers/user/read.controller";
import update from "../controllers/user/update.controller";
import remove from "../controllers/user/delete.controller";
import list from "../controllers/user/list.controller";
import deleteByIds from "../controllers/user/delete-by-ids.controller";
import changePassword from "../controllers/user/change-password.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);
router.use(changePassword);

export default router;