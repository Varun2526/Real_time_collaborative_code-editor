/**
 * Date formatting utilities for KodaX.
 * Provides human-readable date/time formatting for chat messages,
 * room timestamps, and activity feeds.
 */

/**
 * Formats a date into a short time string (e.g., "9:45 PM").
 * Used for chat message timestamps.
 *
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a date into a short date string (e.g., "May 11, 2026").
 * Used for room creation dates and activity feeds.
 *
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date into a relative time string (e.g., "2 hours ago", "just now").
 * Used for activity feeds and last-active indicators.
 *
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 30) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date);
};

/**
 * Formats a date as "Today", "Yesterday", or the short date.
 * Used for chat message date separators.
 *
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Day label
 */
export const formatDayLabel = (date) => {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);

  const isToday = now.toDateString() === then.toDateString();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === then.toDateString()) return 'Yesterday';

  return formatDate(date);
};
