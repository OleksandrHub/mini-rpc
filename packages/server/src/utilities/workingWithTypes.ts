import "dotenv/config";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";

const AUTH_TOKEN = process.env.MINI_RPC_AUTH_TOKEN;

export function ensureTypesCompiled() {
  console.log("Compiling types...");
  try {
    execSync("npx tsc", { stdio: "inherit" });
    console.log("Types compiled successfully.");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error compiling types.";
    console.warn(message);
  }

  if (!AUTH_TOKEN) {
    console.warn(
      "Warning: MINI_RPC_AUTH_TOKEN is not set. The types API will be unprotected.",
    );
  } else {
    console.log("Types API is protected with authentication.");
  }
}

export function getTypesAPI(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  if (req.method === "GET" && req.url === "/_internal/types") {
    const token = req.headers["x-cli-auth-token"];
    if (token !== AUTH_TOKEN) {
      res.writeHead(401).end("Unauthorized");
      return true;
    }

    try {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const typesPath = join(__dirname, "../../dist/demo/api.d.ts");

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
