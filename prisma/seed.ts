import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Did you create a .env file?');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed engine...');

  await prisma.ticketOffer.deleteMany();
  await prisma.match.deleteMany();
  await prisma.stadium.deleteMany();
  await prisma.team.deleteMany();

  const metlife = await prisma.stadium.create({
    data: {
      name: 'MetLife Stadium',
      city: 'East Rutherford',
      country: 'USA',
      capacity: 82500,
      slug: 'metlife-stadium-new-york',
    },
  });

  const azteca = await prisma.stadium.create({
    data: {
      name: 'Estadio Azteca',
      city: 'Mexico City',
      country: 'Mexico',
      capacity: 87523,
      slug: 'estadio-azteca-mexico-city',
    },
  });

  const usa = await prisma.team.create({
    data: { name: 'United States', code: 'USA', slug: 'united-states' },
  });
  const england = await prisma.team.create({
    data: { name: 'England', code: 'ENG', slug: 'england' },
  });
  const mexico = await prisma.team.create({
    data: { name: 'Mexico', code: 'MEX', slug: 'mexico' },
  });
  const france = await prisma.team.create({
    data: { name: 'France', code: 'FRA', slug: 'france' },
  });

  const match1 = await prisma.match.create({
    data: {
      homeTeamId: usa.id,
      awayTeamId: england.id,
      stadiumId: metlife.id,
      kickoffTime: new Date('2026-06-15T20:00:00Z'),
      stage: 'Group Stage - Group A',
      slug: 'usa-vs-england-group-a',
      status:      'SCHEDULED',
    },
  });

  const match2 = await prisma.match.create({
    data: {
      homeTeamId: mexico.id,
      awayTeamId: france.id,
      stadiumId: azteca.id,
      kickoffTime: new Date('2026-06-18T18:00:00Z'),
      stage: 'Group Stage - Group B',
      slug: 'mexico-vs-france-group-b',
      status:      'SCHEDULED',
    },
  });

  await prisma.ticketOffer.createMany({
    data: [
      {
        matchId: match1.id,
        providerName: 'Official FIFA Portal',
        category: 'Category 1',
        priceUsd: 250.0,
        affiliateUrl: 'https://fifa.com',
        isOfficial: true,
      },
      {
        matchId: match1.id,
        providerName: 'Match Hospitality Official',
        category: 'Club Suite',
        priceUsd: 1250.0,
        affiliateUrl: 'https://fifa.com',
        isOfficial: true,
      },
      {
        matchId: match2.id,
        providerName: 'Official FIFA Portal',
        category: 'Category 3',
        priceUsd: 95.0,
        affiliateUrl: 'https://fifa.com',
        isOfficial: true,
      },
    ],
  });

  console.log('✅ Database seeding complete! Initial fixtures generated.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });