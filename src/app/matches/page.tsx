import { prisma } from '@/lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'Matches',
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

  const statusColors: Record<string, string> = {
    SCHEDULED: 'bg-blue-50 text-blue-700',
    LIVE:      'bg-green-50 text-green-700',
    FINISHED:  'bg-gray-100 text-gray-600',
    POSTPONED: 'bg-red-50 text-red-700',
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">World Cup 2026 Matches</h1>
        <p className="text-gray-500 mt-1">
          {matches.length} matches · All times UTC
        </p>
      </div>

      {/* Match list */}
      <div className="grid gap-3">
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group block"
          >
            <div className="flex items-center justify-between gap-4">

              {/* Teams */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                  {match.homeTeam.name}
                </span>
                <span className="text-xs font-bold text-gray-400 shrink-0">VS</span>
                <span className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                  {match.awayTeam.name}
                </span>
              </div>

              {/* Status badge */}
              <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${statusColors[match.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {match.status}
              </span>

            </div>

            {/* Match details row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>🏟️ {match.stadium.name}, {match.stadium.city}</span>
              <span>
                🗓️ {new Date(match.kickoffTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month:   'short',
                  day:     'numeric',
                  hour:    '2-digit',
                  minute:  '2-digit',
                })}
              </span>
              <span className="text-gray-400">{match.stage}</span>
              {match.ticketOffers.length > 0 && (
                <span className="text-green-600 font-medium">
                  ✓ {match.ticketOffers.length} ticket option{match.ticketOffers.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

          </Link>
        ))}
      </div>

    </main>
  );
}