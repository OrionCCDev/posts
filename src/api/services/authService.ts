/**
 * AUTHENTICATION SERVICE
 *
 * Purpose: Handle all authentication-related operations
 *
 * What is authentication?
 * - The process of verifying who a user is (login/register)
 * - Like showing your ID card to prove your identity
 *
 * This file contains functions for:
 * - Logging in (getting a token)
 * - Registering new users
 * - Getting current user information
 * - Logging out
 */

import axiosInstance from '../axios';

/**
 * TypeScript INTERFACES
 *
 * What are interfaces?
 * - They define the "shape" of data (what properties it has)
 * - Help catch errors during development
 * - Make code self-documenting
 */

// Interface for login request data
// When user logs in, we need their identifier (email/username) and password
interface LoginData {
  identifier: string;  // Email or username
  password: string;    // User's password
}

// Interface for registration request data
// When user registers, we need username, email, and password
interface RegisterData {
  username: string;   // Chosen username
  email: string;      // Email address
  password: string;   // Chosen password
}

// Interface for user data returned from Strapi
// This is what the backend sends us about a user
interface User {
  id: number;          // Unique user ID
  username: string;    // Username
  email: string;       // Email address
  blocked?: boolean;   // Is user blocked? (optional field)
  confirmed?: boolean; // Is email confirmed? (optional field)
}

// Interface for authentication response from Strapi
// After successful login/register, Strapi sends this
interface AuthResponse {
  jwt: string;  // JSON Web Token for authentication
  user: User;   // User information
}

/**
 * AUTHENTICATION SERVICE OBJECT
 *
 * Why use an object with methods?
 * - Groups related functions together
 * - Makes code organized and easy to find
 * - Can be easily imported and used in components
 */
const authService = {
  /**
   * LOGIN FUNCTION
   *
   * Purpose: Authenticate a user and get their token
   *
   * How it works:
   * 1. Send username/email and password to Strapi
   * 2. Strapi verifies the credentials
   * 3. If valid, Strapi sends back a JWT token and user data
   * 4. We store the token and user data in localStorage
   * 5. Return the user data to the calling code
   *
   * @param data - Object containing identifier and password
   * @returns Promise with user data
   */
  login: async (data: LoginData): Promise<User> => {
    try {
      // Make POST request to Strapi's login endpoint
      // We send the user's credentials in the request body
      const response = await axiosInstance.post<AuthResponse>(
        '/api/auth/local',  // Strapi's default login endpoint
        data
      );

      // Extract JWT token and user data from response
      const { jwt, user } = response.data;

      // Store token in localStorage
      // localStorage persists data even after browser is closed
      // The axios interceptor will automatically use this token
      localStorage.setItem('accessToken', jwt);

      // Store user data in localStorage as JSON string
      // JSON.stringify converts JavaScript object to string
      // We need string because localStorage only stores strings
      localStorage.setItem('user', JSON.stringify(user));

      // Return user data to the calling code
      return user;
    } catch (error: any) {
      // If login fails (wrong password, user doesn't exist, etc.)
      // Extract error message from response or use generic message
      const errorMessage =
        error.response?.data?.error?.message || 'Login failed';

      // Throw error so calling code knows login failed
      throw new Error(errorMessage);
    }
  },

  /**
   * REGISTER FUNCTION
   *
   * Purpose: Create a new user account
   *
   * How it works:
   * 1. Send username, email, and password to Strapi
   * 2. Strapi creates a new user in the database
   * 3. Strapi sends back a JWT token and user data
   * 4. We store the token and user data (same as login)
   * 5. Return the user data
   *
   * @param data - Object containing username, email, and password
   * @returns Promise with user data
   */
  register: async (data: RegisterData): Promise<User> => {
    try {
      // Make POST request to Strapi's registration endpoint
      const response = await axiosInstance.post<AuthResponse>(
        '/api/auth/local/register',  // Strapi's default registration endpoint
        data
      );

      // Extract JWT token and user data
      const { jwt, user } = response.data;

      // Store token and user data (same as login)
      localStorage.setItem('accessToken', jwt);
      localStorage.setItem('user', JSON.stringify(user));

      // Return user data
      return user;
    } catch (error: any) {
      // If registration fails (email already exists, weak password, etc.)
      const errorMessage =
        error.response?.data?.error?.message || 'Registration failed';

      throw new Error(errorMessage);
    }
  },

  /**
   * GET CURRENT USER FUNCTION
   *
   * Purpose: Get information about the currently logged-in user
   *
   * Why do we need this?
   * - To verify the token is still valid
   * - To get fresh user data from the server
   * - To check if user is logged in
   *
   * How it works:
   * 1. Make GET request to Strapi's "users/me" endpoint
   * 2. Strapi checks the token (from axios interceptor)
   * 3. If valid, returns user data
   * 4. We update localStorage with fresh data
   *
   * @returns Promise with user data
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      // Make GET request to fetch current user
      // The token is automatically added by axios interceptor
      const response = await axiosInstance.get<User>('/api/users/me');

      // Update stored user data with fresh data from server
      localStorage.setItem('user', JSON.stringify(response.data));

      // Return user data
      return response.data;
    } catch (error: any) {
      // If request fails (token expired, invalid, etc.)
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to get current user';

      throw new Error(errorMessage);
    }
  },

  /**
   * LOGOUT FUNCTION
   *
   * Purpose: Log out the current user
   *
   * How it works:
   * 1. Remove token from localStorage
   * 2. Remove user data from localStorage
   * 3. User is now logged out (no token = no authentication)
   *
   * Note: Strapi doesn't have a logout endpoint because JWTs are stateless
   * We just remove the token from the browser
   */
  logout: (): void => {
    // Remove authentication data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Note: After this, axios interceptor won't find a token
    // so requests will be sent without authentication
  },

  /**
   * GET STORED USER FUNCTION
   *
   * Purpose: Get user data from localStorage (without API call)
   *
   * Why do we need this?
   * - To quickly check if user is logged in
   * - To display user info without making an API request
   * - Faster than calling the API every time
   *
   * @returns User data from localStorage or null if not logged in
   */
  getStoredUser: (): User | null => {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');

    // If no user data exists, return null (user not logged in)
    if (!userStr) {
      return null;
    }

    try {
      // Parse JSON string back to JavaScript object
      // JSON.parse converts string to object
      return JSON.parse(userStr);
    } catch {
      // If parsing fails (corrupted data), return null
      return null;
    }
  },
};

// Export the service so other files can use it
export default authService;
