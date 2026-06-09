import { gql } from 'graphql-tag';

export const typeDefs = gql`

  type Team {
    id:          Int!
    name:        String!
    code:        String!
    slug:        String!
    crestUrl:    String
    homeMatches: [Match!]!
    awayMatches: [Match!]!
  }

  type Stadium {
    id:       Int!
    name:     String!
    city:     String!
    country:  String!
    capacity: Int!
    slug:     String!
    matches:  [Match!]!
  }

  type TicketOffer {
    id:           Int!
    providerName: String!
    category:     String!
    priceUsd:     Float!
    affiliateUrl: String!
    isOfficial:   Boolean!
  }

  type Match {
    id:           Int!
    slug:         String!
    stage:        String!
    status:       String!
    kickoffTime:  String!
    homeScore:    Int
    awayScore:    Int
    homeTeam:     Team!
    awayTeam:     Team!
    stadium:      Stadium!
    ticketOffers: [TicketOffer!]!
  }

  type Query {
    matches:                [Match!]!
    match(slug: String!):   Match
    teams:                  [Team!]!
    team(slug: String!):    Team
    stadiums:               [Stadium!]!
    stadium(slug: String!): Stadium
  }
`;