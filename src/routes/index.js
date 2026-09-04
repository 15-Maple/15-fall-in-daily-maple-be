import express from "express";

import { focusRecordRoutes } from "./focus-records.routes.js";
import { todayHabitRoutes } from "./today-habits.routes.js";

export const router = express.Router();

router.use("/focus-records", focusRecordRoutes);

// 여기에 라우터들을 추가해 주세요

//오늘의 습관 조회
router.use("/logs/:logId/habits", todayHabitRoutes);
