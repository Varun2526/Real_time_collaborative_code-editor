/**
 * Shared Axios instance for KodaX.
 * Pre-configured with the API base URL, credential support,
 * and response/error interceptors for consistent error handling.
 */

import axios from 'axios';
import { API_URL } from '../../utils/constants.js';

/**
 * Pre-configured Axios instance.
 * - baseURL: All requests are relative to the API URL
 * - withCredentials: Sends JWT cookie with every request
 * - Content-Type: JSON by default
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interceptor — unwraps successful responses.
 * Passes through the full response for flexibility.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server says 401 Unauthorized, the JWT cookie has expired
    if (error.response?.status === 401) {
      console.warn('Session expired. Redirecting to login...');
      // Optionally trigger a global logout/redirect here
    }

    return Promise.reject(error);
  }
);

export default api;
