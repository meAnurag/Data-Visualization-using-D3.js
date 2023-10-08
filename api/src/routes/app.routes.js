import Express from "express";

import {
  getAvailableFilters,
  getData,
} from "../controllers/app.controllers.js";

const router = Express.Router();

router.get("/data", getData);
router.get("/getavailablefilters", getAvailableFilters);

export default router;
