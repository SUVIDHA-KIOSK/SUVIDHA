import { env } from "../config/env";
import {
  ApiClientError,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "../types/api";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

function normalizePath(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  return `${env.apiBaseUrl}${path}`;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(normalizePath(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

  if (!response.ok || payload.success === false) {
    const error = payload as ApiErrorResponse;
    throw new ApiClientError(
      error.error?.message || "Request failed",
      response.status,
      error.error?.code || "UNKNOWN_ERROR",
      error.error?.details || null,
    );
  }

  return (payload as ApiSuccessResponse<T>).data;
}
