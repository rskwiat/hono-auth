import type { InferSchemaType } from "mongoose";

import { model, Schema } from "mongoose";

export interface UserSchemaType {
  email: string;
  password: string;
  thumbnail?: string;
}

const UserSchema = new Schema<UserSchemaType>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: "https://via.placeholder.com/150.jpg",
    required: false,
  },
});

export type UserType = InferSchemaType<typeof UserSchema>;

const UserModel = model("users", UserSchema);

export default UserModel;
