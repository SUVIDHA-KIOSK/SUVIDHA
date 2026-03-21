export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public details: unknown;

  constructor(message: string, status: number, code: string, details: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
