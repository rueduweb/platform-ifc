-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "nbGoalsHome" INTEGER NOT NULL,
    "nbGoalsAway" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "gameNumber" TEXT NOT NULL,
    "forfeit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);
