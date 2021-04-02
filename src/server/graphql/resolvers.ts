import {  map } from 'lodash';

import { Resolvers as TResolvers, Author, Book } from '~server/gen-types';

// We need to remove the "many" nested fields from the types returned by
// resolvers. The graphql generated type expects at least an empty list,
// and indeed this is what is returned, but only after the nested field
// resolver is called. The root query resolvers shouldn't be responsible
// for anything to do with the nested fields.
export type RootResolverAuthor = Omit<Author, 'books'>
export type RootResolverBook = Omit<Book, 'authors'>

const toIdKeys = (ids: string[]): { id: string }[] => map(ids, id => ({ id }));

export const Resolvers = (): TResolvers => ({
  Query: {
    author: async (_root, { id }, { prisma }) => {
      const a = await prisma.author.findUnique({
        where: { id }
      });

      return a;
    },
    authors: async (_root, _args, { prisma }) => await prisma.author.findMany(),
    books: async (_root, { author }, { prisma }) => {
      if (author) {
        return await prisma.book.findMany({
          where: {
            authors: {
              some: {
                name: {
                  contains: author
                }
              }
            }
          }
        });
      } else {
        return await prisma.book.findMany();
      }
    },
  },
  Author: {
    books: async ({ id }, _, { prisma }) => {
      const r = await prisma.author.findUnique({
        where: { id },
        select: {
          books: true
        }
      });

      return r ? r.books : [];
    }
  },
  Book: {
    authors: async ({ id }, _, { prisma }) => {
      const r = await prisma.book.findUnique({
        where: { id },
        select: {
          authors: true
        }
      });

      return r ? r.authors : [];
    }
  },
  Mutation: {
    createAuthor: async (_root, { input: { name, books } }, { prisma }) => {
      const author = prisma.author.create({
        data: {
          name,
          ...(books ? {
            books: {
              connect: map(books, id => ({ id }))
            }
          } : undefined)
        }
      });

      return author;
    },

    createBook: async(_root, { input: { title, authors } }, { prisma }) => {
      const book = await prisma.book.create({
        data: {
          title,
          ...(authors ? {
            authors: {
              connect: map(authors, id => ({id }))
            }
          }: undefined)
        }
      });

      return book;
    },

    updateAuthor: async (_root,
      { input: { id, name, addBooks, removeBooks } },
      { prisma }) => {

      const author = await prisma.author.update({
        where: { id },
        data: {
          name: !name ? undefined : name,
          books: {
            connect: addBooks ? toIdKeys(addBooks) : undefined,
            disconnect: removeBooks ? toIdKeys(removeBooks) : undefined
          }
        }

      });

      return author;
    },

    deleteAuthor: async (_root,
      { id },
      { prisma }) => {
      await prisma.author.delete({
        where: { id }
      });

      return id;
    }
  }
});
