import { Context, HonoRequest } from "hono";
import bycrpt from 'bcrypt';
import UserModel from "../models/usersModel";
import { sign } from "hono/jwt";
import dotenv from 'dotenv';
import { setCookie } from "hono/cookie";

dotenv.config();

export const getUsers = async (c: Context) => {
  const data = await UserModel.find();
  return c.json(data);
};

export const getUserById = async (c: Context) => {
  const id = c.req.param('id')
  const data = await UserModel.findOne({ _id: id });
  return c.json(data);
};

export const createUser = async (c: Context) => {
  const { email, password } = await c.req.json();
  const salt = await bycrpt.genSalt(10);

  const hashedPassword = await bycrpt.hash(password, salt);

  const newUser = new UserModel({
    email,
    password: hashedPassword,
  });

  const data = await UserModel.findOne({ email: newUser.email });

  if (data) {
    return await c.json(data);
  } else {
    const res = await newUser.save();
    return await c.json(res);
  }
}

export const deleteUser = async (c: Context): Promise<any> => {
  const { email } = await c.req.json();
  const data = await UserModel.findOne({ email });

  if (data) {
    return await UserModel.deleteOne({ email });
  } else {
    return await c.json({ error: `${email} does not exist.` });
  }
}

export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();
  const user = await UserModel.findOne({ email });

  if (user) {
    const match = await bycrpt.compare(password, user.password);
    if (match) {

      const payload = {
        sub: user,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      }

      const token = await sign(payload, process.env.SECRET!);
      setCookie(c, 'auth', token);
      return c.json({ 'status': 'ok', token }, 200);
    }
  } else {
    return await c.json({ 'error': 'User does not exist.' })
  }
}