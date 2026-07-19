import { createServer } from "node:http";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";
import {
  readBody,
  setCorsHeaders,
  resolveMethod,
  ensureTypesCompiled,
  getTypesAPI,
} from "./utilities/index.js";

export function createRPCServer<TAPI extends object>(
  api: TAPI,
  port: number,
  addTypesAPI: boolean = true,
) {
  if (addTypesAPI) {
    ensureTypesCompiled();
  }

  const server = createServer(async (req, res) => {
    if (addTypesAPI && getTypesAPI(req, res)) {
      return;
    }

    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    const data = await readBody(req);
    const request: RPCRequest = JSON.parse(data);
    try {
      const fn = resolveMethod(api, request.method);
      let response: RPCResponse = {
        jsonrpc: "2.0",
        id: request.id ?? null,
      };

      if (typeof fn !== "function") {
        response.error = {
          code: -32601,
          message: `Method ${request.method} not found`,
        };

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response));
        return;
      }

      const result = fn(...(request.params ?? []));
      response.result = result;

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    } catch (error: unknown) {
      const code =
        typeof (error as { code?: unknown })?.code === "number"
          ? (error as { code: number }).code
          : -32603;
      const message = error instanceof Error ? error.message : String(error);
      const response: RPCResponse = {
        jsonrpc: "2.0",
        id: request.id ?? null,
        error: { code, message },
      };

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    }
  });

  server.listen(port);
  return server;
}
