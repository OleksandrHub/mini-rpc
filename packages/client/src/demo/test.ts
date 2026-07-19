import { createRPCClient } from "../createRPCClient.js";
import type { API } from "../router.js";

const client = createRPCClient<API>("http://localhost:3000");

try {
  console.log(await client.hello("world"));
} catch (error) {
  console.error("Error:", error);
}

try {
  console.log(await client.users.get(1));
} catch (error) {
  console.error("Error:", error);
}
