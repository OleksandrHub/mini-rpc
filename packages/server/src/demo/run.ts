import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRPCServer } from "../createRPCServer.js";
import { api } from "./api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

createRPCServer(api, 3000, {
  apiSourcePath: join(__dirname, "api.ts"),
  typesPath: join(__dirname, "../../dist/demo/api.d.ts"),
});
console.log("Mini-RPC demo server is running on http://localhost:3000");