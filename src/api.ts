import { Router } from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import stripe from 'stripe';
import { updateUser } from './modules/user/user.services';
import { protect } from './common/middlewares/protect';
import { Request, Response } from 'express';
import { ENVIRONMENT } from './common/configs/environment';
import AppError from './common/utils/appError';
import { AppResponse } from './common/utils/appResponse';
const api = Router();

api.use('/auth', authRouter);
api.use('/user', userRouter);

const endpointSecret = ENVIRONMENT.STRIPE.TEST.WEBHOOK;
const stripeApp = new stripe(ENVIRONMENT.STRIPE.TEST.SECRET_KEY);
api.post('/webhook', protect, async (req: Request, res: Response) => {
  const { user } = req;
  const sig = req.headers['stripe-signature'];

  let event: stripe.Event;

  try {
    event = stripeApp.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  // Handle the event
  if (event.type === 'charge.succeeded') {
    const chargeSucceeded = event.data.object;
    console.log(chargeSucceeded);
    const updatedUser = await updateUser(user.id!, {
      paymentStatus: 'paid'
    });

    if (!updatedUser) throw new AppError(`Error in updating user`);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return AppResponse(res, 200, null, 'User payment successful');
});

export default api;
