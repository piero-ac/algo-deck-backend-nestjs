/*
  Warnings:

  - Changed the type of `due` on the `ReviewHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `review` on the `ReviewHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ReviewHistory" DROP COLUMN "due",
ADD COLUMN     "due" TIMESTAMP(3) NOT NULL,
DROP COLUMN "review",
ADD COLUMN     "review" TIMESTAMP(3) NOT NULL;
