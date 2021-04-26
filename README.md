This is a template for a simple typescript node program.

# General Actions

All actions should be performed in project root unless otherwise stated.

## Initialize dev environment
In root directory
`nix-shell` 

## Add package dependencies
Use npm to install local dependencies:
`npm install -s lodash`
`npm install -d jest`

## Repl
Use `npm run ts-node` to open a typescript REPL.

You can import local modules by using paths relative to project route:
```
import { greet } from './src/hello';

greet("h"); # "Hello, h"
```


## Run
You can run a script using `ts-node`:

`npm run ts-node run.ts`

## Test
Add tests next to file under test.
Run all tests once: `npm run test` 
Run in watch mode: `npm run test:w`

## Compile to JS
`npm run build`

This will compile everything in the `src` directory.

# Server Actions
## Run dev server
`npm run dev`

# GraphQL Actions
## Generate graphql types
`npm run graphql-codegen`
`npm run graphql-codegen:w` to watch

# Environemt Variables
## .env
- `DEV_DATABASE_URL` -- location of dev database

# DB and Prisma
## Schema
Write your data model definitions in `prisma/schema.prisma`

## Generate Prisma client
`npx prisma generate`

## Make SQL migration file with schema changes
`npx prisma migrate {dev}` (also generates Prisma client changes)
