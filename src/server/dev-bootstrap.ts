import { PrismaClient } from '@prisma/client';
import { map } from 'lodash';

import { Server } from 'src/server/server';
import { clearDB } from 'src/server/data/helpers';

const prisma = new PrismaClient();

const server = Server({ prisma });

server.listen()
  .then(async ({ url }) => {
    await clearDB(prisma);

    // Make dev data.
    const authors = await Promise.all(map(['Theo Sherry', 'Peter Watts'],
      name => prisma.author.create({
        data: { name }
      })));

    await prisma.book.create({
      data: {
        title: 'Blind Spot',
        authors: {
          connect: [{ id: authors[1].id }]
        }
      }
    });

    await prisma.book.create({
      data: {
        title: 'The Bible'
      }
    });

    await prisma.book.create({
      data: {
        title: 'Blind Butts',
        authors: {
          connect: map(authors, ({ id }) => ({ id }))
        }
      }
    });

    console.log(`Server is runnong on ${url} with test data.`);
  })
  

    
