import { describe, it, expect } from "vitest";
import { resolveMethod } from "../router.js";

describe("resolveMethod", () => {
  const api = {
    hello: (text: string) => `Hi, ${text}`,
    users: {
      getById: (id: number) => ({ id, name: "Test" }),
    },
  };

  it("should resolve a flat method from an object", () => {
    const fn = resolveMethod(api, "hello");
    expect(typeof fn).toBe("function");
  });

  it("should resolve a nested method from an object", () => {
    const fn = resolveMethod(api, "users.getById");
    expect(typeof fn).toBe("function");
  });

  it("should return undefined if the method does not exist", () => {
    const fn = resolveMethod(api, "nope");
    expect(fn).toBeUndefined();
  });

  it("should return undefined if the path fails midway", () => {
    const fn = resolveMethod(api, "users.nope.deep");
    expect(fn).toBeUndefined();
  });
});
