export function resolveMethod(api: any, method: string) {
  return method.split(".").reduce((current, part) => current?.[part], api);
}