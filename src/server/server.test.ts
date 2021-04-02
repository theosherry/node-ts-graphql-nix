import { PrismaClient, Author, Book } from '@prisma/client';
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { map, pick } from 'lodash';

import {
  AuthorQuery, AuthorQueryVariables,
  AuthorsQuery,
  BooksQuery, BooksQueryVariables,
  CreateAuthorMutation, CreateAuthorMutationVariables,
  UpdateAuthorMutation, UpdateAuthorMutationVariables,
  DeleteAuthorMutation, DeleteAuthorMutationVariables,
  CreateBookMutation, CreateBookMutationVariables
} from '~/server/gen-types/test-gen-types';
import { clearDB } from '~/server/data/helpers';
import { Server } from '~/server/server';

type WithID = {
  id: any
}
const pickIDs = (xs: WithID[]) => map(xs, x => pick(x, 'id'));


const prisma = new PrismaClient();
const server = Server({ prisma });

const { query, mutate } = createTestClient(server);

const Queries = {
  author: (vars: AuthorQueryVariables) => query<AuthorQuery>({
    query: gql`
query Author($id: ID!) {
  author(id: $id) {
    id
    books { 
      id
    }
  }
}`,
    variables: vars
  }),
  authors: () => query<AuthorsQuery>({
    query: gql`
query Authors {
  authors {
    id
    books {
      id
    }
  }
}`
  }),
  books: (vars?: BooksQueryVariables) => query<BooksQuery>({
    query: gql`
query Books($author: String) {
  books(author: $author) {
    id
    authors {
      id
    }
  }
}`,
    variables: vars
  })
};

const Mutations = {
  createAuthor: (vars: CreateAuthorMutationVariables) => mutate<CreateAuthorMutation>({
    mutation: gql`
mutation CreateAuthor($input: AuthorCreateInput!) {
  createAuthor(input: $input) {
    id
    books {
      id
    }
  }
}
`,
    variables: vars
  }),
  createBook: (vars: CreateBookMutationVariables) => mutate<CreateBookMutation>({
    mutation: gql`
mutation CreateBook($input: BookCreateInput!) {
  createBook(input: $input) {
    id
    authors {
      id
    }
  }
}`,
    variables: vars
  }),
  updateAuthor: (vars: UpdateAuthorMutationVariables) => mutate<UpdateAuthorMutation>({
    mutation: gql`
mutation UpdateAuthor($input: AuthorUpdateInput!) {
  updateAuthor(input: $input) {
    id
    books {
      id
    }
  }
}`,
    variables: vars
  }),
  deleteAuthor: (vars: DeleteAuthorMutationVariables) => mutate<DeleteAuthorMutation>({
    mutation: gql`
mutation DeleteAuthor($id: ID!) {
  deleteAuthor(id: $id)
}`,
    variables: vars
  })
};

type TTestData = {
  books: Book[],
  authors: Author[]
}
const TestData = async (args: { books?: Omit<Book, "id">[], authors?: Omit<Author, "id">[] }): Promise<TTestData> => {
  const authors = await Promise.all(map(args.authors,
    a => prisma.author.create({ data: a })));

  const books = await Promise.all(map(args.books,
    b => prisma.book.create({ data: b })));

  return { authors, books }



}

beforeEach(async () => {
  await clearDB(prisma);
});

afterEach(async () => {
  await prisma.$disconnect();
});

