import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { convertToUpperCase } from '@/utils/convert_to_upper_case';
import { isErrorWithMessage } from '@/utils/is_error_with_message';

export interface AutocompleteOption {
  value: string;
  label: string;
  id: number;
}

interface AutocompleteInputProps {
  options: AutocompleteOption[];
  onChange: (value: string) => void;
  onSelect: (option: AutocompleteOption) => void;
  value?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  isLoading?: boolean;
  queryError?: unknown;
}

export default function AutocompleteInput({
  options = [],
  value = '',
  onChange,
  onSelect,
  error = false,
  errorMessage,
  label,
  isLoading = false,
  queryError,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [options]);

  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.value === value);
      setInputValue(option ? option.label : convertToUpperCase(value));
    } else {
      setInputValue('');
    }
  }, [value, options]);

  const handlers = {
    inputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      // Close dropdown if input is cleared
      if (!newValue.trim()) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
      onChange?.(newValue);
    },
    select: (option: AutocompleteOption) => {
      setInputValue(option.label);
      setIsOpen(false);
      onChange?.(option.value);
      onSelect?.(option);
    },
    inputFocus: () => {
      setIsOpen(true);
    },
    keyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            handlers.select(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
  };

  const isDropdownOpen = Boolean(
    isOpen && (options.length > 0 || isLoading || (!isErrorWithMessage(queryError) && queryError))
  );

  return (
    <InputWrapper>
      {label && <Label htmlFor="autocomplete-input">{label}</Label>}
      <InputContainer isFocused={isOpen} hasError={error}>
        <Input
          ref={inputRef}
          id="autocomplete-input"
          type="text"
          value={inputValue}
          onChange={handlers.inputChange}
          onFocus={handlers.inputFocus}
          onKeyDown={handlers.keyDown}
          placeholder="Choose"
          isFocused={isOpen}
          autoComplete="off"
        />
        <DropdownIcon isOpen={isOpen} />
        <Dropdown ref={dropdownRef} isOpen={isDropdownOpen}>
          {isLoading ? (
            <Option disabled>Loading options</Option>
          ) : queryError && isErrorWithMessage(queryError) ? (
            <Option disabled>{queryError.data.error}</Option>
          ) : options.length > 0 ? (
            options.map((option, index) => (
              <Option
                key={option.value}
                isSelected={option.value === value}
                isHighlighted={index === highlightedIndex}
                onClick={() => handlers.select(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </Option>
            ))
          ) : null}
        </Dropdown>
      </InputContainer>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 2px;
`;

const Label = styled.label`
  display: inline-block;
  color: var(--colors-grey-100);
  margin-bottom: 2px;
  padding: 2px 4px;
  border-radius: 2px;
  font-family: 'IBM VGA', monospace;
  font-size: 12px;
  line-height: 20px;
`;

const InputContainer = styled.div<{
  isFocused?: boolean;
  hasError?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  width: 100%;

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const Input = styled.input<{ isFocused?: boolean }>`
  width: 100%;
  padding: 13px 10px;
  border: 1px solid var(--colors-grey-400);
  border-radius: 2px;
  font-family: 'IBM VGA', monospace;
  font-size: 14px;
  line-height: 20px;
  color: var(--colors-grey-100);
  transition: all 0.2s;

  &:focus {
    outline: none;
    box-shadow: var(--shadow-focused);
  }

  &:hover {
    border-color: var(--colors-primary);
  }

  &::placeholder {
    color: var(--colors-grey-200);
  }

  &:disabled {
    background: var(--colors-disabled-bg);
    cursor: not-allowed;
  }
`;

const DropdownIcon = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%) ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
  pointer-events: none;
  color: var(--colors-grey-100);
  font-size: 12px;

  &::after {
    content: '▼';
  }
`;

const Dropdown = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  gap: 10px;
  background: #ffffff;
  border: 1px solid var(--colors-grey-400);
  border-radius: 2px;
  box-shadow: var(--shadow-dialog);
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const Option = styled.div<{
  isSelected?: boolean;
  isHighlighted?: boolean;
  disabled?: boolean;
}>`
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  transition: all 0.15s;
  background: transparent;
  color: ${(props) => (props.disabled ? 'var(--colors-grey-200)' : 'var(--colors-grey-100)')};
  font-family: 'IBM VGA', monospace;
  font-size: 14px;
  line-height: 20px;

  &:hover {
    background: ${(props) => (props.disabled ? 'transparent' : 'var(--colors-primary-light)')};
  }

  ${(props) =>
    props.isHighlighted &&
    !props.disabled &&
    `
    background: var(--colors-primary-light);
  `}

  ${(props) =>
    props.isSelected &&
    !props.disabled &&
    `
    color: var(--colors-primary);
    background: transparent;
  `}
`;

const ErrorMessage = styled.p`
  color: var(--colors-error);
  line-height: 16px;
  font-size: 10px;
  font-family: 'IBM VGA', monospace;
`;
