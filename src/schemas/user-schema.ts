import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  password: z.string(),
  thumbnail: z.string().url(),
});

export const ParamSchema = z.object({
  id: z.string(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
