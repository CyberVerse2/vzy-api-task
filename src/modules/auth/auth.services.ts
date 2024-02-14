import AppError from './../../common/utils/appError';
import UserModel from '../user/user.model';
import { compareData } from '../../common/utils/helper';
import { IUser } from '../user/user.interface';
import { findUser } from '../user/user.services';

export async function createNewUser(
  firstName: string,
  lastName: string,
  country: string,
  email: string,
  password: string,
  isTermsAndConditionAccepted: boolean
) {
  const user = await findUser(email, 'email');
  console.log(user)
  if (user) {
    throw new AppError('User already exists', 409);
  }
  const newUser = await UserModel.create({
    firstName,
    lastName,
    country,
    email,
    password,
    isTermsAndConditionAccepted
  });
  if (!newUser) throw new AppError('Error in creating user. Please try again', 400);

  return newUser;
}

export async function loginUser(email: string, password: string) {
  const authenticatedUser = await findUser(email, 'email');
  if (!authenticatedUser) {
    throw new AppError('User not found', 404);
  }
  const isValidUser = await compareData(password, authenticatedUser.password!);
  if (!isValidUser) {
    throw new AppError('The password is incorrect', 401);
  }

  return authenticatedUser;
}
