import app from "./app.js";
import { prisma } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL 데이터베이스 연결 성공");

    app.listen(env.PORT, () => {
      if (env.NODE_ENV === "production") {
        console.log(`🚀 운영 서버: 포트 ${env.PORT}에서 실행 중`);
      } else {
        console.log(`🚀 로컬 개발 서버: http://localhost:${env.PORT}`);
      }
    });
  } catch (error) {
    // DB 연결 실패 시 서버 종료
    console.error(`❌ 데이터베이스 연결 실패: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("🛑 서버를 종료합니다.");
  await prisma.$disconnect(); // Prisma 연결 해제
  process.exit(0);
});
