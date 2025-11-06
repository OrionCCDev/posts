/**
 * AXIOS CONFIGURATION FILE
 *
 * Purpose: This file sets up Axios (HTTP client) to communicate with the Strapi backend
 *
 * What is Axios?
 * - Axios is a popular library for making HTTP requests (GET, POST, PUT, DELETE)
 * - It's like fetch() but with more features and better error handling
 *
 * Why do we need this configuration?
 * - To set a base URL so we don't repeat it in every request
 * - To automatically attach authentication tokens to requests
 * - To handle errors in a centralized way
 */

import axios from 'axios';

/**
 * BASE URL Configuration
 *
 * This is the address of your Strapi backend server
 * All API requests will be sent to this URL + endpoint path
 *
 * Example: if we call '/api/users', the full URL will be:
 * http://localhost:1337/api/users
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

/**
 * Create Axios Instance
 *
 * Why create an instance?
 * - We can configure it once and reuse it everywhere
 * - All requests from this instance will use the same base URL and settings
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,  // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',  // Tell server we're sending JSON data
  },
});

/**
 * REQUEST INTERCEPTOR
 *
 * What is an interceptor?
 * - Code that runs BEFORE every request is sent
 * - Like a checkpoint that modifies requests before they leave
 *
 * Why do we need it?
 * - To automatically attach the authentication token (JWT) to every request
 * - Without this, we'd have to manually add the token to each request
 *
 * How does it work?
 * 1. Before sending a request, this function runs
 * 2. It checks if a token exists in localStorage
 * 3. If yes, it adds the token to the Authorization header
 * 4. Then the request continues with the token attached
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the authentication token from browser's localStorage
    // localStorage is like a small database in the browser
    const token = localStorage.getItem('accessToken');

    // If token exists, add it to the request headers
    // The format "Bearer <token>" is the standard way to send JWT tokens
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified config so the request can proceed
    return config;
  },
  (error) => {
    // If something goes wrong while preparing the request, reject it
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 *
 * What does this do?
 * - Code that runs AFTER receiving a response from the server
 * - Like a checkpoint that checks responses before we use them
 *
 * Why do we need it?
 * - To handle authentication errors (like expired tokens) in one place
 * - To automatically log out users when their session expires
 * - To provide better error messages
 *
 * How does it work?
 * 1. When a response arrives, this function runs
 * 2. If successful (2xx status), just return the response
 * 3. If error (like 401 Unauthorized), handle it specially
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Response is successful (status code 2xx)
    // Just return it as-is
    return response;
  },
  (error) => {
    // Handle error responses here

    // Check if error is 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear the stored authentication data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Redirect user to login page
      // They need to log in again
      window.location.href = '/login';
    }

    // For all errors, reject the promise so the calling code can handle it
    return Promise.reject(error);
  }
);

/**
 * Export the configured Axios instance
 * Other files will import this to make API requests
 */
export default axiosInstance;
