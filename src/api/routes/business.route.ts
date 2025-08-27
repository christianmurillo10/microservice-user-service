import { Router } from "express";
import create from "../controllers/organization/create.controller";
import read from "../controllers/organization/read.controller";
import update from "../controllers/organization/update.controller";
import remove from "../controllers/organization/delete.controller";
import list from "../controllers/organization/list.controller";
import deleteByIds from "../controllers/organization/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;