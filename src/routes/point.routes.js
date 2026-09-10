import { Router } from "express";

import { getPointCtr } from "#controllers/point.controller.js";

export const pointRoutes = Router({
  mergeParams: true,
});

pointRoutes.get("/", getPointCtr);

export default pointRoutes;
