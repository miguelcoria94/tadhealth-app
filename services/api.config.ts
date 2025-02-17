// services/api.config.ts
import axios, { AxiosInstance } from "axios";
import { getEnvironment } from "../config/env.config";
import type { ApiConfig } from "../types/api.types";

const env = getEnvironment();

export const apiConfig: ApiConfig = {
  baseUrl: `${env.API_URL}/api/${env.API_VERSION}`,
  version: env.API_VERSION,
  timeout: env.TIMEOUT,
};

export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor
  client.interceptors.request.use(
    async (config) => {
      // Add auth token if available
      // const token = await AsyncStorage.getItem('authToken');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return client;
};

export const apiClient = createApiClient();
