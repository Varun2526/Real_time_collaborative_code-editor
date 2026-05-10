/**
 * Clipboard utility for KodaX.
 * Provides a cross-browser compatible way to copy text to the clipboard.
 * Used for copying room IDs, share links, and code snippets.
 */

/**
 * Copies the given text to the user's clipboard.
 * Uses the modern Clipboard API with a fallback for older browsers.
 *
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} true if copy succeeded, false otherwise
 */
export const copyToClipboard = async (text) => {
  try {
    // Modern Clipboard API (works in secure contexts / HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-HTTPS environments
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Copies the room share URL to the clipboard.
 *
 * @param {string} roomId - The room's unique UUID
 * @returns {Promise<boolean>} true if copy succeeded
 */
export const copyRoomLink = async (roomId) => {
  const url = `${window.location.origin}/room/${roomId}`;
  return copyToClipboard(url);
};

/**
 * Copies just the room ID to the clipboard.
 *
 * @param {string} roomId - The room's unique UUID
 * @returns {Promise<boolean>} true if copy succeeded
 */
export const copyRoomId = async (roomId) => {
  return copyToClipboard(roomId);
};
