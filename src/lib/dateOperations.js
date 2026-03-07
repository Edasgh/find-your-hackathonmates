/**
 * Returns the current date and time in a formatted string.
 *
 * Format: "DD/MM/YYYY, HH:MM AM/PM"
 * Example: "07/03/2026, 3:45 PM"
 */
export const getDate = () => {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit", // 2-digit day
    month: "2-digit", // 2-digit month
    year: "numeric", // full year
    hour: "numeric", // hour (12-hour format by default)
    minute: "2-digit", // minutes
    hour12: true, // AM/PM format
  });
};

/**
 * Parses a custom date string (in "DD/MM/YYYY HH:MM AM/PM" format)
 * into a JavaScript Date object.
 *
 * @param {string} dateString - e.g., "07/03/2026 3:45 PM"
 * @returns {Date} JavaScript Date object
 *
 * Handles conversion from 12-hour format to 24-hour format internally.
 */
export const parseCustomDate = (dateString) => {
  // Remove commas if present
  const cleaned = dateString.replace(",", "");

  // Split the string into date, time, and AM/PM
  const [datePart, timePart, ampmRaw] = cleaned.split(" ");

  // Normalize AM/PM
  const ampm = ampmRaw.toUpperCase();

  // Split day/month/year
  const [day, month, year] = datePart.split("/");

  // Split hour and minutes
  let [hours, minutes] = timePart.split(":");
  hours = parseInt(hours);

  // Convert 12-hour format to 24-hour format
  if (ampm === "PM" && hours !== 12) hours += 12; // PM except 12 → add 12
  if (ampm === "AM" && hours === 12) hours = 0; // 12 AM → 0 hours

  // Create and return Date object
  return new Date(year, month - 1, day, hours, minutes);
};

/**
 * Returns a human-readable relative time string for a given date.
 *
 * Example outputs:
 * - "2 days ago"
 * - "3 hours ago"
 * - "just now"
 *
 * @param {Date|string} date - The starting date
 * @param {Date|string} [endDate] - Optional end date (default = now)
 * @returns {string} Relative time string
 */
export const timeDiff = (date, endDate) => {
  // Calculate total seconds elapsed from 'date' to now (or endDate)
  const secondsElapsed = (new Date() - new Date(date)) / 1000;

  // Create a formatter for relative time (like "x days ago")
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  // Define intervals in seconds
  const intervals = [
    { unit: "year", seconds: 31536000 }, // 365 days
    { unit: "month", seconds: 2592000 }, // 30 days
    { unit: "week", seconds: 604800 }, // 7 days
    { unit: "day", seconds: 86400 }, // 24 hours
    { unit: "hour", seconds: 3600 }, // 60 minutes
    { unit: "minute", seconds: 60 }, // 60 seconds
    { unit: "second", seconds: 1 }, // 1 second
  ];

  // Find the largest interval that fits into the elapsed time
  for (const interval of intervals) {
    if (secondsElapsed >= interval.seconds) {
      const delta = Math.floor(secondsElapsed / interval.seconds);

      // Intl.RelativeTimeFormat uses negative values for past dates
      return formatter.format(-delta, interval.unit);
    }
  }

  // If less than 1 second has passed
  return "just now";
};
