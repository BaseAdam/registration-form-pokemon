import { formatDate } from './format_date';

describe('formatDate', () => {
  it('should format a Date object correctly', () => {
    const date = new Date('2024-01-15T12:30:00');
    expect(formatDate(date)).toBe('Monday, 15.01.2024');
  });

  it('should format an ISO date string correctly', () => {
    expect(formatDate('2024-01-15T12:30:00')).toBe('Monday, 15.01.2024');
    expect(formatDate('2024-02-09T10:00:00')).toBe('Friday, 09.02.2024');
  });

  it('should handle different dates correctly', () => {
    expect(formatDate('2024-12-25T00:00:00')).toBe('Wednesday, 25.12.2024');
    expect(formatDate('2023-06-01T12:00:00')).toBe('Thursday, 01.06.2023');
  });

  it('should format dates with different weekdays correctly', () => {
    // Sunday
    expect(formatDate('2024-01-14T12:00:00')).toBe('Sunday, 14.01.2024');
    // Monday
    expect(formatDate('2024-01-15T12:00:00')).toBe('Monday, 15.01.2024');
    // Tuesday
    expect(formatDate('2024-01-16T12:00:00')).toBe('Tuesday, 16.01.2024');
  });
});
