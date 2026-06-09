// src/lib/api/football-data.ts
// Football-Data.org API integration service
// Documentation: https://www.football-data.org/documentation/quickstart

const BASE_URL  = 'https://api.football-data.org/v4';
const API_KEY   = process.env.FOOTBALL_DATA_API_KEY;

// World Cup 2026 competition ID on Football-Data.org
// Update this once the 2026 tournament is live in their system
const WC_2026_ID = 2000;

interface FetchOptions {
  endpoint: string;
  params?:  Record<string, string>;
}

// Base fetch function with authentication, error handling, and retry logic
async function footballDataFetch<T>(
  { endpoint, params }: FetchOptions,
  retries = 3
): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      'FOOTBALL_DATA_API_KEY is not set. Add it to your .env file.'
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        headers: {
          'X-Auth-Token': API_KEY,
        },
        // Cache responses for 60 seconds at the Next.js fetch level
        next: { revalidate: 60 },
      });

      // Rate limited — wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-RequestCounter-Reset');
        const waitMs     = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        console.log(`Rate limited. Waiting ${waitMs / 1000}s before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<T>;

    } catch (error) {
      if (attempt === retries) throw error;
      const waitMs = 1000 * attempt;
      console.log(`Attempt ${attempt} failed. Retrying in ${waitMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  throw new Error(`All ${retries} attempts failed for ${endpoint}`);
}

// Fetch all matches for the 2026 World Cup
export async function fetchWorldCupMatches() {
  return footballDataFetch({
    endpoint: `/competitions/${WC_2026_ID}/matches`,
  });
}

// Fetch all teams in the 2026 World Cup
export async function fetchWorldCupTeams() {
  return footballDataFetch({
    endpoint: `/competitions/${WC_2026_ID}/teams`,
  });
}