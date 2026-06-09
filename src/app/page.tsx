import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function HomePage() {
  const [matchCount, teamCount, stadiumCount] = await Promise.all([
    prisma.match.count(),
    prisma.team.count(),
    prisma.stadium.count(),
  ]);

  const upcomingMatches = await prisma.match.findMany({
    take:    3,
    include: { homeTeam: true, awayTeam: true, stadium: true },
    orderBy: { kickoffTime: 'asc' },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">⚽ World Cup 2026 Fan Hub</h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Your complete guide to tickets, stadiums, and travel 
          for the 2026 FIFA World Cup.
        </p>
        <Link
          href="/matches"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View all matches →
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Matches', value: matchCount },
          { label: 'Teams',   value: teamCount   },
          { label: 'Venues',  value: stadiumCount },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming matches preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Matches</h2>
          <Link href="/matches" className="text-blue-600 text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingMatches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.slug}`}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-400 transition-all"
            >
              <span className="font-medium">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </span>
              <span className="text-sm text-gray-500">
                {match.stadium.city}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}