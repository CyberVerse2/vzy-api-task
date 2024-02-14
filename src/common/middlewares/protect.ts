import { authenticate } from '../utils/authenticate';
import { catchAsync } from '../utils/catchAsync';
import type { NextFunction, Request, Response } from 'express';
import { setCookie } from '../utils/helper';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies;
  const { currentUser, newAccessToken } = await authenticate(accessToken, refreshToken);

  if (newAccessToken) {
    setCookie(res, 'accessToken', newAccessToken, { maxAge: 15 * 60 * 1000 });
  }

  if (currentUser) {
    req.user = { id: currentUser._id?.toString() };
  }
  
  next();
});
