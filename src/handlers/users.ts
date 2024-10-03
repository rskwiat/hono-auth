import { Context, HonoRequest } from "hono";
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import UserModel from "../models/usersModel";
import { sign, verify } from "hono/jwt";
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
  const salt = await bcrypt.genSalt(10);

  const lowerCaseEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    email: lowerCaseEmail,
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
  const { id } = await c.req.json();
  const data = await UserModel.findOne({ _id: id });

  if (data) {
    return await UserModel.deleteOne({ _id: id });
  } else {
    return await c.json({ error: `${id} does not exist.` });
  }
}

export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();
  const lowerCaseEmail = email.toLowerCase();

  const user = await UserModel.findOne({ email: lowerCaseEmail });

  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {

      const payload = {
        sub: user,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      }

      const token = await sign(payload, process.env.SECRET!);
      setCookie(c, 'auth', token);
      return c.json({ 'status': 'ok', token }, 200);
    }
  } else {
    return await c.json({ 'error': 'User does not exist.' })
  }
}

export const resetPassword = async (c: Context) => {
  const { email } = await c.req.json();
  const lowerCaseEmail = email.toLowerCase();

  try {
    const user = await UserModel.findOne({ email: lowerCaseEmail });
    if (!user) return c.json({ message: "User doesn't exist" }, 404);
    const resend = new Resend(process.env.RESEND_KEY);

    const secret = process.env.SECRET + user.password;
    const payload = {
      sub: user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
    };
    const token = await sign(payload, secret);
    const APP_URL = process.env.APP_URL!;
    const resetURL = `${APP_URL}/update-password?id=${user._id}&token=${token}`;

    await resend.emails.send({
      from: process.env.TEST_EMAIL_FROM!,
      to: [process.env.TEST_EMAIL_TO!],
      subject: 'Password Reset Request',
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.<p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      ${resetURL}
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    });

    return await c.json({ message: 'Reset Email sent successfully' }, 200);

  } catch {
    return await c.json({ 'Error': 'Something went wrong' }, 500)
  }
};

export const updatePassword = async (c: Context) => {
  const { id, token } = await c.req.query();
  const { password } = await c.req.json();

  try {
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return c.json({ message: "User not exists!" }, 400);
    }

    const secret = process.env.SECRET + user.password;
    const verifyJWT = await verify(token, secret);
    const salt = await bcrypt.genSalt(10);

    const encryptedPassword = await bcrypt.hash(password, salt);
    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    await user.save();

    return await c.json(user);
  } catch {
    return c.json({ message: 'Something went wrong.' }, 500)
  }
};