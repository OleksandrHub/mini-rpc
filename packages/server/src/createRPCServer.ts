import { createServer } from "node:http";
import { dirname, join, basename } from "node:path";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";
import {
  readBody,
  setCorsHeaders,
  resolveMethod,
  ensureTypesCompiled,
  getTypesAPI,
} from "./utilities/index.js";

export interface CreateRPCServerOptions {
  apiSourcePath?: string;
  typesPath?: string;
}

export function createRPCServer<TAPI extends object>(
  api: TAPI,
  port: number,
  options: CreateRPCServerOptions = {},
) {
  const { apiSourcePath } = options;
  const typesPath =
    options.typesPath ??
    (apiSourcePath
      ? join(
          dirname(apiSourcePath),
          basename(apiSourcePath).replace(/\.tsx?$/, ".d.ts"),
        )
      : undefined);

  if (apiSourcePath && typesPath) {
    ensureTypesCompiled(apiSourcePath, typesPath);
  }

  const server = createServer(async (req, res) => {
    if (typesPath && getTypesAPI(req, res, typesPath)) {
      return;
    }

    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    const data = await readBody(req);
    let request: RPCRequest;
    try {
      request = JSON.parse(data);
    } catch {
      const response: RPCResponse = {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
      return;
    }

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
