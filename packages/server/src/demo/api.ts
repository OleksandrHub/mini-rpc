const userDB = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

const postDB = [
  { id: 1, userId: 1, title: "Alice's first post" },
  { id: 2, userId: 1, title: "Alice's second post" },
  { id: 3, userId: 2, title: "Bob's first post" }
];

export const api = {
  hello: (name: string) => `Hello, ${name}!`,

  users: {
    get: (id: number) => {
      const user = userDB.find(u => u.id === id);
      if (!user) throw new Error(`User with id ${id} not found`);
      return user;
    },
    list: () => userDB,
    create: (name: string) => {
      const newUser = { id: userDB.length + 1, name };
      userDB.push(newUser);
      return newUser;
    },
    remove: (id: number) => {
      const index = userDB.findIndex(u => u.id === id);
      if (index === -1) throw new Error(`User with id ${id} not found`);
      const removedUser = userDB.splice(index, 1)[0];
      return removedUser;
    }
  },

  posts: {
    get: (id: number) => {
      const post = postDB.find(p => p.id === id);
      if (!post) throw new Error(`Post with id ${id} not found`);
      return post;
    },
    listByUser: (userId: number) => postDB.filter(p => p.userId === userId),
    create: (userId: number, title: string) => {
      const newPost = { id: postDB.length + 1, userId, title };
      postDB.push(newPost);
      return newPost;
    },
    remove: (id: number) => {
      const index = postDB.findIndex(p => p.id === id);
      if (index === -1) throw new Error(`Post with id ${id} not found`);
      const removedPost = postDB.splice(index, 1)[0];
      return removedPost;
    }
  }
};
