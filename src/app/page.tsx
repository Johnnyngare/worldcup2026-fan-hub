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
    <>
      {/* Hero section */}
      <section className="bg-linear-to-b from-blue-700 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
            USA · Canada · Mexico — June 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            World Cup 2026
            <span className="block text-blue-300">Fan Hub</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Tickets, stadiums, travel guides and match information
            for the biggest tournament on earth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/matches"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View all matches →
            </Link>
            <Link
              href="/matches"
              className="border border-blue-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Get tickets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Matches',  value: matchCount,  icon: '🏆' },
              { label: 'Teams',    value: teamCount,    icon: '🌍' },
              { label: 'Stadiums', value: stadiumCount, icon: '🏟️' },
            ].map((stat) => (
              <div key={stat.label} className="py-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming matches */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Matches</h2>
          <Link
            href="/matches"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-4">
          {upcomingMatches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">

                {/* Teams */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-right flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {match.homeTeam.name}
                    </p>
                    <p className="text-xs text-gray-400">Home</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-xs font-bold text-gray-500">
                    VS
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {match.awayTeam.name}
                    </p>
                    <p className="text-xs text-gray-400">Away</p>
                  </div>
                </div>

                {/* Match info */}
                <div className="text-right ml-6 hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {match.stadium.city}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(match.kickoffTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day:   'numeric',
                    })}
                  </p>
                </div>

              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">{match.stage}</span>
                <span className="text-xs text-blue-600 font-medium group-hover:underline">
                  Tickets & info →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-blue-600 mt-4">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Planning your trip?</h2>
          <p className="text-blue-100 mb-6">
            Get ticket information, stadium guides, and travel tips
            for every World Cup 2026 match.
          </p>
          <Link
            href="/matches"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Explore all matches
          </Link>
        </div>
      </section>
    </>
  );
}