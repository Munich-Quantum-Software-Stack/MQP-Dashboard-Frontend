/**
 * Formats a timestamp in consistent GMT/UTC format
 * @param {string} timestamp - The timestamp string from the backend
 * @param {boolean} includeSeconds - Whether to include seconds in the time (default: true)
 * @returns {string} - Formatted date and time in GMT
 */
export const formatTimestampGMT = (timestamp, includeSeconds = true) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  // Format date part as YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  
  // Format time part in GMT/UTC
  const timeFormat = { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC'
  };
  
  if (includeSeconds) {
    timeFormat.second = '2-digit';
  }
  
  const timeStr = date.toLocaleTimeString('en-GB', timeFormat);
  
  // Return formatted date and time with GMT indicator
  return `${dateStr} ${timeStr} GMT`;
};
