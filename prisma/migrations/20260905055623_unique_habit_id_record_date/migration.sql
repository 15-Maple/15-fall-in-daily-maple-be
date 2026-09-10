/*
  Warnings:

  - A unique constraint covering the columns `[habit_id,record_date]` on the table `habit_histories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "habit_histories_habit_id_record_date_key" ON "habit_histories"("habit_id", "record_date");
