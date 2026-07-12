import { createServer } from "node:http";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";

const api = {
  hello: (text: string) => `Hi, ${text}`,

  users: {
    get: (id: number) => ({ id, name: `User ${id}` }),
  },
};

function resolveMethod(api: any, method: string) {
  const parts = method.split(".");

  let current: any = api;

  for (const part of parts) {
    current = current?.[part];
  }

  return current;
}

const server = createServer((req, res) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const request: RPCRequest = JSON.parse(data);

    const fn = resolveMethod(api, request.method);

    if (typeof fn !== "function") {
      const response: RPCResponse = {
        jsonrpc: "2.0",
        error: {
          code: -32601,
          message: `Method ${request.method} not found`,
        },
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
});

server.listen(3000);
