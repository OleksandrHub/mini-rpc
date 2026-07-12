import type { RPCRequest, RPCResponse } from "@mini-rpc/core";

export function createRPCClient(url: string) {
  return new Proxy(
    {},
    {
      get(target, prop) {
        return async function (...args: any[]) {
          const request: RPCRequest = {
            jsonrpc: "2.0",
            method: String(prop),
            params: args,
            id: Date.now(),
          };

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          });

          const data = (await response.json()) as RPCResponse;

          if (data.error) {
            throw new Error(data.error.message);
          }

          return data.result;
        };
      },
    },
  );
}
