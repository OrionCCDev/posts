/**
 * AUTHENTICATION CONTEXT
 *
 * Purpose: Manage authentication state across the entire application
 *
 * What is React Context?
 * - A way to share data between components without passing props
 * - Like a global state that any component can access
 * - Avoids "prop drilling" (passing props through many levels)
 *
 * Why do we need an Auth Context?
 * - Track if user is logged in throughout the app
 * - Share user information with all components
 * - Provide login/logout functions everywhere
 * - Centralize authentication logic
 *
 * How does it work?
 * 1. Create context with authentication state and functions
 * 2. Wrap entire app with AuthProvider
 * 3. Any component can use useAuth hook to access auth state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../api/services/authService';

/**
 * TypeScript INTERFACES
 */

// Interface for User data
interface User {
  id: number;
  username: string;
  email: string;
  blocked?: boolean;
  confirmed?: boolean;
}

// Interface for Authentication Context value
// This defines what data/functions are available through context
interface AuthContextType {
  user: User | null;              // Current user (null if not logged in)
  loading: boolean;               // Is authentication state being loaded?
  login: (identifier: string, password: string) => Promise<void>;  // Login function
  register: (username: string, email: string, password: string) => Promise<void>;  // Register function
  logout: () => void;             // Logout function
  updateUser: (user: User) => void;  // Update user data in context
}

/**
 * CREATE CONTEXT
 *
 * createContext creates a new React context
 * We initialize it as undefined and will set the real value in the provider
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AUTH PROVIDER COMPONENT
 *
 * Purpose: Wrap the app and provide authentication state to all children
 *
 * How it works:
 * 1. On mount, check if user is already logged in (from localStorage)
 * 2. Provide authentication state and functions to all child components
 * 3. Update state when user logs in/out
 *
 * Props:
 * - children: All child components that will have access to auth context
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * STATE MANAGEMENT
   *
   * What is useState?
   * - React hook to manage component state
   * - When state changes, component re-renders
   */

  // Store current user (null if not logged in)
  const [user, setUser] = useState<User | null>(null);

  // Track if we're loading authentication state
  // True while checking if user is logged in
  // Prevents showing login page briefly before redirecting to home
  const [loading, setLoading] = useState(true);

  /**
   * INITIALIZATION EFFECT
   *
   * What is useEffect?
   * - React hook to run side effects
   * - Runs after component renders
   * - Empty dependency array [] means run once on mount
   *
   * Purpose: Check if user is already logged in when app starts
   *
   * How it works:
   * 1. Component mounts (app starts)
   * 2. Check localStorage for stored user data
   * 3. If found, user is already logged in
   * 4. Set user state and stop loading
   */
  useEffect(() => {
    // Function to initialize authentication state
    const initAuth = () => {
      // Get stored user from localStorage
      // This was saved during login/register
      const storedUser = authService.getStoredUser();

      // If user data exists, user is logged in
      if (storedUser) {
        setUser(storedUser);
      }

      // Stop loading (we've checked auth state)
      setLoading(false);
    };

    // Call initialization function
    initAuth();
  }, []); // Empty array means run once on mount

  /**
   * LOGIN FUNCTION
   *
   * Purpose: Log in a user
   *
   * How it works:
   * 1. Call authService.login with credentials
   * 2. If successful, authService stores token and user
   * 3. Update context state with user data
   * 4. Components will re-render with logged-in state
   *
   * @param identifier - Username or email
   * @param password - User's password
   */
  const login = async (identifier: string, password: string) => {
    try {
      // Call auth service to login
      const userData = await authService.login({ identifier, password });

      // Update state with logged-in user
      // This triggers re-render of components using this context
      setUser(userData);
    } catch (error) {
      // If login fails, re-throw error so component can handle it
      // Component will show error message to user
      throw error;
    }
  };

  /**
   * REGISTER FUNCTION
   *
   * Purpose: Register a new user
   *
   * How it works:
   * 1. Call authService.register with user data
   * 2. If successful, authService stores token and user
   * 3. Update context state with user data
   * 4. User is now logged in automatically after registration
   *
   * @param username - Chosen username
   * @param email - Email address
   * @param password - Chosen password
   */
  const register = async (username: string, email: string, password: string) => {
    try {
      // Call auth service to register
      const userData = await authService.register({ username, email, password });

      // Update state with logged-in user
      // User is automatically logged in after registration
      setUser(userData);
    } catch (error) {
      // If registration fails, re-throw error
      throw error;
    }
  };

  /**
   * LOGOUT FUNCTION
   *
   * Purpose: Log out the current user
   *
   * How it works:
   * 1. Call authService.logout to clear stored data
   * 2. Set user state to null
   * 3. Components will re-render with logged-out state
   */
  const logout = () => {
    // Clear stored authentication data
    authService.logout();

    // Update state to logged-out (no user)
    setUser(null);
  };

  /**
   * UPDATE USER FUNCTION
   *
   * Purpose: Update user data in context
   *
   * When to use:
   * - After user updates their profile
   * - When user data changes on server
   *
   * @param updatedUser - New user data
   */
  const updateUser = (updatedUser: User) => {
    // Update state with new user data
    setUser(updatedUser);

    // Also update localStorage so data persists
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  /**
   * CONTEXT VALUE
   *
   * This object contains all data/functions we want to share
   * Any component using useAuth hook can access these
   */
  const value: AuthContextType = {
    user,          // Current user or null
    loading,       // Is auth state loading?
    login,         // Function to log in
    register,      // Function to register
    logout,        // Function to log out
    updateUser,    // Function to update user data
  };

  /**
   * RENDER PROVIDER
   *
   * AuthContext.Provider makes the value available to all children
   * All components wrapped by this provider can access auth context
   */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * CUSTOM HOOK: useAuth
 *
 * Purpose: Easy way for components to access authentication context
 *
 * What is a custom hook?
 * - A function that uses React hooks
 * - Makes code reusable and cleaner
 * - Starts with "use" prefix
 *
 * How to use in a component:
 * ```
 * const { user, login, logout } = useAuth();
 * ```
 *
 * Why is this better than useContext directly?
 * - Shorter syntax
 * - Type safety (TypeScript knows the type)
 * - Error handling (throws error if used outside provider)
 *
 * @returns Authentication context value
 */
export const useAuth = (): AuthContextType => {
  // Get context value
  const context = useContext(AuthContext);

  // If context is undefined, hook is used outside of AuthProvider
  // This is a developer error - provider must wrap the component
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return context value for use in component
  return context;
};
