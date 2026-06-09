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
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} — World Cup 2026`,
    description: `Get tickets and travel info for ${match.homeTeam.name} vs ${match.awayTeam.name} at ${match.stadium.name}, ${match.stadium.city}.`,
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

      <Link href="/matches" className="text-blue-600 text-sm hover:underline">
        ← All matches
      </Link>

      {/* Match header */}
      <div className="mt-6 text-center py-8 border rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500 mb-2">{match.stage}</p>
        <div className="flex items-center justify-center gap-8">
          <span className="text-2xl font-bold">{match.homeTeam.name}</span>
          <span className="text-gray-400 font-medium">vs</span>
          <span className="text-2xl font-bold">{match.awayTeam.name}</span>
        </div>
        <p className="mt-4 text-gray-600">
          📍 {match.stadium.name} · {match.stadium.city}, {match.stadium.country}
        </p>
        <p className="text-gray-600">
          🗓️ {new Date(match.kickoffTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year:    'numeric',
            month:   'long',
            day:     'numeric',
            hour:    '2-digit',
            minute:  '2-digit',
            timeZoneName: 'short',
          })}
        </p>
        <span className="mt-3 inline-block text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {match.status}
        </span>
      </div>

      {/* Ticket offers */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ticket Options</h2>
        {match.ticketOffers.length === 0 ? (
          <p className="text-gray-500">No ticket offers available yet.</p>
        ) : (
          <div className="space-y-3">
            {match.ticketOffers.map((offer) => (
              <a
                key={offer.id}
                href={offer.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div>
                  <p className="font-medium">{offer.providerName}</p>
                  <p className="text-sm text-gray-500">{offer.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${offer.priceUsd.toFixed(2)}</p>
                  {offer.isOfficial && (
                    <span className="text-xs text-green-600">✓ Official</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Stadium info */}
      <section className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Venue</h2>
        <p className="font-medium">{match.stadium.name}</p>
        <p className="text-gray-600">{match.stadium.city}, {match.stadium.country}</p>
        <p className="text-gray-600">Capacity: {match.stadium.capacity.toLocaleString()}</p>
      </section>

    </main>
  );
}