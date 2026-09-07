import express from "express";

import { focusRecordRoutes } from "./focus-records.routes.js";
import { logRoutes } from "./logs.routes.js";
import { todayHabitRoutes, togleHabitRoutes } from "./today-habits.routes.js";

export const router = express.Router();

router.use("/focus-records", focusRecordRoutes);

// 여기에 라우터들을 추가해 주세요
router.use("/logs", logRoutes);

//오늘의 습관 조회
router.use("/logs/:logId/habits", todayHabitRoutes);
router.use("/habits/:habitId/check", togleHabitRoutes);
