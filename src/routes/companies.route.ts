import { Router } from "express";
import create from "../controllers/companies/create.controller";
import read from "../controllers/companies/read.controller";
import update from "../controllers/companies/update.controller";
import remove from "../controllers/companies/delete.controller";
import list from "../controllers/companies/list.controller";
import deleteByIds from "../controllers/companies/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;