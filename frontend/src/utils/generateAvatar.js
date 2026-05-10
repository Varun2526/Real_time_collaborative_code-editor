/**
 * Avatar generation utilities for KodaX.
 * Generates user avatars from initials or external services
 * when no profile picture is available.
 */

import { CURSOR_COLORS } from './constants.js';

/**
 * Extracts initials from a username (max 2 characters).
 *
 * @param {string} username - The user's display name
 * @returns {string} Uppercase initials (e.g., "VA" from "varun_a")
 */
export const getInitials = (username) => {
  if (!username) return '?';

  const parts = username.replace(/[_\-.]/g, ' ').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
};

/**
 * Generates a deterministic color for a user based on their identifier.
 * Same user always gets the same color across sessions.
 *
 * @param {string} identifier - userId, username, or email
 * @returns {string} Hex color string
 */
export const getUserColor = (identifier) => {
  if (!identifier) return CURSOR_COLORS[0];
  const hash = identifier
    .toString()
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
};

/**
 * Generates a DiceBear avatar URL for a given username.
 * Uses the "initials" style for a clean, consistent look.
 *
 * @param {string} username - The user's display name
 * @param {number} [size=40] - Avatar size in pixels
 * @returns {string} DiceBear avatar URL
 */
export const getDiceBearUrl = (username, size = 40) => {
  const seed = encodeURIComponent(username || 'anonymous');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&size=${size}&backgroundColor=1a1a2e&textColor=f0f0fa`;
};

/**
 * Returns the best available avatar source for a user.
 * Priority: profilePic (OAuth) → DiceBear fallback.
 *
 * @param {object} user - User object with optional profilePic and username
 * @param {number} [size=40] - Avatar size in pixels
 * @returns {{ type: 'image'|'initials', src: string, initials: string, color: string }}
 */
export const getAvatar = (user, size = 40) => {
  const username = user?.username || 'anonymous';
  const color = getUserColor(user?._id || user?.id || username);
  const initials = getInitials(username);

  if (user?.profilePic) {
    return { type: 'image', src: user.profilePic, initials, color };
  }

  return {
    type: 'initials',
    src: getDiceBearUrl(username, size),
    initials,
    color,
  };
};
