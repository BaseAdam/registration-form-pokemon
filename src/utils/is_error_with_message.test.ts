import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { isErrorWithMessage } from './is_error_with_message';

describe('isErrorWithMessage', () => {
  it('should return true for valid FetchBaseQueryError with error message', () => {
    const error: FetchBaseQueryError & { data: { error: string } } = {
      status: 404,
      data: { error: 'No pokemons found' },
    };

    expect(isErrorWithMessage(error)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isErrorWithMessage(null)).toBe(false);
  });

  it('should return false for non-object types', () => {
    expect(isErrorWithMessage('string')).toBe(false);
    expect(isErrorWithMessage(123)).toBe(false);
    expect(isErrorWithMessage(undefined)).toBe(false);
  });

  it('should return false for object without data property', () => {
    const error = { status: 404 };
    expect(isErrorWithMessage(error)).toBe(false);
  });

  it('should return false for object with null data', () => {
    const error = { data: null };
    expect(isErrorWithMessage(error)).toBe(false);
  });

  it('should return false for object with data that is not an object', () => {
    const error = { data: 'string' };
    expect(isErrorWithMessage(error)).toBe(false);
  });

  it('should return false for object with data without error property', () => {
    const error = { data: { message: 'Some message' } };
    expect(isErrorWithMessage(error)).toBe(false);
  });

  it('should return false for object with data.error that is not a string', () => {
    const error = { data: { error: 123 } };
    expect(isErrorWithMessage(error)).toBe(false);
  });

  it('should return true for object with valid error structure', () => {
    const error = {
      status: 500,
      data: { error: 'Internal server error' },
    };
    expect(isErrorWithMessage(error)).toBe(true);
  });
});
