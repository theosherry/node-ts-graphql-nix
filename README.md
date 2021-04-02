This is a template for a simple typescript node program.

# Actions

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
