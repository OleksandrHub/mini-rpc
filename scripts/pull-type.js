import fs from "node:fs";

const SERVER_URL = "http://localhost:3000/_internal/types";
const CLI_AUTH_TOKEN = "my-super-secret-team-token-2026";
const DESTINATION_PATH = "./packages/client/src/demo/api.types.d.ts";

async function pullTypes() {
  const response = await fetch(SERVER_URL, {
    headers: { "X-CLI-Auth-Token": CLI_AUTH_TOKEN },
  });

  if (!response.ok) {
    throw new Error(`Failed to pull types: ${response.status}`);
  }

  const typesContent = await response.text();
  fs.writeFileSync(DESTINATION_PATH, typesContent, "utf8");
  console.log(`Types pulled into ${DESTINATION_PATH}`);
}

pullTypes();
