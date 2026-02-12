import React, { forwardRef } from 'react';

import styled from '@emotion/styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, ...props }, ref) => {
    return (
      <ButtonStyled ref={ref} variant={variant} {...props}>
        {children}
      </ButtonStyled>
    );
  }
);

Button.displayName = 'Button';

const ButtonStyled = styled.button<{ variant: 'primary' | 'soft' }>`
  padding: 10px 21.5px;
  border-radius: 2px;
  border: none;
  font-family: 'IBM VGA', monospace;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 20px;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: var(--colors-primary);
    color: #ffffff;
    
    &:hover:not(:disabled) {
      background: var(--colors-primary-dark);
    }
    
    &:focus:not(:disabled) {
      outline: none;
      background: var(--colors-primary-dark);
      box-shadow: var(--shadow-focused);
    }
  `
      : `
    background: var(--colors-grey-400);
    color: var(--colors-grey-100);
    
    &:hover:not(:disabled) {
      background: var(--colors-grey-300);
    }
    
    &:focus:not(:disabled) {
      outline: none;
      background: var(--colors-grey-400);
      box-shadow: var(--shadow-focused);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
