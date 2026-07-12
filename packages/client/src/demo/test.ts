import { createRPCClient } from "../createRPCClient.js";

const client = createRPCClient("http://localhost:3000");

try {
  console.log(await client.hello("world"));
} catch (error) {
  console.error("Error:", error);
}

try {
  await client.add(1, 2);
} catch (error) {
  console.error("Error:", error);
}
