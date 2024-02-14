import { Router } from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import stripePackage from 'stripe';
import { Request, Response } from 'express';
import { ENVIRONMENT } from './common/configs/environment';
import AppError from './common/utils/appError';
import { AppResponse } from './common/utils/appResponse';
import UserModel from './modules/user/user.model';
import express from 'express';

const api = Router();

api.use('/auth', authRouter);
api.use('/user', userRouter);

const endpointSecret = ENVIRONMENT.STRIPE.TEST.WEBHOOK;
const stripe = new stripePackage(ENVIRONMENT.STRIPE.TEST.SECRET_KEY);
console.log(endpointSecret);
api.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    } catch (err) {
      throw new AppError(err as string);
    }

    // Handle the event
    if (event.type === 'charge.succeeded') {
      const email = event.data.object.billing_details.email;
      console.log(event);
      if (!email) {
        return AppResponse(res, 200, null, `Email wasn't given since it's in a test environment`);
      }
      const updatedUser = await UserModel.updateOne(
        { email },
        {
          paymentStatus: 'paid'
        }
      );
      console.log(updatedUser);
      if (!updatedUser) throw new AppError(`Error in updating user`);
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return AppResponse(res, 200, null, 'User payment successful');
  }
);

export default api;
