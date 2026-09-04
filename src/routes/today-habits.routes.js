import express from "express";

import * as habitController from "#controllers/today-habits.controller.js";

//{ mergeParams: true } :logId가 안으로 전달되지 않아서 넣음
export const todayHabitRoutes = express.Router({ mergeParams: true });

// GET /api/{logId}/habits
todayHabitRoutes.get("/", habitController.getTodayHabits);
