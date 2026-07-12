export const api = {
  hello: (text: string) => `Hi, ${text}`,
  users: {
    get: (id: number) => ({ id, name: `User ${id}` }),
  },
};
