import express from "express";

import { focusRecordRoutes } from "./focus-records.routes.js";

export const router = express.Router();

router.use("/focus-records", focusRecordRoutes);

// 여기에 라우터들을 추가해 주세요
