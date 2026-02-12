import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render as customRender } from '../../__tests__/utils/test-utils';

import AutocompleteInput from './AutocompleteInput';

global.fetch = jest.fn();

describe('AutocompleteInput', () => {
  const mockOnChange = jest.fn();
  const mockOnSelect = jest.fn();
  const defaultProps = {
    options:[
      { value: 'pikachu', label: 'Pikachu', id: 25 },
      { value: 'charizard', label: 'Charizard', id: 6 },
    ],
    onChange: mockOnChange,
    onSelect: mockOnSelect,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with label', () => {
    customRender(<AutocompleteInput {...defaultProps} label="Pokemon name" />);
    expect(screen.getByLabelText(/pokemon name/i)).toBeTruthy();
  });

  it('should display placeholder', () => {
    customRender(<AutocompleteInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/choose/i)).toBeTruthy();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    customRender(<AutocompleteInput {...defaultProps} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'pik');

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  it('should display error message when error prop is true', () => {
    customRender(<AutocompleteInput {...defaultProps} error={true} errorMessage="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeTruthy();
  });

  it('should display options and allow selection', async () => {
    const user = userEvent.setup();

    customRender(
      <AutocompleteInput
        {...defaultProps}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'p');

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    const pikachuOption = screen.getByText('Pikachu');
    await user.click(pikachuOption);

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultProps.options[0]);
      expect(mockOnChange).toHaveBeenCalledWith('pikachu');
    });
  });
});
