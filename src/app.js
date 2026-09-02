import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { NotFoundException } from "./errors/index.js";
import { errorHandler } from "./middlewares/index.js";
import { router as apiRouter } from "./routes/index.js";

const app = express();

// 보안 헤더
app.use(helmet());

// 로깅
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// cors
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// json 파싱
app.use(express.json());

// 헬스체크 라우트
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 라우터 등록
app.use("/api", apiRouter);

// api notFound
app.use((req, _res, _next) => {
  throw new NotFoundException(
    `요청한 경로를 찾을 수 없습니다: ${req.originalUrl}`,
  );
});

// 에러 핸들링
app.use(errorHandler);

export default app;
