import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const teams = [
  'ATLASLION FC',
  'MDJ FC',
  'BLACK PANAMA FC',
  'FC PARIS 17',
  'TÊTE CRAMÉE FC',
  'TS FC',
  'FCPS',
  'DEMOS FOOTBALL CLUB',
  'ARZ FC',
  'FC PARIS CLICHY',
  'PASTA FC',
  'OCCITAN FC',
  'LE TIR ASCBB',
  'IFC GENERATION IMPACT',
];

async function main() {
  await prisma.team.deleteMany();

  await prisma.team.createMany({
    data: teams.map((name, index) => ({
      name,
      rank: index + 1,
      pts: 0,
      nbW: 0,
      nbD: 0,
      nbL: 0,
      nbGoal: 0,
      nbConce: 0,
      avg: 0,
    })),
  });

  console.log(`✅ ${teams.length} équipes créées`);
}

main()
  .catch((error) => {
    console.error('❌ Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
