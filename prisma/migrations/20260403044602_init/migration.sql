/*
  Warnings:

  - You are about to drop the column `Total` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `total` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "Total",
ADD COLUMN     "total" INTEGER NOT NULL;
