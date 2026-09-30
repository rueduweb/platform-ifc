-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "pts" INTEGER NOT NULL,
    "nbW" INTEGER NOT NULL,
    "nbD" INTEGER NOT NULL,
    "nbL" INTEGER NOT NULL,
    "nbGoal" INTEGER NOT NULL,
    "nbConce" INTEGER NOT NULL,
    "avg" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);
