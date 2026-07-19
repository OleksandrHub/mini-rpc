import type { Promisify } from "./utilities/index.js";
import { buildProxy } from "./utilities/index.js";

export function createRPCClient<TAPI extends object>(url: string) {
  return buildProxy(url) as unknown as Promisify<TAPI>;
}
