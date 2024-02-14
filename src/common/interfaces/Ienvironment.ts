export interface IEnvironment {
  APP: {
    NAME: string;
    PORT: number;
    ENV: string;
    CLIENT?: string;
  };
  DB: {
    URL: string;
  };
  JWT: {
    ACCESS_KEY: string;
    REFRESH_KEY: string;
  };
  JWT_EXPIRES_IN: {
    ACCESS: string;
    REFRESH: string;
  };
  STRIPE: {
    TEST: {
      SECRET_KEY: string;
      PUBLIC_KEY: string;
      WEBHOOK: string;
    };
    LIVE: {
      SECRET_KEY: string;
      PUBLIC_KEY: string;
      WEBHOOK: string;
    };
  };
}
