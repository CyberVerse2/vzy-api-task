import { Router } from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import stripePackage from 'stripe';


const api = Router();

api.use('/auth', authRouter);
api.use('/user', userRouter);
export default api;
