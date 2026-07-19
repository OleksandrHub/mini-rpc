import type { Promisify } from "./router.js";
import { buildProxy } from "./router.js";

export function createRPCClient<TAPI extends object>(url: string) {
  return buildProxy(url) as unknown as Promisify<TAPI>;
}
