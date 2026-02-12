import { format, parseISO } from 'date-fns';

/**
 * Formats a date to "Monday, 09.02.2026" format
 * @param date - Date object or ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  let dateObj: Date;

  if (typeof date === 'string') {
    try {
      dateObj = parseISO(date);
    } catch (error) {
      console.error('Error parsing date string:', error);
      dateObj = new Date();
    }
  } else {
    dateObj = date;
  }

  return format(dateObj, 'EEEE, dd.MM.yyyy');
}
