type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K];
};

interface API {
  hello: (text: string) => string;
}

type ClientAPI = Promisify<API>;

const test: ClientAPI = {
  hello: async (text) => `Hi, ${text}`,
};
