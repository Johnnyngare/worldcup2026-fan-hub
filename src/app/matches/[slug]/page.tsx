import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const match = await prisma.match.findUnique({
    where:   { slug },
    include: { homeTeam: true, awayTeam: true, stadium: true },
  });
  if (!match) return {};
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    description: `Tickets and travel info for ${match.homeTeam.name} vs ${match.awayTeam.name} at ${match.stadium.name}.`,
  };
}

export async function generateStaticParams() {
  const matches = await prisma.match.findMany({ select: { slug: true } });
  return matches.map((m) => ({ slug: m.slug }));
}

export default async function MatchPage({ params }: Props) {
  const { slug } = await params;

  const match = await prisma.match.findUnique({
    where:   { slug },
    include: {
      homeTeam:     true,
      awayTeam:     true,
      stadium:      true,
      ticketOffers: true,
    },
  });

  if (!match) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <Link
        href="/matches"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        ← All matches
      </Link>

      {/* Match header card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">

        {/* Stage banner */}
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
          <span className="text-blue-100 text-sm font-medium">{match.stage}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            match.status === 'LIVE'
              ? 'bg-green-400 text-green-900'
              : 'bg-blue-500 text-blue-100'
          }`}>
            {match.status}
          </span>
        </div>

        {/* Teams */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="text-center flex-1">
              <p className="text-xl md:text-3xl font-bold text-gray-900">
                {match.homeTeam.name}
              </p>
              <p className="text-sm text-gray-400 mt-1 font-medium uppercase tracking-wide">
                {match.homeTeam.code}
              </p>
            </div>

            <div className="text-center shrink-0">
              {match.status === 'FINISHED' ? (
                <div className="text-4xl font-bold text-gray-900">
                  {match.homeScore ?? 0} — {match.awayScore ?? 0}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl px-5 py-3">
                  <span className="text-lg font-bold text-gray-500">VS</span>
                </div>
              )}
            </div>

            <div className="text-center flex-1">
              <p className="text-xl md:text-3xl font-bold text-gray-900">
                {match.awayTeam.name}
              </p>
              <p className="text-sm text-gray-400 mt-1 font-medium uppercase tracking-wide">
                {match.awayTeam.code}
              </p>
            </div>
          </div>

          {/* Date and venue */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid sm:grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date & Time</p>
              <p className="font-medium text-gray-700">
                {new Date(match.kickoffTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month:   'long',
                  day:     'numeric',
                  year:    'numeric',
                })}
              </p>
              <p className="text-gray-500">
                {new Date(match.kickoffTime).toLocaleTimeString('en-US', {
                  hour:   '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Venue</p>
              <p className="font-medium text-gray-700">{match.stadium.name}</p>
              <p className="text-gray-500">{match.stadium.city}, {match.stadium.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket offers */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ticket Options</h2>
        {match.ticketOffers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm">
              No ticket offers available yet. Check back closer to the tournament.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {match.ticketOffers.map((offer) => (
              <a
              
                key={offer.id}
                href={offer.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {offer.providerName}
                    </p>
                    {offer.isOfficial && (
                      <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                        ✓ Official
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{offer.category}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-xl font-bold text-gray-900">
                    ${offer.priceUsd.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600 font-medium group-hover:underline">
                    Get tickets →
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Stadium info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stadium Information</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Stadium',  value: match.stadium.name },
            { label: 'City',     value: `${match.stadium.city}, ${match.stadium.country}` },
            { label: 'Capacity', value: match.stadium.capacity.toLocaleString() + ' seats' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
              <p className="font-semibold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}