export function resolveMethod(api: object, method: string): unknown {
  return method
    .split(".")
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[part]
          : undefined,
      api,
    );
}