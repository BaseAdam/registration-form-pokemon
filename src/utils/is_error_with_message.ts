import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ErrorResponse {
  error: string;
}

export function isErrorWithMessage(
  error: unknown
): error is FetchBaseQueryError & { data: ErrorResponse } {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  if (!('data' in err)) {
    return false;
  }

  const data = err.data;
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const errorData = data as Record<string, unknown>;
  return 'error' in errorData && typeof errorData.error === 'string';
}
