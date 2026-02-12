import { convertToUpperCase } from './convert_to_upper_case';

describe('convertToUpperCase', () => {
  it('should capitalize the first letter of a string', () => {
    expect(convertToUpperCase('pikachu')).toBe('Pikachu');
    expect(convertToUpperCase('charizard')).toBe('Charizard');
    expect(convertToUpperCase('bulbasaur')).toBe('Bulbasaur');
  });

  it('should handle already capitalized strings', () => {
    expect(convertToUpperCase('Pikachu')).toBe('Pikachu');
  });

  it('should handle single character strings', () => {
    expect(convertToUpperCase('a')).toBe('A');
  });

  it('should handle empty strings', () => {
    expect(convertToUpperCase('')).toBe('');
  });

  it('should handle strings with numbers', () => {
    expect(convertToUpperCase('pokemon123')).toBe('Pokemon123');
  });
});
