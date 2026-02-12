import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RegistrationForm from '@/features/RegistrationForm';

import { render as customRender } from '../utils/test-utils';

global.fetch = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockResolvedValue(
    new Response(
      JSON.stringify({
        data: [
          { item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 },
          { item: { name: 'charizard', id: 6 }, refIndex: 1, score: 0.2 },
        ],
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

describe('Registration Flow Integration Tests', () => {
  const mockCurrentDate = 'Monday, 15.01.2024';

  it('should complete full registration flow: fill form → select pokemon → submit → see success modal', async () => {
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
              data: [
                { item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 },
                { item: { name: 'charizard', id: 6 }, refIndex: 1, score: 0.2 },
              ],
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
            data: [
              { item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 },
              { item: { name: 'charizard', id: 6 }, refIndex: 1, score: 0.2 },
            ],
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
    expect(screen.getByDisplayValue('Ash Ketchum')).toBeTruthy();

    const ageInput = screen.getByLabelText(/trainer's age/i);
    await user.type(ageInput, '20');
    expect(screen.getByDisplayValue('20')).toBeTruthy();

    const pokemonInput = screen.getByLabelText(/pokemon name/i);
    await user.type(pokemonInput, 'pik');

    const option = await screen.findByText(/pikachu/i, {}, { timeout: 4000 });
    await user.click(option);

    await waitFor(
      () => {
        expect(screen.getByText(/name: pikachu/i)).toBeTruthy();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText(/type:/i)).toBeTruthy();
    expect(screen.getByText(/base experience:/i)).toBeTruthy();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/^success$/i)).toBeTruthy();
    });

    expect(screen.getByRole('button', { name: /reset form/i })).toBeTruthy();
  });

  it('should handle form validation errors and allow correction', async () => {
    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required from 2 to 20 symbols/i)).toBeTruthy();
      expect(screen.getByText(/required range from 16-99/i)).toBeTruthy();
      expect(screen.getByText(/choose something/i)).toBeTruthy();
    });

    const nameInput = screen.getByLabelText(/trainer's name/i);
    await user.type(nameInput, 'Ash Ketchum');

    const ageInput = screen.getByLabelText(/trainer's age/i);
    await user.type(ageInput, '20');

    const pokemonInput = screen.getByLabelText(/pokemon name/i);
    await user.type(pokemonInput, 'pikachu');

    await waitFor(async () => {
      const option = screen.getByText(/pikachu/i);
      await user.click(option);
    });

    await waitFor(
      () => {
        expect(screen.getByText(/name: pikachu/i)).toBeTruthy();
      },
      { timeout: 3000 }
    );

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/^success$/i)).toBeTruthy();
    });
  });

  it('should reset form and close modal after successful submission', async () => {
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
              data: [
                { item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 },
                { item: { name: 'charizard', id: 6 }, refIndex: 1, score: 0.2 },
              ],
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
            data: [
              { item: { name: 'pikachu', id: 25 }, refIndex: 0, score: 0.1 },
              { item: { name: 'charizard', id: 6 }, refIndex: 1, score: 0.2 },
            ],
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

    const resetFormButton = screen.getByRole('button', { name: /reset form/i });
    await user.click(resetFormButton);

    expect(screen.queryByDisplayValue('Ash Ketchum')).toBeNull();
    expect(screen.queryByDisplayValue('20')).toBeNull();

    expect(screen.queryByText(/^success$/i)).toBeNull();
  });

  it('should handle pokemon search with fuzzy matching', async () => {
    const user = userEvent.setup();
    customRender(<RegistrationForm currentDate={mockCurrentDate} />);

    const pokemonInput = screen.getByLabelText(/pokemon name/i);

    await user.type(pokemonInput, 'chrizard');

    await waitFor(() => {
      expect(screen.getByText(/charizard/i)).toBeTruthy();
    });

    const option = screen.getByText(/charizard/i);
    await user.click(option);

    expect((pokemonInput as HTMLInputElement).value).toBe('Charizard');
  });
});
