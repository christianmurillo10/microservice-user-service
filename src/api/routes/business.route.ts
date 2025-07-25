import { Router } from "express";
import create from "../controllers/business/create.controller";
import read from "../controllers/business/read.controller";
import update from "../controllers/business/update.controller";
import remove from "../controllers/business/delete.controller";
import list from "../controllers/business/list.controller";
import deleteByIds from "../controllers/business/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;