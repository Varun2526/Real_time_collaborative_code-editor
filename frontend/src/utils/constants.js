/**
 * Application-wide constants for KodaX.
 * Centralizes URLs, language options, role definitions, and socket event names
 * to prevent hardcoded strings scattered across the codebase.
 */

// ─── API & Socket URLs ────────────────────────────────────────────────────────

/**
 * Dynamically detect the API host based on how the app is accessed.
 * - From localhost → API at localhost:4000
 * - From LAN IP (phone) → API at same LAN IP:4000
 */
const BACKEND_PORT = 4000;
const currentHost = window.location.hostname; // e.g. "localhost" or "192.168.0.116"
const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(currentHost) || /^\d+\.\d+\.\d+\.\d+$/.test(currentHost);
const fallbackProtocol = isLocalHost ? 'http:' : window.location.protocol;
const fallbackOrigin = `${fallbackProtocol}//${currentHost}:${BACKEND_PORT}`;

const normalizeUrl = (url) => url?.replace(/\/$/, '');
const isDev = import.meta.env.DEV;
const sameOriginApi = `${window.location.origin}/api`;

/** Base URL for all REST API calls */
export const API_URL = normalizeUrl(import.meta.env.VITE_API_URL) || (isDev ? '/api' : sameOriginApi);

/** Base URL for Socket.io connection */
export const SOCKET_URL = normalizeUrl(import.meta.env.VITE_SOCKET_URL) || (isDev ? window.location.origin : window.location.origin);

// ─── Supported Languages ──────────────────────────────────────────────────────

/**
 * Languages supported by the collaborative editor.
 * Must match the enum defined in the backend Room model.
 */
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'python',
  'java',
  'c++',
  'c',
  'ruby',
  'go',
  'php',
];

/**
 * Maps file extensions to language identifiers.
 * Used when creating new files to auto-detect the language.
 */
export const EXTENSION_TO_LANGUAGE = {
  js: 'javascript',
  py: 'python',
  java: 'java',
  cpp: 'c++',
  c: 'c',
  rb: 'ruby',
  go: 'go',
  php: 'php',
};

/**
 * Maps language identifiers to their default file extensions.
 * Used when creating fallback filenames.
 */
export const LANGUAGE_TO_EXTENSION = {
  javascript: 'js',
  python: 'py',
  java: 'java',
  'c++': 'cpp',
  c: 'c',
  ruby: 'rb',
  go: 'go',
  php: 'php',
};

// ─── User Roles ───────────────────────────────────────────────────────────────

/** Role hierarchy from highest to lowest privilege */
export const ROLES = {
  OWNER: 'owner',
  MODERATOR: 'moderator',
  MEMBER: 'member',
};

// ─── Room Visibility ──────────────────────────────────────────────────────────

export const VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

// ─── Socket Event Names ───────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Room
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',

  // Code
  CODE_CHANGE: 'code_change',
  CODE_UPDATED: 'code_updated',
  LANGUAGE_CHANGE: 'language_change',
  LANGUAGE_UPDATED: 'language_updated',

  // Files
  ADD_FILE: 'add_file',
  FILE_ADDED: 'file_added',
  DELETE_FILE: 'delete_file',
  FILE_DELETED: 'file_deleted',

  // Cursor & Typing
  CURSOR_MOVE: 'cursor_move',
  CURSOR_UPDATED: 'cursor_updated',
  TYPING: 'typing',
  USER_TYPING: 'user_typing',

  // Chat
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',

  // Code Execution
  RUN_CODE: 'run_code',
  CODE_RUNNING: 'code_running',
  CODE_RESULT: 'code_result',
  CODE_OUTPUT: 'code_output',
  CODE_OUTPUT_RECEIVED: 'code_output_received',

  // Presence
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',

  // Join Requests
  REQUEST_JOIN: 'request_join',
  JOIN_REQUEST_RECEIVED: 'join_request_received',
  APPROVE_REQUEST: 'approve_request',
  REJECT_REQUEST: 'reject_request',

  // Errors
  ERROR: 'error',
};

// ─── Cursor Colors ────────────────────────────────────────────────────────────

/**
 * Color palette for remote cursor indicators.
 * Each user gets a deterministic color based on their userId hash.
 */
export const CURSOR_COLORS = [
  '#f56565', // red
  '#48bb78', // green
  '#4299e1', // blue
  '#ed8936', // orange
  '#9f7aea', // purple
  '#ecc94b', // yellow
  '#38b2ac', // teal
  '#f687b3', // pink
];
