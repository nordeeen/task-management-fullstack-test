import User from '../models/User';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email sudah terdaftar');

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Email tidak terdaftar');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Password Salah');

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
