import { prisma } from '@/lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'World Cup 2026 Matches | World Cup Fan Hub',
  description: 'Full schedule of all 2026 FIFA World Cup matches with ticket information.',
};

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam:     true,
      awayTeam:     true,
      stadium:      true,
      ticketOffers: true,
    },
    orderBy: { kickoffTime: 'asc' },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">World Cup 2026 Matches</h1>
      <p className="text-gray-600 mb-8">
        {matches.length} matches · All times UTC
      </p>

      <div className="space-y-4">
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.slug}`}
            className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg">
                  {match.homeTeam.name}
                </span>
                <span className="text-gray-400 text-sm font-medium">vs</span>
                <span className="font-semibold text-lg">
                  {match.awayTeam.name}
                </span>
              </div>
              <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {match.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-500 flex gap-4">
              <span>📍 {match.stadium.name}, {match.stadium.city}</span>
              <span>🗓️ {new Date(match.kickoffTime).toLocaleDateString('en-US', {
                weekday: 'short',
                month:   'short',
                day:     'numeric',
                hour:    '2-digit',
                minute:  '2-digit',
              })}</span>
            </div>

            <div className="mt-2 text-sm text-gray-400">
              {match.stage}
              {match.ticketOffers.length > 0 && (
                <span className="ml-3 text-green-600">
                  · {match.ticketOffers.length} ticket option{match.ticketOffers.length !== 1 ? 's' : ''} available
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}