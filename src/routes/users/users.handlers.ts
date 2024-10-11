import type { Context } from "hono";

import bcrypt from "bcrypt";

import type { AppRouteHandler } from "@/lib/types";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import UserModel from "@/models/user-models";

import type { CreateUserRoute, DeleteUserRoute, GetUserRoute, UserRoute } from "./users.routes";

export const users: AppRouteHandler<UserRoute> = async (c) => {
  const data = await UserModel.find();
  return c.json(data);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const { email, password } = c.req.valid("json");
  const salt = await bcrypt.genSalt(10);

  const lowerCaseEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    email: lowerCaseEmail,
    password: hashedPassword,
  });

  const data = await UserModel.findOne({ email: newUser.email });

  if (data) {
    return await c.json({ message: `${newUser.email} already exists` }, HttpStatusCodes.CONFLICT);
  }
  else {
    const res = await newUser.save();
    return await c.json(res, HttpStatusCodes.OK);
  }
};

export const getUser: AppRouteHandler<GetUserRoute> = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json({
      message: "Id is required",
      error: {
        name: "ValidationError",
        issues: [
          {
            code: "missing_param",
            path: ["id"],
            message: "Id is required",
          },
        ],
      },
      success: false,
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  try {
    const data = await UserModel.findOne({ _id: id });
    if (!data) {
      return c.json({
        message: "User not found",
        error: {
          name: "NotFoundError",
          issues: [
            {
              code: "not_found",
              path: ["id"],
              message: "User not found",
            },
          ],
        },
        success: false,
      }, HttpStatusCodes.NOT_FOUND);
    }
    return c.json(data, HttpStatusCodes.OK);
  }
  catch {
    return c.json({
      message: "Error fetching user",
      error: {
        name: "ServerError",
        issues: [
          {
            code: "server_error",
            path: [],
            message: "Error fetching user",
          },
        ],
      },
      success: false,
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};

export const deleteUser: AppRouteHandler<DeleteUserRoute> = async (c: Context) => {
  const { id } = c.req.valid("json");
  const data = await UserModel.findOne({ _id: id });

  if (data) {
    await UserModel.deleteOne({ _id: id });
    return c.json({ message: "User deleted" }, HttpStatusCodes.OK);
  }
  else {
    return c.json({ message: `${id} does not exist.` }, HttpStatusCodes.NOT_FOUND);
  }
};
