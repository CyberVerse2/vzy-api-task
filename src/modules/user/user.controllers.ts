import AppError from '../../common/utils/appError';
import { findUser, updateUser } from './user.services';
import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync';
import { AppResponse } from '../../common/utils/appResponse';
import { UpdateUserDto } from './dto/update.dto';
import { validateEntity } from '../../common/utils/helper';
import { EntityTransformer } from 'src/common/transformers/entityTransformer';
import { IUser } from './user.interface';

const httpGetCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const currentUser = await findUser(user.id!, '_id');
  if (!currentUser) throw new AppError('User not found', 400);
  return AppResponse(res, 200, EntityTransformer(currentUser), 'User found successfully');
});

const httpUpdateUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { firstName, lastName, country, email, password, isTermsAndConditionAccepted } =
    req.body || null;

  if (!(firstName || lastName || country || email || password || isTermsAndConditionAccepted))
    throw new AppError('No field can be empty', 400);

  const details: IUser = {
    firstName,
    lastName,
    country,
    email,
    password,
    isTermsAndConditionAccepted
  };

  await validateEntity(new UpdateUserDto(details));

  await updateUser(user.id!, details);

  return AppResponse(res, 200, null, 'User updated successfully');
});

const httpDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const deletedUser = await updateUser(user.id!, { isDeleted: true });
  return AppResponse(res, 200, deletedUser, 'User Deleted Successfully');
});

export { httpGetCurrentUser, httpUpdateUser, httpDeleteUser };
