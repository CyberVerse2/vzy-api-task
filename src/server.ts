import { ENVIRONMENT } from './common/configs/environment';
import './common/interfaces/authRequest';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import AppError from './common/utils/appError';
import api from './api';
import rateLimit from 'express-rate-limit';
import { handleError } from './common/utils/errorHandler';
import cors from 'cors';
import helmet from 'helmet';
import { stream } from './common/utils/logger';
import morgan from 'morgan';
import { AppResponse } from './common/utils/appResponse';
import { initializeDB } from './common/configs/db';
import { catchAsync } from './common/utils/catchAsync';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import { Stripe } from 'stripe';
import UserModel from './modules/user/user.model';
/**
 * Default app configurations
*/
const app = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;
const endpointSecret = ENVIRONMENT.STRIPE.TEST.WEBHOOK;
const stripe = new Stripe(ENVIRONMENT.STRIPE.TEST.SECRET_KEY);

/**
 * App Security
 */
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    } catch (err: unknown) {
      const error = err as Error;
      AppResponse(res, 400, null, `Webhook Error: ${error.message}`);
    }

    // Handle the event
    if (event.type === 'charge.succeeded') {
      const email = event.data.object.billing_details.email;
      if (!email) {
        return AppResponse(res, 200, null, `Email wasn't given since it's in a test environment`);
      }
      const updatedUser = await UserModel.updateOne(
        { email },
        {
          paymentStatus: 'paid'
        }
      );
      if (!updatedUser) throw new AppError(`Error in updating user`);
      return AppResponse(res, 200, null, 'User payment successful');
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }
);




app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.disable('x-powered-by');
const timeoutMiddleware = timeout(60000);

const limiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

/**
 * Logger Middleware
 */
app.use(morgan(ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream }));

// append request time to all request
app.use((req, res, next) => {
  req['requestTime'] = new Date().toISOString();
  next();
});

/**
 * Initialize routes
 */
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.all(
  '*',
  catchAsync(async (req: Request) => {
    throw new AppError('route not found', 404);
  })
);

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(handleError);

/**
 * status check
 */
app.get('/', (req, res) =>
  res.send({
    Time: new Date(),
    status: 'running'
  })
);

/**
 * Bootstrap server
 */
app.listen(port, () => {
  console.log('=> ' + appName + ' app listening on port ' + port + '!');
  initializeDB();
});
