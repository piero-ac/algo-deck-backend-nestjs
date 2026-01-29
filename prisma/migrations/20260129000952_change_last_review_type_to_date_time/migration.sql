/*
  Warnings:

  - Changed the type of `lastReview` on the `CurrentReview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CurrentReview" DROP COLUMN "lastReview",
ADD COLUMN     "lastReview" TIMESTAMP(3) NOT NULL;
