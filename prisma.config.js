import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node scripts/seed.js --allow-reset=fall_in_daily",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
