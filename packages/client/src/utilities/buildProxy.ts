import type { RPCRequest, RPCResponse } from "@mini-rpc/core";

export function buildProxy(url: string, path: string[] = []): unknown {
  return new Proxy(function () {}, {
    get(target, prop) {
      const newPath = [...path, String(prop)];
      return buildProxy(url, newPath);
    },
    apply(target, thisArg, args) {
      const method = path.join(".");
      const request: RPCRequest = {
        jsonrpc: "2.0",
        method,
        params: args,
        id: Date.now(),
      };

      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
        .then((response) => response.json())
        .then((data: RPCResponse) => {
          if (data.error) {
            throw new Error(data.error.message);
          }
          return data.result;
        });
    },
  });
}
