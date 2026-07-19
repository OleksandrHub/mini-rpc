export interface API {
  hello: (text: string) => string;
  users: {
    get: (id: number) => { id: number; name: string };
  };
}