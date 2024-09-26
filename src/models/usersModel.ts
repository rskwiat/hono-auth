import { Schema, model } from 'mongoose';

export interface UserSchema {
  email: string;
  password: string;
  thumbnail?: string;
}

const UserSchema = new Schema<UserSchema>({
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
    default: 'https://via.placeholder.com/150.jpg',
    required: false,
  }
});

const UserModel = model('users', UserSchema);

export default UserModel;