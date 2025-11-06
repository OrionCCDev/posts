// src/api/services/authService.ts
import api from '../interceptors';
import { LoginCredentials, AuthResponse, User } from '../../types/user.types';

// ============================================
// WHAT IS A SERVICE?
// ============================================
/*
Purpose: Group related API functions together
Think of it like a toolbox:
- authService = Authentication toolbox (login, logout, etc.)
- userService = User management toolbox (CRUD operations)
- postService = Post management toolbox (CRUD operations)

Benefits:
- Organization: Related functions stay together
- Reusability: Use same function in multiple components
- Maintainability: Change API logic in one place
- Testing: Easy to mock for unit tests
- Separation of Concerns: API logic separate from UI logic
*/

// ============================================
// AUTH SERVICE
// ============================================
// Export const = named export
// Object containing all authentication-related functions
export const authService = {
  
  // ==========================================
  // LOGIN FUNCTION
  // ==========================================
  // Purpose: Authenticate user with Strapi
  // Parameters: credentials object {identifier, password}
  // Returns: Promise<AuthResponse> {jwt, user}
  // Async: Makes API call (asynchronous operation)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // ----------------------------------------
      // CALL STRAPI AUTH ENDPOINT
      // ----------------------------------------
      // api.post() makes HTTP POST request
      // First argument: endpoint URL
      // Second argument: request body (data to send)
      // <AuthResponse> tells TypeScript what response type to expect
      
      // Strapi auth endpoint: POST /api/auth/local
      // Body: { identifier: "email or username", password: "..." }
      // Response: { jwt: "token", user: {...} }
      const response = await api.post<AuthResponse>('/auth/local', {
        identifier: credentials.identifier, 
        password: credentials.password,      
      });

      // ----------------------------------------
      // DESTRUCTURE RESPONSE
      // ----------------------------------------
      // Strapi returns: { data: { jwt, user } }
      // axios automatically puts response in .data property
      // So we access response.data to get { jwt, user }
      const { jwt, user } = response.data;

      // ----------------------------------------
      // SAVE TOKEN TO LOCALSTORAGE
      // ----------------------------------------
      // Purpose: Persist authentication across page refreshes
      // localStorage = browser storage that persists
      // localStorage.setItem(key, value) saves data
      // Key: 'accessToken' (we can call it anything)
      // Value: jwt token string
      
      // Why save token?
      // - User stays logged in after refresh
      // - Token sent with future requests (via interceptor)
      // - No need to login every time
      localStorage.setItem('accessToken', jwt);
      
      // ----------------------------------------
      // SAVE USER DATA TO LOCALSTORAGE
      // ----------------------------------------
      // Purpose: Quick access to user info without API call
      // JSON.stringify() converts object to string
      // localStorage can only store strings
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Login successful:', user);

      // Return response data to calling component
      return response.data;
      
    } catch (error: any) {
      // ----------------------------------------
      // ERROR HANDLING
      // ----------------------------------------
      // Runs if API call fails
      console.error('❌ Login failed:', error);
      
      // Strapi returns errors in specific format
      // error.response.data.error.message contains readable message
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      
      // Re-throw error so calling component can handle it
      throw error;
    }
  },

  // ==========================================
  // REGISTER FUNCTION
  // ==========================================
  // Purpose: Create new user account in Strapi
  // Parameters: username, email, password
  // Returns: Promise<AuthResponse> {jwt, user}
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      // Strapi register endpoint: POST /api/auth/local/register
      // Body: { username, email, password }
      // Response: { jwt, user } (same as login)
      const response = await api.post<AuthResponse>('/auth/local/register', {
        username,
        email,
        password,
      });

      const { jwt, user } = response.data;

      // Save token and user (same as login)
      localStorage.setItem('accessToken', jwt);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      
      throw error;
    }
  },

  // ==========================================
  // GET CURRENT USER (From Strapi)
  // ==========================================
  // Purpose: Fetch fresh user data from Strapi
  // Why: Get latest user info from database
  // Returns: Promise<User | null>
  // Async: Makes API call
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Strapi endpoint: GET /api/users/me
      // Requires authentication (token in header)
      // Returns current user based on JWT token
      // Interceptor automatically adds token to request
      const response = await api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  // ==========================================
  // GET CURRENT USER (From localStorage)
  // ==========================================
  // Purpose: Get user data from browser storage
  // Why: Faster than API call, works offline
  // Returns: User | null
  // Not async: Just reading from memory
  getCurrentUserLocal: (): User | null => {
    // Get user string from localStorage
    const userStr = localStorage.getItem('user');
    
    // If exists, parse JSON string to object
    // If null, return null
    // Ternary operator: condition ? ifTrue : ifFalse
    return userStr ? JSON.parse(userStr) : null;
  },

  // ==========================================
  // LOGOUT FUNCTION
  // ==========================================
  // Purpose: Log out current user
  // Why: Clear authentication, protect privacy
  // Returns: void (nothing)
  // Not async: Just clearing local data
  logout: () => {
    // Remove token from localStorage
    // User won't be authenticated anymore
    localStorage.removeItem('accessToken');
    
    // Remove user data
    // Clean up all stored info
    localStorage.removeItem('user');
  },

  // ==========================================
  // CHECK IF AUTHENTICATED
  // ==========================================
  // Purpose: Check if user is logged in
  // Why: Decide whether to show protected content
  // Returns: boolean (true/false)
  isAuthenticated: (): boolean => {
    // Double negation (!!) converts to boolean
    // localStorage.getItem() returns string or null
    // !!"string" = true
    // !!null = false
    return !!localStorage.getItem('accessToken');
  },
};

// ============================================
// HOW TO USE THIS SERVICE
// ============================================
/*
In a component:

import { authService } from './api/services/authService';

// Login
const handleLogin = async () => {
  try {
    const response = await authService.login({
      identifier: 'john@example.com',
      password: 'Password123!'
    });
    console.log('Logged in:', response.user);
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Check if authenticated
if (authService.isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('Please login');
}

// Get current user
const user = authService.getCurrentUserLocal();
console.log('Current user:', user.username);

// Logout
authService.logout();
navigate('/login');
*/

// ============================================
// WHY THIS PATTERN?
// ============================================
/*
Benefits:
1. Separation of Concerns:
   - API logic here
   - UI logic in components
   - Clear responsibilities

2. Reusability:
   - Use login() in Login component
   - Use isAuthenticated() in ProtectedRoute
   - Use logout() in Navbar
   - Single source of truth

3. Testability:
   - Mock authService in tests
   - Test API calls separately
   - Test components separately

4. Maintainability:
   - Change API endpoint once
   - All components updated
   - Easy to refactor

5. Type Safety:
   - TypeScript knows return types
   - Auto-completion in IDE
   - Catch errors at compile time

Without service (bad):
Component → Direct axios calls → Hard to test, duplicate code

With service (good):
Component → Service → Axios → Easy to test, reusable, clean
*/