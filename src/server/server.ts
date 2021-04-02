import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';

import { Context } from 'src/server/graphql/context';
import { Resolvers } from 'src/server/graphql/resolvers';

// Initialize everything and start the server
const typeDefs = readFileSync(
  '/Users/wolfetone/Work/node-ts-graphql/src/server/graphql/schema.graphql', 'utf-8');

type ServerArgs = {
  prisma: PrismaClient
}

const resolvers = Resolvers();

export const Server = ({ prisma }: ServerArgs): ApolloServer => {
  const context = Context({ prisma });

  return new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
}
