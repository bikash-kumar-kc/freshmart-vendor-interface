export interface IApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  errors?: Record<string, string[]>;
}