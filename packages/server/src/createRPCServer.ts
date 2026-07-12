import { createServer } from "node:http";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";
import { readBody } from "./readBody.js";
import { resolveMethod } from "./resolveMethod.js";

export function createRPCServer(api: Record<string, any>, port: number) {
  const server = createServer(async (req, res) => {
    const data = await readBody(req);
    const request: RPCRequest = JSON.parse(data);

    const fn = resolveMethod(api, request.method);

    if (typeof fn !== "function") {
      const response: RPCResponse = {
        jsonrpc: "2.0",
        error: { code: -32601, message: `Method ${request.method} not found` },
        id: request.id ?? null,
      };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
      return;
    }

    const result = fn(...((request.params as any[]) ?? []));

    const response: RPCResponse = {
      jsonrpc: "2.0",
      result,
      id: request.id ?? null,
    };

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(response));
  });

  server.listen(port);
  return server;
}
