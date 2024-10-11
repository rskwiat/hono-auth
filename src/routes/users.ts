import { Hono } from "hono";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  resetPassword,
  updatePassword,
} from "../handlers/users";

const users = new Hono();

// users.get('/', getUsers) // get all users
// GET User by MongoId
// users.get('/:id', getUserById);
// POST /users/register
users.post("/register", createUser);
// POST /users/remove Delete User
users.post("/remove", deleteUser);
// post /users/reset-password
users.post("/reset-password", resetPassword);
// Post /users/update-password
users.post("/update-password", updatePassword);

users.post("/login", loginUser);

export default users;
