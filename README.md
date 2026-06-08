<div align="center">

# ⚽ World Cup 2026 Fan Hub

**A full-stack fan platform for the 2026 FIFA World Cup**

Legal ticket information aggregator, stadium guides, team profiles, 
and travel planning — all in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?logo=postgresql)](https://neon.tech)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-purple?logo=graphql)](https://apollographql.com)

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📋 Overview

World Cup 2026 Fan Hub helps fans legally navigate the ticket purchasing 
process, plan travel to host cities, and explore stadium guides across 
the USA, Canada, and Mexico venues. The platform aggregates information 
from official sources and generates revenue through affiliate partnerships 
and hospitality referrals.

**This is a portfolio project** demonstrating production-grade full-stack 
development practices including GraphQL API design, relational database 
modeling, server-side rendering, and SEO optimization.

---

## ✅ Current Features

- GraphQL API with Apollo Server (matches, teams, stadiums, ticket offers)
- PostgreSQL database with Prisma ORM (relational schema with foreign keys)
- Type-safe database client with custom Prisma generation
- Database seeding with real 2026 tournament fixture data
- Next.js App Router with TypeScript throughout

## 🗺️ Planned Features

- [ ] Stadium guides for all 12 host venues
- [ ] Team profiles for all 32 qualified nations  
- [ ] City travel guides (accommodation, transport, fan zones)
- [ ] Affiliate ticket provider integration
- [ ] Redis query caching layer
- [ ] NextAuth authentication
- [ ] Email notification system for ticket releases
- [ ] Admin dashboard for content management
- [ ] Programmatic SEO (170+ statically generated pages)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework, SSG/SSR, routing |
| TypeScript | Type safety throughout |
| Tailwind CSS | Utility-first styling |
| Apollo Client | GraphQL data fetching |

### Backend
| Technology | Purpose |
|---|---|
| Apollo Server | GraphQL API server |
| GraphQL | API query language |
| Prisma ORM | Type-safe database client |
| NextAuth | Authentication |

### Infrastructure
| Technology | Purpose |
|---|---|
| PostgreSQL (Neon) | Primary database — serverless |
| Redis (Upstash) | Query caching, rate limiting |
| Vercel | Deployment and edge network |
| Cloudflare | CDN and DNS |

---

## 🏗️ Architecture

```
Browser
   ↓
Next.js (Vercel Edge)
   ├── Static pages (SSG) → CDN cached
   └── Dynamic pages (SSR) → Apollo Client
              ↓
       Apollo Server (/api/graphql)
              ↓
       Redis Cache → hit: return cached
              ↓ miss
       Prisma ORM
              ↓
       PostgreSQL (Neon)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/worldcup2026-fan-hub.git
cd worldcup2026-fan-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed the database
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

The GraphQL sandbox is available at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

---

## 🔑 Environment Variables

Create a `.env` file in the project root. See `.env.example` for all required variables.

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Authentication (NextAuth) — add when implementing auth
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Redis (Upstash) — add when implementing caching
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

**Never commit your actual `.env` file.** It is listed in `.gitignore`.

---

## 📁 Project Structure

```
worldcup2026/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seed script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── graphql/
│   │   │       └── route.ts # Apollo Server handler
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── graphql/
│   │   ├── schema.ts        # GraphQL type definitions
│   │   └── resolvers.ts     # GraphQL resolvers
│   └── lib/
│       └── db.ts            # Prisma client singleton
├── .env.example             # Environment variable template
├── .gitignore
├── next.config.ts
├── prisma.config.ts
└── tsconfig.json
```

---

## 🗓️ Development Roadmap

| Day | Focus | Status |
|---|---|---|
| Day 1 | Database schema, Prisma setup, seeding | ✅ Complete |
| Day 2 | GraphQL API, Apollo Server | ✅ Complete |
| Day 3 | Next.js pages, data display | 🔄 In Progress |
| Day 4 | Styling, Tailwind, responsive design | ⏳ Planned |
| Day 5 | Stadium and team guides | ⏳ Planned |
| Day 6 | Redis caching layer | ⏳ Planned |
| Day 7 | Authentication (NextAuth) | ⏳ Planned |
| Day 8 | SEO implementation | ⏳ Planned |
| Day 9 | Search functionality | ⏳ Planned |
| Day 10 | Admin dashboard | ⏳ Planned |
| Day 11 | Production deployment | ⏳ Planned |
| Day 12 | Polish and portfolio prep | ⏳ Planned |

---

## 🎯 Learning Objectives

This project was built to gain practical experience with:

- **GraphQL API design** — schema-first development, resolver patterns, N+1 prevention
- **Prisma ORM** — relational modeling, migrations, type-safe queries
- **Next.js App Router** — SSG, SSR, API routes, metadata API
- **TypeScript** — strict mode, type inference, generics
- **Database design** — foreign keys, indexing strategy, referential integrity
- **Production patterns** — singleton pattern, adapter pattern, environment configuration

---

## 📸 Screenshots

*Coming in Day 3 once UI is built.*

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built as a portfolio project by Johnny · 
  <a href="https://www.linkedin.com/in/johnny-ngare-55228b229/">LinkedIn</a>
</div>   
