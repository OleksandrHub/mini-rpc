export type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K] extends object
    ? Promisify<T[K]>
    : T[K];
};
