import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { AuthPayload } from '../middleware/auth';
import { UserRole } from '../types';

const signToken = (user: IUser): string => {
  const payload: AuthPayload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) => {
  // Org showcase DB: block random public signups unless explicitly enabled.
  if (!env.allowPublicRegister) {
    throw new AppError(
      'Public registration is disabled. Ask an admin to add students from the Students page.',
      403,
      'REGISTER_DISABLED'
    );
  }

  const exists = await User.findOne({ email: input.email.toLowerCase() });
  if (exists) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  // Only allow student self-registration; admin/teacher created by admin.
  const role: UserRole =
    input.role && input.role !== 'admin' ? input.role : 'student';

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role,
  });

  const token = signToken(user);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken(user);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return user;
};
