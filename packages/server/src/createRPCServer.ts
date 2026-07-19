import { createServer } from "node:http";
import type { RPCRequest, RPCResponse } from "@mini-rpc/core";
import { readBody, setCorsHeaders, resolveMethod } from "./router.js";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CLI_AUTH_TOKEN = "my-super-secret-team-token-2026";

function ensureTypesCompiled() {
  console.log("Compiling types...");
  try {
    execSync("npx tsc", { stdio: "inherit" });
    console.log("Types compiled successfully.");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error compiling types.";
    console.warn(message);
  }
}

function getTypesAPI(req: any, res: any): boolean {
  if (req.method === "GET" && req.url === "/_internal/types") {
    const token = req.headers["x-cli-auth-token"];
    if (token !== CLI_AUTH_TOKEN) {
      res.writeHead(401).end("Unauthorized");
      return true;
    }

    try {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const typesPath = join(__dirname, "../dist/demo/api.d.ts");

      const typesContent = readFileSync(typesPath, "utf-8");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(typesContent);
    } catch (err) {
      res.writeHead(500).end("Error reading types.json");
    }
    return true;
  }
  return false;
}

export function createRPCServer(api: Record<string, any>, port: number) {
  ensureTypesCompiled();

  const server = createServer(async (req, res) => {
    if (getTypesAPI(req, res)) {
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
