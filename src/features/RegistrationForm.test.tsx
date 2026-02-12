import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render as customRender } from '../../__tests__/utils/test-utils';

import RegistrationForm from './RegistrationForm';

global.fetch = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockResolvedValue(
    new Response(
      JSON.stringify({
        data: [{ item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 }],
      }),
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
      }
    )
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('RegistrationForm', () => {
  const mockCurrentDate = 'Monday, 15.01.2024';

  it('should render form with all fields', () => {
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    expect(screen.getByLabelText(/trainer's name/i)).toBeTruthy();
    expect(screen.getByLabelText(/trainer's age/i)).toBeTruthy();
    expect(screen.getByLabelText(/pokemon name/i)).toBeTruthy();
    expect(screen.getByText(mockCurrentDate)).toBeTruthy();
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required from 2 to 20 symbols/i)).toBeTruthy();
      expect(screen.getByText(/required range from 16-99/i)).toBeTruthy();
      expect(screen.getByText(/choose something/i)).toBeTruthy();
    });
  });

  it('should validate trainer name length', async () => {
    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const nameInput = screen.getByLabelText(/trainer's name/i);
    await user.type(nameInput, 'A');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required from 2 to 20 symbols/i)).toBeTruthy();
    });
  });

  it('should validate trainer age range', async () => {
    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const nameInput = screen.getByLabelText(/trainer's name/i);
    await user.type(nameInput, 'Ash Ketchum');

    const ageInput = screen.getByLabelText(/trainer's age/i);
    await user.type(ageInput, '10');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required range from 16-99/i)).toBeTruthy();
    });
  });

  it('should display pokemon details when pokemon is selected', async () => {
    // Mock fetch to handle both search and detail API calls
    (global.fetch as jest.Mock).mockImplementation((url: string | Request) => {
      let urlString: string;
      if (typeof url === 'string') {
        urlString = url;
      } else if (url instanceof Request) {
        urlString = url.url;
      } else {
        urlString = String(url);
      }

      // Handle pokemon detail API call - RTK Query constructs full URL
      if (urlString.includes('pokeapi.co') && urlString.includes('pokemon')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 25,
              name: 'pikachu',
              types: [{ type: { name: 'electric' } }],
              base_experience: 112,
              sprites: { front_default: 'https://example.com/pikachu.png' },
            }),
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }
      if (urlString.includes('/api/search') || urlString.includes('search')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: [{ item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 }],
            }),
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }
      // Default fallback for search
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: [{ item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 }],
          }),
          {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    });

    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const pokemonInput = screen.getByLabelText(/pokemon name/i);
    await user.type(pokemonInput, 'pikachu');

    const option = await screen.findByText(/pikachu/i, {}, { timeout: 4000 });
    await user.click(option);

    await waitFor(
      () => {
        expect(screen.getByText(/name: pikachu/i)).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('should submit form successfully with valid data', async () => {
    // Mock fetch to handle both search and detail API calls
    (global.fetch as jest.Mock).mockImplementation((url: string | Request) => {
      let urlString: string;
      if (typeof url === 'string') {
        urlString = url;
      } else if (url instanceof Request) {
        urlString = url.url;
      } else {
        urlString = String(url);
      }

      // Handle pokemon detail API call - RTK Query constructs full URL
      if (urlString.includes('pokeapi.co') && urlString.includes('pokemon')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 25,
              name: 'pikachu',
              types: [{ type: { name: 'electric' } }],
              base_experience: 112,
              sprites: { front_default: 'https://example.com/pikachu.png' },
            }),
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }
      if (urlString.includes('/api/search') || urlString.includes('search')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: [{ item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 }],
            }),
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }
      // Default fallback for search
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: [{ item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 }],
          }),
          {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    });

    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const nameInput = screen.getByLabelText(/trainer's name/i);
    await user.type(nameInput, 'Ash Ketchum');

    const ageInput = screen.getByLabelText(/trainer's age/i);
    await user.type(ageInput, '20');

    const pokemonInput = screen.getByLabelText(/pokemon name/i);
    await user.type(pokemonInput, 'pikachu');

    const option = await screen.findByText(/pikachu/i, {}, { timeout: 4000 });
    await user.click(option);

    await waitFor(
      () => {
        expect(screen.getByText(/name: pikachu/i)).toBeTruthy();
      },
      { timeout: 3000 }
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/^success$/i)).toBeTruthy();
    });
  });

  it('should reset form when reset button is clicked', async () => {
    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const nameInput = screen.getByLabelText(/trainer's name/i);
    await user.type(nameInput, 'Ash Ketchum');

    const ageInput = screen.getByLabelText(/trainer's age/i);
    await user.type(ageInput, '20');

    expect(screen.getByDisplayValue('Ash Ketchum')).toBeTruthy();
    expect(screen.getByDisplayValue('20')).toBeTruthy();

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(screen.queryByDisplayValue('Ash Ketchum')).toBeNull();
    expect(screen.queryByDisplayValue('20')).toBeNull();
  });

  it('should display placeholder when no pokemon is selected', () => {
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);
    expect(screen.getByText(/your pokemon/i)).toBeTruthy();
  });
});
