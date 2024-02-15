import jwt from 'jsonwebtoken';
import AppError from './../../common/utils/appError';
import { ENVIRONMENT } from '../../common/configs/environment';
import UserModel from '../user/user.model';
import { compareData } from '../../common/utils/helper';
import { validate } from 'class-validator';
import { IUser } from './user.interface';

import { Document } from 'mongoose';

export async function findUser(value: string, field: string): Promise<IUser | null> {
  return await UserModel.findOne({ [field]: value });
}

export async function updateUser(id: string, details?: IUser): Promise<IUser> {
  const updatedUser = await UserModel.findByIdAndUpdate(id, details, { new: true })
  if (!updatedUser) throw new AppError(`Error in updating user. Please try again`, 400);
  return updatedUser;
}