describe('Queries', () => {
  describe('author', () => {
    it('should return an author', async () => {
      const { authors } = await TestData({
        authors: [{ name: 'A 1' }, { name: 'A 2' }]
      });
      const a = authors[1];

      const r = await Queries.author({ id: a.id });

      expect(r.data!.author!.id).toEqual(a.id);
    });
  });

  describe('authors', () => {
    it('should return all the authors', async () => {
      const { authors } = await TestData({
        authors: [{ name: 'A 1' }, { name: 'A 2' }, { name: 'A 3' }]
      });

      const r = await Queries.authors();

      expect(r.data!.authors.length).toBe(3);
      expect(pickIDs(r.data!.authors)).toEqual(expect.arrayContaining(pickIDs(authors)));
    });
  });

  describe('books', () => {

    it('should return all the books', async () => {
      const { books } = await TestData({
        books: [{ title: 'B 1' }, { title: 'B 2' }]
      });

      const r = await Queries.books();


      expect(r.data!.books.length).toBe(2);
      expect(pickIDs(r.data!.books)).toEqual(expect.arrayContaining(pickIDs(books)));
    });

    it('should return the books of a specific author by name', async () => {
      const { authors, books } = await TestData({
        authors: [{ name: 'A 1' }, { name: 'A 2' }],
        books: [{ title: 'B 1' }, { title: 'B 2' }, { title: 'B 3' }]
      });
      const [a1, a2] = authors;
      const a1Books = [books[0], books[2]]

      await prisma.author.update({
        where: {
          id: a1.id
        },
        data: {
          books: {
            connect: pickIDs(a1Books)
          }
        }
      });

      await prisma.author.update({
        where: {
          id: a2.id
        },
        data: {
          books: {
            connect: pickIDs([books[1]])
          }
        }
      });

      const r = await Queries.books({author: a1.name});

      expect(r.data!.books.length).toBe(2);
      expect(pickIDs(r.data!.books)).toEqual(expect.arrayContaining(pickIDs(a1Books)));
    });
  });
});

describe('Types', () => {
  describe('Author', () => {
    it('should have books', async () => {
      const author = await prisma.author.create({
        data: {
          name: 'A 1',
          books: {
            create: [
              {
                title: 'B 1'
              },
              {
                title: 'B 2'
              }
            ]
          }
        },
        include: { books: true }
      });

      const r = await Queries.author({id: author.id});

      expect(r.data!.author!.books).toBeDefined();
      expect(r.data!.author!.books.length).toEqual(2);
      expect(pickIDs(r.data!.author!.books))
        .toEqual(expect.arrayContaining(pickIDs(author.books)));
    });
  });

  describe('Books', () => {
    it('should have authors', async () => {
      const { authors, books } = await TestData({
        authors: [{name: 'A 1'}, {name: 'A 2'}, {name: 'A 3'}],
        books: [{title: 'B 1'}]
      });

      const b = books[0];
      const bAuthors = [authors[0], authors[2]];

      await prisma.book.update({
        where: { id: b.id},
        data: { authors: {connect: pickIDs(bAuthors)}}
      });

      const r = await Queries.books();

      expect(r.data!.books[0].authors).toBeDefined();
      expect(r.data!.books[0].authors.length).toBe(2);
      expect(pickIDs(r.data!.books[0].authors))
        .toEqual(expect.arrayContaining(pickIDs(bAuthors)));
    });
  });
});

