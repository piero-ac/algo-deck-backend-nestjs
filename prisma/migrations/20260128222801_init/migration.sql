-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "topics" TEXT DEFAULT '',
    "difficulty" TEXT NOT NULL,
    "similarProblemNumbers" TEXT DEFAULT '',
    "similarProblemTexts" TEXT DEFAULT '',

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "CurrentReview" (
    "userId" INTEGER NOT NULL,
    "problemNumber" INTEGER NOT NULL,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "stability" DOUBLE PRECISION NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "elapsedDays" INTEGER NOT NULL,
    "scheduledDays" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "lapses" INTEGER NOT NULL,
    "learningSteps" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,
    "lastReview" TEXT NOT NULL,

    CONSTRAINT "CurrentReview_pkey" PRIMARY KEY ("userId","problemNumber")
);

-- CreateTable
CREATE TABLE "ReviewHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "problemNumber" INTEGER NOT NULL,
    "rating" "Rating" NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "comments" TEXT DEFAULT '',
    "state" INTEGER NOT NULL,
    "due" TEXT NOT NULL,
    "stability" DOUBLE PRECISION NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "elapsedDays" INTEGER NOT NULL,
    "lastElapsedDays" INTEGER NOT NULL,
    "scheduledDays" INTEGER NOT NULL,
    "learningSteps" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "ReviewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CurrentReview" ADD CONSTRAINT "CurrentReview_problemNumber_fkey" FOREIGN KEY ("problemNumber") REFERENCES "Problem"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentReview" ADD CONSTRAINT "CurrentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_problemNumber_fkey" FOREIGN KEY ("problemNumber") REFERENCES "Problem"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
