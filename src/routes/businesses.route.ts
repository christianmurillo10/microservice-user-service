import { Router } from "express";
import create from "../controllers/businesses/create.controller";
import read from "../controllers/businesses/read.controller";
import update from "../controllers/businesses/update.controller";
import remove from "../controllers/businesses/delete.controller";
import list from "../controllers/businesses/list.controller";
import deleteByIds from "../controllers/businesses/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;