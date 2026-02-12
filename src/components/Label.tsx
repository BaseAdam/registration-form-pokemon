import React from 'react';

import styled from '@emotion/styled';

interface LabelProps {
  children: React.ReactNode;
}

export function Label({ children }: LabelProps) {
  return <LabelStyled>{children}</LabelStyled>;
}

const LabelStyled = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 16px;
  background: var(--colors-primary-light);
  font-family: 'IBM VGA', monospace;
  color: #000000;
  white-space: nowrap;
  transition: all 0.2s;
`;
