# mini-rpc

Zero-dependency RPC framework for JS/TS based on JSON-RPC 2.0. A monorepo with three packages:

- `packages/core` — shared JSON-RPC request/response types.
- `packages/server` — `createRPCServer(api, port, options)`, turns a plain object of functions into a JSON-RPC HTTP server.
- `packages/client` — `createRPCClient<TAPI>(url)`, a typed proxy client that calls server methods as if they were local async functions.

## Install

```bash
npm install
```

## Run the demo

The server exposes a demo API (`packages/server/src/demo/api.ts`); the client demo calls it through the typed proxy.

```bash
npm run demo-server   # starts the demo server on http://localhost:3000
npm run demo-client   # in a second terminal, calls the demo API
```

## Type sharing (pull-types)

The server can compile its API file's types and serve them at `/_internal/types`, protected by a token. The client has a script to pull those types down locally so it gets full autocomplete without importing server code directly.

1. Copy the env examples and set a shared token:

   ```bash
   cp packages/server/.env.example packages/server/.env
   cp packages/client/.env.example packages/client/.env
   ```

   Both `.env` files must have the same `MINI_RPC_AUTH_TOKEN`.

2. Start the server (`npm run demo-server`) so `/_internal/types` is reachable.

3. Pull the types into the client:

   ```bash
   cd packages/client
   npm run pull-types
   ```

   This writes the `.d.ts` file to `MINI_RPC_OUTPUT_PATH` (see `packages/client/.env.example`).

## Usage in your own project

Server:

```ts
import { createRPCServer } from "@mini-rpc/server";
import { api } from "./api.js";

createRPCServer(api, 3000, {
  apiSourcePath: "./src/api.ts", // enables /_internal/types, typesPath defaults to api.d.ts next to it
});
```

Client:

```ts
import { createRPCClient } from "@mini-rpc/client";
import type { api } from "../server/src/api.js"; // or the pulled .d.ts

const client = createRPCClient<typeof api>("http://localhost:3000");
await client.hello("world");
```

## Tests

```bash
npm test
```
