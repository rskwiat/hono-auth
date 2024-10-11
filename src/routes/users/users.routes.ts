import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import jsonContent from "@/middlewares/openapi/json-content";
import { notFoundSchema } from "@/schemas/not-found-schema";
import { ParamSchema, UserSchema } from "@/schemas/user-schema";

const IdParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
    }),
});

const tags = ["Users"];

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

export default function createErrorSchema<
  T extends ZodSchema,
>(schema: T) {
  const { error } = schema.safeParse(
    schema._def.typeName
    === z.ZodFirstPartyTypeKind.ZodArray
      ? []
      : {},
  );
  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(
              z.union([z.string(), z.number()]),
            ),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example: error,
      }),
  });
}

export const users = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(UserSchema),
      "List all users",
    ),
  },
});

export const getUser = createRoute({
  path: "/users/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserSchema,
      "The requested User",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }).openapi({
        example: {
          message: "Not found",
        },
      }),
      "User not Found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID Error",
    ),

  },
});

export const createUser = createRoute({
  path: "/users",
  method: "post",
  request: {
    body: jsonContent(
      z.object({
        email: z.string().email(),
        password: z.string().min(3),
      }),
      "User to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserSchema,
      "User Created",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({
        message: z.string(),
      }).openapi({
        example: {
          message: "User already exists",
        },
      }),
      "User already exists",
    ),
  },
});

export const deleteUser = createRoute({
  path: "/users",
  method: "delete",
  request: {
    body: jsonContent(
      z.object({
        id: z.string(),
      }),
      "User id to delete",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserSchema,
      "User Deleted",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }).openapi({
        example: {
          message: "User not found.",
        },
      }),
      "User Deleted",
    ),
  },
});

export type UserRoute = typeof users;
export type GetUserRoute = typeof getUser;
export type CreateUserRoute = typeof createUser;
export type DeleteUserRoute = typeof deleteUser;
