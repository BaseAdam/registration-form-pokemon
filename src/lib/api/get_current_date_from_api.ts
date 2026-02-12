interface TimeApiResponse {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  milliSeconds: number;
  dateTime: string;
  date: string;
  time: string;
  timeZone: string;
  dayOfWeek: string;
  dstActive: boolean;
}

/**
 * Fetches current date and time from TimeAPI for a specific timezone
 * @param timeZone - Timezone string (e.g., 'Europe/Warsaw')
 * @returns TimeApiResponse object with date/time data
 */
export async function getCurrentDateFromAPI(
  timeZone: string = 'Europe/Warsaw'
): Promise<TimeApiResponse> {
  const response = await fetch(
    `https://www.timeapi.io/api/Time/current/zone?timeZone=${timeZone}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch date from API');
  }

  const data: TimeApiResponse = await response.json();
  return data;
}
