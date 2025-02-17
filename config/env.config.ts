export const ENV = {
  development: {
    API_URL: "https://tadhealth.com",
    API_VERSION: "v1",
    TIMEOUT: 30000,
  },
  staging: {
    API_URL: "https://staging.tadhealth.com",
    API_VERSION: "v1",
    TIMEOUT: 30000,
  },
  production: {
    API_URL: "https://tadhealth.com",
    API_VERSION: "v1",
    TIMEOUT: 30000,
  },
};

export const getEnvironment = () => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};
