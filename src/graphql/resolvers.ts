import { prisma } from '@/lib/db';

const matchInclude = {
  homeTeam:     true,
  awayTeam:     true,
  stadium:      true,
  ticketOffers: true,
} as const;

export const resolvers = {
  Query: {
    matches: async () => {
      return prisma.match.findMany({
        include: matchInclude,
        orderBy: { kickoffTime: 'asc' },
      });
    },

    match: async (_parent: unknown, args: { slug: string }) => {
      return prisma.match.findUnique({
        where:   { slug: args.slug },
        include: matchInclude,
      });
    },

    teams: async () => {
      return prisma.team.findMany({
        orderBy: { name: 'asc' },
      });
    },

    team: async (_parent: unknown, args: { slug: string }) => {
      return prisma.team.findUnique({
        where: { slug: args.slug },
      });
    },

    stadiums: async () => {
      return prisma.stadium.findMany({
        orderBy: { name: 'asc' },
      });
    },

    stadium: async (_parent: unknown, args: { slug: string }) => {
      return prisma.stadium.findUnique({
        where: { slug: args.slug },
      });
    },
  },
};