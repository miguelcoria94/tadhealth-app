export interface ApiConfig {
  baseUrl: string;
  version: string;
  timeout: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
