import { catchAsync } from '../../common/utils/catchAsync';
import AppError from '../../common/utils/appError';
import { createNewUser, loginUser } from './auth.services';
import { updateUser } from '../user/user.services';
import { Request, Response } from 'express';
import { AppResponse } from '../../common/utils/appResponse';
import { setCookie, signData, validateEntity } from '../../common/utils/helper';
import { ENVIRONMENT } from '../../common/configs/environment';
import { EntityTransformer } from '../../common/transformers/entityTransformer';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

export const httpCreateNewUser = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, country, email, password, isTermsAndConditionAccepted } = req.body;

  await validateEntity(
    new SignupDto({ firstName, lastName, country, email, password, isTermsAndConditionAccepted })
  );

  const newUser = await createNewUser(
    firstName,
    lastName,
    country,
    email,
    password,
    isTermsAndConditionAccepted
  );

  return AppResponse(res, 200, EntityTransformer(newUser), 'User created successfully');
});

export const httpLoginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  await validateEntity(new LoginDto(req.body));

  const user = await loginUser(email, password);

  const accessToken = signData(
    { id: user.id },
    ENVIRONMENT.JWT.ACCESS_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
  );
  setCookie(res, 'accessToken', accessToken, { maxAge: 15 * 60 * 1000 });
  const refreshToken = signData(
    { id: user.id },
    ENVIRONMENT.JWT.REFRESH_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.REFRESH
  );
  setCookie(res, 'refreshToken', refreshToken, { maxAge: 24 * 60 * 60 * 1000 });
  const updatedUser = await updateUser(user.id!, {
    refreshToken
  });

  return AppResponse(res, 200, null, 'User logged in successfully');
});
