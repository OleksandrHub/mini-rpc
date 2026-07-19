import "dotenv/config";
import fs from "node:fs";

const SERVER_URL = process.env.MINI_RPC_SERVER_URL;
const AUTH_TOKEN = process.env.MINI_RPC_AUTH_TOKEN;
const DESTINATION_PATH = process.env.MINI_RPC_OUTPUT_PATH;

async function pullTypes() {
  if (!SERVER_URL || !AUTH_TOKEN || !DESTINATION_PATH) {
    throw new Error(
      "Missing required environment variables: MINI_RPC_SERVER_URL, MINI_RPC_AUTH_TOKEN, MINI_RPC_OUTPUT_PATH",
    );
  }

  const response = await fetch(SERVER_URL, {
    headers: { "X-CLI-Auth-Token": AUTH_TOKEN },
  });

  if (!response.ok) {
    throw new Error(`Failed to pull types: ${response.status}`);
  }

  const typesContent = await response.text();
  fs.writeFileSync(DESTINATION_PATH, typesContent, "utf8");
  console.log(`Types pulled into ${DESTINATION_PATH}`);
}

pullTypes();
