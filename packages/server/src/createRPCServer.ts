import { createServer } from "node:http";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";
import { readBody, setCorsHeaders, resolveMethod } from "./router.js";

export function createRPCServer(api: Record<string, any>, port: number) {
  const server = createServer(async (req, res) => {
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
        response.error = { code: -32601, message: `Method ${request.method} not found` };

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response));
        return;
      }

      const result = fn(...((request.params as any[]) ?? []));
      response.result = result;

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    } catch (error: any) {
      const response: RPCResponse = {
        jsonrpc: "2.0",
        id: request.id ?? null,
        error: { code: error.code || -32603, message: error.message },
      };

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    }
  });

  server.listen(port);
  return server;
}
