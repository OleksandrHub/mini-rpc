import { createRPCServer } from "../createRPCServer.js";
import { api } from "./api.js";

createRPCServer(api, 3000);
console.log("Mini-RPC demo server is running on http://localhost:3000");