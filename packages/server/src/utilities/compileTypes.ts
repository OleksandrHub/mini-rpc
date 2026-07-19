import "dotenv/config";
import { execSync } from "node:child_process";

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
