// Date formatting for event pages. All UTC - dates are calendar days, no TZ math.
const day = (d: Date) => d.getUTCDate();
const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts });

// "14 - 15 November 2026"
export function dateRange(start: Date, end: Date): string {
  const monthYear = fmt({ month: 'long', year: 'numeric' }).format(end);
  return `${day(start)} - ${day(end)} ${monthYear}`;
}

// "30 September 2026" - single calendar day (e.g. CFP deadline)
export function longDate(d: Date): string {
  return fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

// "10:00" - session time (schedule entries carry a +05:30 offset)
export function timeIST(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
  }).format(d);
}

// "Fri 14 Nov" - schedule day grouping key/label
export function dayLabel(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata',
  }).format(d);
}
