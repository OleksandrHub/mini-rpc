import { createRPCClient } from "../createRPCClient.js";
import type { api } from "./api.types.d.ts";
import * as readline from "node:readline/promises";

type API = typeof api;

const client = createRPCClient<API>("http://localhost:3000");

enum Menu {
  Hello = 1,
  GetUser,
  ListUsers,
  CreateUser,
  RemoveUser,
  GetPost,
  ListPostsByUser,
  CreatePost,
  RemovePost,
  Exit,
}

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const name = await readlineInterface.question(
  "Enter your name (or 'exit' to quit): ",
);

while (true) {
  console.log("Menu:");
  for (const [key, value] of Object.entries(Menu)) {
    if (typeof value === "number") {
      console.log(`${value}. ${key}`);
    }
  }

  const choice = parseInt(
    (await readlineInterface.question("Enter your choice: ")) || "0",
    10,
  );

  try {
    switch (choice) {
      case Menu.Hello: {
        const response = await client.hello(name || "Unknown");
        console.log(response);
        break;
      }
      case Menu.GetUser: {
        const userId = parseInt(
          (await readlineInterface.question("Enter user ID: ")) || "0",
          10,
        );
        const user = await client.users.get(userId);
        console.log(user);
        break;
      }
      case Menu.ListUsers: {
        const users = await client.users.list();
        console.log(users);
        break;
      }
      case Menu.CreateUser: {
        const userName = await readlineInterface.question(
          "Enter new user name: ",
        );
        if (userName) {
          const newUser = await client.users.create(userName);
          console.log(newUser);
        }
        break;
      }
      case Menu.RemoveUser: {
        const userId = parseInt(
          (await readlineInterface.question("Enter user ID to remove: ")) ||
            "0",
          10,
        );
        const removedUser = await client.users.remove(userId);
        console.log(removedUser);
        break;
      }
      case Menu.GetPost: {
        const postId = parseInt(
          (await readlineInterface.question("Enter post ID: ")) || "0",
          10,
        );
        const post = await client.posts.get(postId);
        console.log(post);
        break;
      }
      case Menu.ListPostsByUser: {
        const userId = parseInt(
          (await readlineInterface.question("Enter user ID to list posts: ")) ||
            "0",
          10,
        );
        const posts = await client.posts.listByUser(userId);
        console.log(posts);
        break;
      }
      case Menu.CreatePost: {
        const userId = parseInt(
          (await readlineInterface.question(
            "Enter user ID for the new post: ",
          )) || "0",
          10,
        );
        const title = await readlineInterface.question("Enter post title: ");
        if (title) {
          const newPost = await client.posts.create(userId, title);
          console.log(newPost);
        }
        break;
      }
      case Menu.RemovePost: {
        const postId = parseInt(
          (await readlineInterface.question("Enter post ID to remove: ")) ||
            "0",
          10,
        );
        const removedPost = await client.posts.remove(postId);
        console.log(removedPost);
        break;
      }
      case Menu.Exit: {
        console.log("Exiting...");
        readlineInterface.close();
        process.exit(0);
      }
      default:
        console.log("Invalid choice. Please try again.");
    }
  } catch (error) {
    error instanceof Error
      ? console.error("Error:", error.message)
      : console.error("Unknown error:", error);
  }
}

readlineInterface.close();
