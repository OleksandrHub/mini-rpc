import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createRPCServer } from "./createRPCServer.js";

describe("createRPCServer", () => {
  const api = {
    hello: (text: string) => `Hi, ${text}`,
  };

  const port = 4000;
  let server: ReturnType<typeof createRPCServer>;

  beforeAll(() => {
    server = createRPCServer(api, port);
  });

  afterAll(() => {
    server.close();
  });

  it("should execute a successful method call", async () => {
    const response = await fetch(`http://localhost:${port}`, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "hello",
        params: ["world"],
        id: 1,
      }),
    });
    const data = await response.json();

    expect(data.result).toBe("Hi, world");
  });

  it("should return an error if the method is not found", async () => {
    const response = await fetch(`http://localhost:${port}`, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "nope",
        params: [],
        id: 1,
      }),
    });
    const data = await response.json();

    expect(data.error.code).toBe(-32601);
  });
});
