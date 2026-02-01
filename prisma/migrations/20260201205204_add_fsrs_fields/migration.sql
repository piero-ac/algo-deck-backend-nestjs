/*
  Warnings:

  - The values [ONE,TWO,THREE,FOUR] on the enum `Rating` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nextReviewAt` on the `CurrentReview` table. All the data in the column will be lost.
  - You are about to drop the column `lastElapsedDays` on the `ReviewHistory` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `ReviewHistory` table. All the data in the column will be lost.
  - Added the required column `due` to the `CurrentReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lapses` to the `ReviewHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reps` to the `ReviewHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rating_new" AS ENUM ('AGAIN', 'HARD', 'GOOD', 'EASY');
ALTER TABLE "ReviewHistory" ALTER COLUMN "rating" TYPE "Rating_new" USING ("rating"::text::"Rating_new");
ALTER TYPE "Rating" RENAME TO "Rating_old";
ALTER TYPE "Rating_new" RENAME TO "Rating";
DROP TYPE "public"."Rating_old";
COMMIT;

-- AlterTable
ALTER TABLE "CurrentReview" DROP COLUMN "nextReviewAt",
ADD COLUMN     "due" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "lastReview" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ReviewHistory" DROP COLUMN "lastElapsedDays",
DROP COLUMN "review",
ADD COLUMN     "lapses" INTEGER NOT NULL,
ADD COLUMN     "lastReview" TIMESTAMP(3),
ADD COLUMN     "reps" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "CurrentReview_userId_idx" ON "CurrentReview"("userId");

-- CreateIndex
CREATE INDEX "CurrentReview_problemNumber_idx" ON "CurrentReview"("problemNumber");

-- CreateIndex
CREATE INDEX "ReviewHistory_userId_idx" ON "ReviewHistory"("userId");

-- CreateIndex
CREATE INDEX "ReviewHistory_problemNumber_idx" ON "ReviewHistory"("problemNumber");

-- CreateIndex
CREATE INDEX "ReviewHistory_reviewedAt_idx" ON "ReviewHistory"("reviewedAt");

-- RenameIndex
ALTER INDEX "User_clerkId_key" RENAME TO "User_clerkUserId_key";