describe('Mutations', () => {
  describe('Author', () => {
    describe('createAuthor', () => {
      it('should create an author', async () => {
        const r = await Mutations.createAuthor({ input: { name: "Theo Sherry" } });
        const dbR = await prisma.author.findFirst({
          where: {
            name: "Theo Sherry"
          }
        });

        expect(r.data!.createAuthor!.id).toEqual(dbR!.id);
      });

      it('should connect books to an author', async () => {
        const { books } = await TestData({
          books: [{ title: 'B 1' }, { title: 'B 2' }, { title: 'B 3' }]
        });

        const aBooks = [books[0], books[2]];
        const r = await Mutations.createAuthor(
          {
            input:
            {
              name: 'Theo Sherry',
              books: map(aBooks, a => a.id)
            }
          });

        const dbA = await prisma.author.findUnique({
          where: {
            id: r.data!.createAuthor!.id
          },
          include: {
            books: {
              select: {
                id: true
              }
            }
          }
        });

        expect(dbA!.books.length).toBe(2);
        expect(pickIDs(dbA!.books))
          .toEqual(expect.arrayContaining(pickIDs(aBooks)));
      });
    });

    describe('update author', () => {
      it('should update an author', async () => {
        const { authors } = await TestData({
          authors: [{name: 'Theo One'}]
        });

        const aBefore = authors[0];
        const newName = 'Theo Two';
        const m = await Mutations.updateAuthor({
          input: {
            id: aBefore.id,
            name: newName
          }
        });

        const aAfter = await prisma.author.findUnique({
          where: {
            id: aBefore.id
          }
        });

        expect(aAfter!.name).toEqual(newName);
      });

      it('should connect books to an author', async () => {
        const { books, authors } = await TestData({
          books: [{ title: 'B 1' }, { title: 'B 2' }],
          authors: [{ name: 'Theo' }, { name: 'Brian' }]
        });
        const a = authors[0];

        await Mutations.updateAuthor({
          input: {
            id: a.id,
            addBooks: [books[0].id, books[1].id]
          }
        });

        const dbA = await prisma.author.findUnique({
          where: { id: a.id },
          include: { books: true }
        });

        expect(dbA!.books.length).toBe(2);
        expect(dbA!.books).toEqual(expect.arrayContaining(books));
      });

      it('should disconnect books from an author', async () => {
        const { books, authors } = await TestData({
          books: [{ title: 'B 1' }, { title: 'B 2' }],
          authors: [{ name: 'Theo' }, { name: 'Brian' }]
        });
        const a = authors[0];
        await prisma.author.update({
          where: { id: a.id },
          data: {
            books: {
              connect: map(books, b => pick(b, 'id'))
            }
          }
        });

        await Mutations.updateAuthor({
          input: {
            id: a.id,
            removeBooks: [books[1].id]
          }
        });

        const dbA = await prisma.author.findUnique({
          where: { id: a.id },
          include: { books: true }
        });

        expect(dbA!.books.length).toBe(1);
        expect(dbA!.books[0].id).toBe(books[0]!.id);
      });
    });

    describe('delete author', () => {
      it('should delete an author', async () => {
        const { authors } = await TestData({
          authors: [{ name: 'A 1' }, { name: 'A 2' }]
        });

        const a = authors[1];

        const r = await Mutations.deleteAuthor({ id: a.id });

        const dbA = await prisma.author.findUnique({
          where: { id: a.id }
        });

        expect(dbA).toBe(null);
        expect(r.data!.deleteAuthor).toEqual(a.id);
      });

      it('should delete an author with books', async () => {
        const { authors, books } = await TestData({
          authors: [{ name: 'A 1' }, { name: 'A 2' }],
          books: [{ title: 'B 1' }, { title: 'B 1' }]
        });

        const a = authors[0];

        prisma.author.update({
          where: { id: a.id },
          data: {
            books: {
              connect: map(books, b => ({ id: b.id }))
            }
          }
        });

        const r = await Mutations.deleteAuthor({ id: a.id });

        const dbA = await prisma.author.findUnique({
          where: { id: a.id }
        });

        const dbBooks = await prisma.book.findMany({});

        expect(dbA).toBe(null);
        // It should not delete the books
        expect(dbBooks.length).toBe(2);
      });
    });
  });

  describe('Book', () => {

    describe('createBook', () => {
      it('should create a book', async () => {
        const m = await Mutations.createBook({ input: { title: 'The Bible' } });

        const id = m.data!.createBook!.id;
        expect(id).toBeDefined();
        const dbBook = await prisma.book.findUnique({
          where: { id }
        });

        expect(dbBook).toBeDefined();
        expect(dbBook!.title).toEqual('The Bible');
      });

      it('should connect authors to a book', async () => {
        const { authors } = await TestData({
          authors: [{ name: 'A 1' }, { name: 'A 2' }, { name: 'A 3' }]
        });

        const m = await Mutations.createBook({
          input:
          {
            title: 'B 1',
            authors: [authors[0].id, authors[2].id]
          }
        });

        const dbBook = await prisma.book.findUnique({
          where: { id: m.data!.createBook!.id },
          include: {
            authors: true
          }
        });

        expect(dbBook!.authors.length).toBe(2);
        expect(dbBook!.authors).toEqual(expect.arrayContaining([authors[0], authors[2]]));
      });
    });
  });
});






