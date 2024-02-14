import * as dotenv from 'dotenv';
import { IEnvironment } from '../interfaces/Ienvironment';
dotenv.config();

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME!,
    PORT: parseInt(process.env.PORT || '3000'),
    ENV: process.env.APP_ENV!
  },
  DB: {
    URL: process.env.DB!
  },
  JWT: {
    ACCESS_KEY: process.env.ACCESS_JWT_KEY!,
    REFRESH_KEY: process.env.REFRESH_JWT_KEY!
  },
  JWT_EXPIRES_IN: {
    ACCESS: process.env.ACCESS_JWT_EXPIRES_IN!,
    REFRESH: process.env.REFRESH_JWT_EXPIRES_IN!
  },
  EMAIL: {
    API_KEY: process.env.RESEND_API_KEY!
  },
  STRIPE: {
    TEST: {
      SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY!,
      PUBLIC_KEY: process.env.STRIPE_TEST_PUBLIC_KEY!,
      WEBHOOK: process.env.STRIPE_TEST_WEBHOOK_SECRET_KEY!
    },
    LIVE: {
      SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY!,
      PUBLIC_KEY: process.env.STRIPE_LIVE_PUBLIC_KEY!,
      WEBHOOK: process.env.STRIPE_LIVE_WEBHOOK_URL!    }
  }
};
