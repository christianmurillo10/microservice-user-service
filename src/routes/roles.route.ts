import { Router } from "express";
import create from "../controllers/roles/create.controller";
import read from "../controllers/roles/read.controller";
import update from "../controllers/roles/update.controller";
import remove from "../controllers/roles/delete.controller";
import list from "../controllers/roles/list.controller";
import deleteByIds from "../controllers/roles/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;