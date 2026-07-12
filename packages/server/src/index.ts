import { createServer } from "node:http";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";

const api = {
  hello: (text: string) => `Hi, ${text}`,
};

const server = createServer((req, res) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const request: RPCRequest = JSON.parse(data);

    const fn = api[request.method as keyof typeof api] as (
      ...args: any[]
    ) => any;
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
