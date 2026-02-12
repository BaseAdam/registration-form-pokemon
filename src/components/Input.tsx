import React, { forwardRef } from 'react';

import styled from '@emotion/styled';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, errorMessage, value, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <InputWrapper>
        {label && (
          <Label htmlFor={props.id} hasError={error}>
            {label}
          </Label>
        )}
        <InputField ref={ref} hasValue={hasValue} value={value} {...props} />
        {error && errorMessage ? (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        ) : helperText ? (
          <HelperText hasError={error}>{helperText}</HelperText>
        ) : null}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`;

const Label = styled.label<{ hasError?: boolean }>`
  font-family: 'IBM VGA', monospace;
  font-size: 12px;
  line-height: 20px;
  color: var(--colors-grey-100);
`;

const InputField = styled.input<{ hasValue?: boolean }>`
  width: 100%;
  padding: 15.5px 10px;
  border: 1px solid var(--colors-grey-400);
  border-radius: 2px;
  transition: all 0.2s;
  font-family: 'IBM VGA', monospace;
  font-size: 14px;
  background: #ffffff;
  color: var(--colors-grey-100);

  &::placeholder {
    color: var(--colors-grey-200);
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: var(--colors-primary);
  }

  &:focus {
    outline: none;
    border-color: var(--colors-primary);
    box-shadow: var(--shadow-focused);
  }

  ${(props) =>
    props.hasValue &&
    `
    border-color: var(--colors-grey-400);
  `}

  &:disabled {
    background: var(--colors-disabled-bg);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const HelperText = styled.span<{ hasError?: boolean }>`
  font-family: 'IBM VGA', monospace;
  font-size: 10px;
  line-height: 16px;
  color: var(--colors-grey-100);
`;

const ErrorMessage = styled.span`
  font-family: 'IBM VGA', monospace;
  font-size: 10px;
  line-height: 16px;
  color: var(--colors-error);
`;
