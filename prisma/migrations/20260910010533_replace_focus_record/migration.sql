/*
  Warnings:

  - You are about to drop the `focus_records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "focus_records" DROP CONSTRAINT "focus_records_log_id_fkey";

-- DropTable
DROP TABLE "focus_records";

-- DropEnum
DROP TYPE "FocusStatus";

-- CreateTable
CREATE TABLE "focus_sessions" (
    "log_id" INTEGER NOT NULL,
    "target_seconds" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "focus_sessions_pkey" PRIMARY KEY ("log_id")
);

-- AddForeignKey
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_log_id_fkey" FOREIGN KEY ("log_id") REFERENCES "logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
