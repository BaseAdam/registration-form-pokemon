import React from 'react';

import styled from '@emotion/styled';

import { Button } from '@/components/Button';

interface SuccessModalProps {
  isOpen: boolean;
  onReset: () => void;
}

export function SuccessModal({ isOpen, onReset }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <SuccessTitle>Success</SuccessTitle>
        <Button variant="primary" onClick={onReset}>
          Reset form
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  border: 1px solid var(--colors-grey-400);
  background: #ffffff;
  border-radius: 2px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  min-width: 380px;
  max-height: 176px;
  box-shadow: var(--shadow-dialog);
`;

const SuccessTitle = styled.h3`
  font-size: 40px;
  line-height: 100%;
  font-weight: 400;
  color: #000000;
  margin: 0;
  text-align: center;
`;
