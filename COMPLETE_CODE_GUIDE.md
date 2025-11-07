# Complete Code Guide - Learn Every File
## React + TypeScript + Strapi Application - Detailed Learning Guide

This document contains **EVERY FILE** I created with **LINE-BY-LINE** explanations for learning purposes.

---

# Table of Contents

1. [Project Setup Files](#project-setup-files)
2. [Environment Configuration](#environment-configuration)
3. [API Layer - Axios Configuration](#api-layer)
4. [Type Definitions](#type-definitions)
5. [Authentication System](#authentication-system)
6. [Services Layer](#services-layer)
7. [React Components](#react-components)
8. [Pages](#pages)
9. [Main Application Files](#main-application-files)

---

# 1. PROJECT SETUP FILES

## 📁 File: `package.json`

**Purpose:** Defines project dependencies and scripts

```json
{
  // Project metadata
  "name": "posts",                    // Project name
  "private": true,                    // Not published to npm
  "version": "0.0.0",                // Version number
  "type": "module",                  // Use ES6 modules

  // Scripts - commands we can run
  "scripts": {
    "dev": "vite",                   // Start development server
    "build": "tsc && vite build",    // Build for production
    "preview": "vite preview"        // Preview production build
  },

  // Dependencies - packages needed in production
  "dependencies": {
    "react": "^18.2.0",              // React library
    "react-dom": "^18.2.0",          // React DOM rendering
    "react-router-dom": "^6.20.0",   // Routing/navigation
    "axios": "^1.6.2"                // HTTP client for API calls
  },

  // Dev dependencies - only needed during development
  "devDependencies": {
    "@types/react": "^18.2.43",      // TypeScript types for React
    "@types/react-dom": "^18.2.17",  // TypeScript types for React DOM
    "@vitejs/plugin-react": "^4.2.1", // Vite plugin for React
    "typescript": "^5.2.2",          // TypeScript compiler
    "vite": "^5.0.8",                // Build tool
    "tailwindcss": "^3.3.6",         // CSS framework
    "postcss": "^8.4.32",            // CSS processor
    "autoprefixer": "^10.4.16"       // Add CSS vendor prefixes
  }
}
```

---

## 📁 File: `tailwind.config.js`

**Purpose:** Configure Tailwind CSS framework

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: [
    "./index.html",              // Scan HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS/TS/JSX/TSX files in src
  ],

  // Customize Tailwind's default theme
  theme: {
    extend: {
      // Add custom colors, fonts, etc. here
      // Currently using default Tailwind theme
    },
  },

  // Add Tailwind plugins here
  plugins: [],
}
```

**What this does:**
- Configures Tailwind to scan our source files
- Finds all Tailwind classes we use (like `bg-blue-500`, `text-center`)
- Generates only the CSS we actually need
- Results in smaller CSS file size

---

## 📁 File: `postcss.config.js`

**Purpose:** Configure PostCSS (CSS processor)

```javascript
export default {
  // PostCSS plugins to use
  plugins: {
    tailwindcss: {},      // Process Tailwind CSS
    autoprefixer: {},     // Add vendor prefixes (-webkit-, -moz-, etc.)
  },
}
```

**What this does:**
- Runs Tailwind CSS to generate styles
- Adds browser-specific prefixes automatically
- Example: `display: flex` becomes:
  ```css
  display: -webkit-flex;
  display: flex;
  ```

---

## 📁 File: `tsconfig.json`

**Purpose:** Configure TypeScript compiler

```json
{
  "compilerOptions": {
    "target": "ES2020",              // Compile to ES2020 JavaScript
    "useDefineForClassFields": true, // Use modern class fields
    "lib": ["ES2020", "DOM"],        // Include ES2020 and browser APIs
    "module": "ESNext",              // Use latest module system
    "skipLibCheck": true,            // Skip type checking of declaration files

    /* Bundler mode */
    "moduleResolution": "bundler",   // Use bundler-style module resolution
    "allowImportingTsExtensions": true, // Allow importing .ts files
    "resolveJsonModule": true,       // Allow importing JSON files
    "isolatedModules": true,         // Each file can be compiled separately
    "noEmit": true,                  // Don't emit compiled files (Vite handles this)
    "jsx": "react-jsx",              // Use React 18 JSX transform

    /* Linting - Strict type checking */
    "strict": true,                  // Enable all strict type checking
    "noUnusedLocals": true,         // Error on unused variables
    "noUnusedParameters": true,     // Error on unused function parameters
    "noFallthroughCasesInSwitch": true // Error on fallthrough switch cases
  },

  // Files to include in compilation
  "include": ["src"],

  // References to other TypeScript projects
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📁 File: `vite.config.ts`

**Purpose:** Configure Vite build tool

```typescript
// Import necessary functions from Vite
import { defineConfig } from 'vite'
// Import React plugin for Vite
import react from '@vitejs/plugin-react'

// Export Vite configuration
export default defineConfig({
  // Plugins to use
  plugins: [react()], // Enable React support with JSX, Fast Refresh, etc.

  // Server configuration (development)
  server: {
    port: 3000,        // Run dev server on port 3000
    open: true,        // Auto-open browser on start
  },
})
```

---

# 2. ENVIRONMENT CONFIGURATION

## 📁 File: `.env`

**Purpose:** Store environment variables (configuration that changes per environment)

```env
# Backend API URL
# VITE_ prefix makes it available in the app
# In development: http://localhost:1337
# In production: https://your-production-api.com
VITE_API_URL=http://localhost:1337
```

**Why we use .env:**
- Different URLs for development vs production
- Keep sensitive data out of code
- Easy to change without modifying code
- Variables starting with `VITE_` are exposed to the app

**How to use in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📁 File: `.gitignore`

**Purpose:** Tell Git which files NOT to track

```
# Dependencies
node_modules/          # Don't commit installed packages (too big)

# Environment variables
.env                   # Don't commit secrets/API keys
.env.local
.env.production

# Build output
dist/                  # Don't commit built files
build/

# IDE files
.vscode/              # Editor-specific settings
.idea/

# OS files
.DS_Store             # Mac OS files
Thumbs.db             # Windows files

# Logs
*.log
npm-debug.log*
```

---

# 3. API LAYER - AXIOS CONFIGURATION

## 📁 File: `src/api/axios.ts`

**Purpose:** Configure Axios HTTP client for API calls

```typescript
// Import axios library
import axios from 'axios';

// Get API URL from environment variables
// If VITE_API_URL is not set, use localhost:1337 as default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

/**
 * Create a custom axios instance
 *
 * Why? So we don't have to repeat the same configuration
 * for every API call. All requests will automatically:
 * - Use the correct base URL
 * - Have proper headers
 * - Include authentication token (via interceptors)
 */
const axiosInstance = axios.create({
  // Base URL - all requests will be relative to this
  // Example: .get('/api/posts') becomes http://localhost:1337/api/posts
  baseURL: API_URL,

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json', // Send JSON data
  },

  // Timeout after 10 seconds (optional)
  // timeout: 10000,
});

// Export the configured instance
export default axiosInstance;
```

**How this works:**

```typescript
// Without axiosInstance (repetitive):
axios.get('http://localhost:1337/api/posts', {
  headers: { 'Content-Type': 'application/json' }
})

// With axiosInstance (cleaner):
axiosInstance.get('/api/posts')
```

---

## 📁 File: `src/api/interceptors.ts`

**Purpose:** Intercept HTTP requests/responses to add authentication and handle errors

```typescript
// Import our configured axios instance
import axiosInstance from './axios';

/**
 * REQUEST INTERCEPTOR
 *
 * Purpose: Automatically add authentication token to every request
 *
 * Flow:
 * 1. User makes API call: axiosInstance.get('/api/posts')
 * 2. BEFORE request is sent, this interceptor runs
 * 3. It adds the Authorization header with JWT token
 * 4. Request is sent to server with token included
 */
axiosInstance.interceptors.request.use(
  // Success handler - runs before every request
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to request headers
    if (token) {
      // Add Authorization header with Bearer token
      // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return modified config so request can proceed
    return config;
  },

  // Error handler - if something goes wrong before sending request
  (error) => {
    // Pass error down the chain
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 *
 * Purpose: Handle responses and errors globally
 *
 * Flow:
 * 1. Server sends response
 * 2. BEFORE response reaches our code, this interceptor runs
 * 3. Check for errors (especially 401 Unauthorized)
 * 4. If 401, user's token expired or is invalid - log them out
 * 5. Pass response or error to our code
 */
axiosInstance.interceptors.response.use(
  // Success handler - runs on successful responses (status 200-299)
  (response) => {
    // Response is good, just pass it through
    return response;
  },

  // Error handler - runs on error responses (status 400+)
  (error) => {
    // Check if error has a response and status code
    if (error.response?.status === 401) {
      /**
       * 401 Unauthorized means:
       * - Token is expired
       * - Token is invalid
       * - User is not logged in
       *
       * Solution: Clear auth data and redirect to login
       */

      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/login';
    }

    // If error is 403 (Forbidden), user doesn't have permission
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }

    // If error is 404 (Not Found), resource doesn't exist
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // If error is 500 (Server Error), something wrong on backend
    if (error.response?.status === 500) {
      console.error('Server error - please try again later');
    }

    // Pass error down the chain so our code can handle it
    return Promise.reject(error);
  }
);

// Export the configured axios instance with interceptors
export default axiosInstance;
```

**Visual Flow:**

```
User Code: axiosInstance.get('/api/posts')
    ↓
REQUEST INTERCEPTOR
    ↓ (adds Authorization header)
HTTP REQUEST → Server
    ↓
Server Response
    ↓
RESPONSE INTERCEPTOR
    ↓ (checks for 401, etc.)
Response reaches user code
```

---

# 4. TYPE DEFINITIONS

## 📁 File: `src/types/auth.types.ts`

**Purpose:** Define TypeScript types for authentication

```typescript
/**
 * USER INTERFACE
 *
 * Defines the structure of a user object
 * This matches what Strapi returns from the API
 */
export interface User {
  id: number;           // Unique user ID from database
  username: string;     // User's username (e.g., "john_doe")
  email: string;        // User's email (e.g., "john@example.com")
  blocked?: boolean;    // Is user blocked? (optional field)
  confirmed?: boolean;  // Is email confirmed? (optional field)
}

/**
 * LOGIN CREDENTIALS INTERFACE
 *
 * Data needed to log in
 */
export interface LoginCredentials {
  identifier: string;  // Email OR username (Strapi accepts both)
  password: string;    // User's password
}

/**
 * REGISTER DATA INTERFACE
 *
 * Data needed to create a new account
 */
export interface RegisterData {
  username: string;    // Desired username
  email: string;       // User's email
  password: string;    // Desired password
}

/**
 * AUTHENTICATION RESPONSE INTERFACE
 *
 * What Strapi returns after successful login/register
 */
export interface AuthResponse {
  jwt: string;         // JWT token for authentication
  user: User;          // User information
}

/**
 * Example usage:
 *
 * const loginData: LoginCredentials = {
 *   identifier: "john@example.com",
 *   password: "secret123"
 * };
 *
 * const response: AuthResponse = await authService.login(loginData);
 * // response.jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * // response.user = { id: 1, username: "john_doe", email: "john@example.com" }
 */
```

**Why use TypeScript interfaces?**

```typescript
// ❌ WITHOUT TYPES - No error checking
function login(data) {
  return axios.post('/api/auth/local', data);
}
login({ userName: "john" }); // Oops! It's "username", not "userName"
                              // No error until runtime!

// ✅ WITH TYPES - Catches errors before running
function login(data: LoginCredentials) {
  return axios.post('/api/auth/local', data);
}
login({ userName: "john" }); // TypeScript ERROR: Property 'userName' does not exist
                              // Should be 'identifier'!
```

---

## 📁 File: `src/types/post.types.ts`

**Purpose:** Define TypeScript types for posts

```typescript
/**
 * USER INTERFACE (simplified for posts)
 *
 * When we fetch a post, it includes basic author info
 */
export interface User {
  id: number;          // User's ID
  username: string;    // User's username
  email: string;       // User's email
}

/**
 * POST INTERFACE
 *
 * Defines the structure of a post object
 * This matches what Strapi returns
 */
export interface Post {
  id: number;              // Unique post ID
  documentId?: string;     // Strapi v4+ document ID (optional)
  title: string;           // Post title (e.g., "My First Post")
  content: string | any;   // Post content (can be string or rich text array)
  createdAt: string;       // When post was created (ISO date string)
  updatedAt: string;       // When post was last updated
  publishedAt?: string;    // When post was published (optional)
  author?: User;           // Who created the post (optional)
}

/**
 * CREATE POST DATA INTERFACE
 *
 * Data needed to create a new post
 * Only title and content are required
 */
export interface CreatePostData {
  title: string;     // Post title
  content: string;   // Post content
}

/**
 * UPDATE POST DATA INTERFACE
 *
 * Data that can be updated in a post
 * All fields are optional (update only what changed)
 */
export interface UpdatePostData {
  title?: string;    // New title (optional)
  content?: string;  // New content (optional)
}

/**
 * Example usage:
 *
 * // Creating a post
 * const newPost: CreatePostData = {
 *   title: "My First Post",
 *   content: "Hello world!"
 * };
 *
 * // Updating a post (only title)
 * const updateData: UpdatePostData = {
 *   title: "My Updated Post Title"
 *   // content is optional, we're not updating it
 * };
 *
 * // Post object from API
 * const post: Post = {
 *   id: 1,
 *   title: "My First Post",
 *   content: "Hello world!",
 *   createdAt: "2024-01-15T10:30:00.000Z",
 *   updatedAt: "2024-01-15T10:30:00.000Z",
 *   author: {
 *     id: 1,
 *     username: "john_doe",
 *     email: "john@example.com"
 *   }
 * };
 */
```

---

## 📁 File: `src/types/todo.types.ts`

**Purpose:** Define TypeScript types for todos

```typescript
/**
 * TODO INTERFACE
 *
 * Defines the structure of a todo item
 */
export interface Todo {
  id: number;              // Unique todo ID
  documentId?: string;     // Strapi v4+ document ID (optional)
  title: string;           // Todo title (e.g., "Buy groceries")
  description?: string;    // Optional description/details
  completed: boolean;      // Is todo completed? (true/false)
  createdAt: string;       // When todo was created
  updatedAt: string;       // When todo was last updated
  publishedAt?: string;    // When todo was published (optional)
}

/**
 * CREATE TODO DATA INTERFACE
 *
 * Data needed to create a new todo
 */
export interface CreateTodoData {
  title: string;              // Todo title (required)
  description?: string;       // Optional description
  completed?: boolean;        // Default: false (optional)
}

/**
 * UPDATE TODO DATA INTERFACE
 *
 * Data that can be updated in a todo
 * All fields are optional
 */
export interface UpdateTodoData {
  title?: string;            // New title (optional)
  description?: string;      // New description (optional)
  completed?: boolean;       // New completion status (optional)
}

/**
 * Example usage:
 *
 * // Creating a todo
 * const newTodo: CreateTodoData = {
 *   title: "Buy groceries",
 *   description: "Milk, eggs, bread",
 *   completed: false
 * };
 *
 * // Toggling completion
 * const toggleData: UpdateTodoData = {
 *   completed: true
 * };
 *
 * // Todo object from API
 * const todo: Todo = {
 *   id: 1,
 *   title: "Buy groceries",
 *   description: "Milk, eggs, bread",
 *   completed: false,
 *   createdAt: "2024-01-15T10:30:00.000Z",
 *   updatedAt: "2024-01-15T10:30:00.000Z"
 * };
 */
```

---

# 5. AUTHENTICATION SYSTEM

## 📁 File: `src/contexts/AuthContext.tsx`

**Purpose:** Manage authentication state globally across the app

```typescript
// React imports
import React, { createContext, useState, useContext, useEffect } from 'react';

// Import auth service for API calls
import authService from '../api/services/authService';

// Import User type
import { User } from '../types/auth.types';

/**
 * AUTHENTICATION CONTEXT TYPE
 *
 * Defines what data and functions the context provides
 */
interface AuthContextType {
  user: User | null;              // Current user (null if not logged in)
  token: string | null;           // JWT token (null if not logged in)
  login: (identifier: string, password: string) => Promise<void>;  // Login function
  register: (username: string, email: string, password: string) => Promise<void>; // Register function
  logout: () => void;             // Logout function
  isAuthenticated: boolean;       // Is user logged in? (true/false)
}

/**
 * CREATE CONTEXT
 *
 * Context allows us to share data across components
 * without passing props down manually
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AUTH PROVIDER COMPONENT
 *
 * This component wraps our entire app and provides auth state
 * to all child components
 *
 * Usage:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State: Current user
  const [user, setUser] = useState<User | null>(null);

  // State: Authentication token
  const [token, setToken] = useState<string | null>(null);

  /**
   * EFFECT: Load saved auth data on mount
   *
   * When app loads, check localStorage for saved token and user
   * If found, restore the logged-in state
   */
  useEffect(() => {
    // Get saved token from localStorage
    const savedToken = localStorage.getItem('token');

    // Get saved user from localStorage
    const savedUser = localStorage.getItem('user');

    // If both exist, restore the authentication state
    if (savedToken && savedUser) {
      setToken(savedToken);               // Restore token
      setUser(JSON.parse(savedUser));     // Parse and restore user object
    }
  }, []); // Empty dependency array = run once on mount

  /**
   * LOGIN FUNCTION
   *
   * Purpose: Log in a user with email/username and password
   *
   * @param identifier - Email or username
   * @param password - User's password
   *
   * Process:
   * 1. Call API to authenticate
   * 2. Receive JWT token and user data
   * 3. Save to state
   * 4. Save to localStorage (for persistence)
   */
  const login = async (identifier: string, password: string) => {
    // Call auth service to log in
    const response = await authService.login({ identifier, password });

    // Save token to state
    setToken(response.jwt);

    // Save user to state
    setUser(response.user);

    // Save token to localStorage (persists across page refreshes)
    localStorage.setItem('token', response.jwt);

    // Save user to localStorage (convert object to JSON string)
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  /**
   * REGISTER FUNCTION
   *
   * Purpose: Create a new user account
   *
   * @param username - Desired username
   * @param email - User's email
   * @param password - Desired password
   *
   * Process: Same as login (Strapi auto-logs in after registration)
   */
  const register = async (username: string, email: string, password: string) => {
    // Call auth service to register
    const response = await authService.register({ username, email, password });

    // Save token to state
    setToken(response.jwt);

    // Save user to state
    setUser(response.user);

    // Save token to localStorage
    localStorage.setItem('token', response.jwt);

    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  /**
   * LOGOUT FUNCTION
   *
   * Purpose: Log out the current user
   *
   * Process:
   * 1. Clear state
   * 2. Clear localStorage
   */
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * RENDER PROVIDER
   *
   * Provide auth state and functions to all child components
   */
  return (
    <AuthContext.Provider
      value={{
        user,                          // Current user
        token,                         // Current token
        login,                         // Login function
        register,                      // Register function
        logout,                        // Logout function
        isAuthenticated: !!token,      // True if token exists (!! converts to boolean)
      }}
    >
      {children}  {/* Render child components */}
    </AuthContext.Provider>
  );
};

/**
 * CUSTOM HOOK: useAuth
 *
 * Purpose: Easy way to access auth context in any component
 *
 * Usage:
 * const { user, login, logout } = useAuth();
 *
 * This hook:
 * 1. Gets the context
 * 2. Checks if it exists (must be used inside AuthProvider)
 * 3. Returns the context value
 */
export const useAuth = () => {
  // Get context
  const context = useContext(AuthContext);

  // Check if context exists
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  // Return context
  return context;
};

/**
 * HOW TO USE IN COMPONENTS:
 *
 * import { useAuth } from '../contexts/AuthContext';
 *
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 *   if (isAuthenticated) {
 *     return <p>Welcome, {user.username}!</p>;
 *   }
 *
 *   return <p>Please log in</p>;
 * }
 */
```

---

# 6. SERVICES LAYER

## 📁 File: `src/api/services/authService.ts`

**Purpose:** Handle all authentication-related API calls

```typescript
// Import configured axios instance
import axiosInstance from '../axios';

// Import types
import { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth.types';

/**
 * AUTHENTICATION SERVICE
 *
 * This object contains all authentication-related functions
 * Benefits:
 * - Centralized API calls
 * - Easy to test
 * - Reusable across components
 */
const authService = {
  /**
   * LOGIN FUNCTION
   *
   * Purpose: Authenticate a user with email/username and password
   *
   * @param credentials - Object with identifier and password
   * @returns Promise with JWT token and user data
   *
   * API Endpoint: POST /api/auth/local
   * Strapi docs: https://docs.strapi.io/dev-docs/plugins/users-permissions
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Make POST request to Strapi's login endpoint
      // axiosInstance already has the base URL (http://localhost:1337)
      const response = await axiosInstance.post<AuthResponse>(
        '/api/auth/local',     // Endpoint path
        credentials            // Request body: { identifier, password }
      );

      // Response contains: { jwt: "token...", user: {...} }
      return response.data;

    } catch (error: any) {
      // Error handling

      // Extract error message from Strapi response
      // error.response.data.error.message contains the error message
      const errorMessage =
        error.response?.data?.error?.message || 'Login failed';

      // Throw new error with meaningful message
      throw new Error(errorMessage);
    }
  },

  /**
   * REGISTER FUNCTION
   *
   * Purpose: Create a new user account
   *
   * @param data - Object with username, email, and password
   * @returns Promise with JWT token and user data
   *
   * API Endpoint: POST /api/auth/local/register
   * Note: Strapi automatically logs in user after registration
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Make POST request to Strapi's registration endpoint
      const response = await axiosInstance.post<AuthResponse>(
        '/api/auth/local/register',  // Endpoint path
        data                          // Request body: { username, email, password }
      );

      // Response contains: { jwt: "token...", user: {...} }
      return response.data;

    } catch (error: any) {
      // Extract error message from response
      const errorMessage =
        error.response?.data?.error?.message || 'Registration failed';

      // Throw new error with meaningful message
      throw new Error(errorMessage);
    }
  },

  /**
   * GET CURRENT USER FUNCTION
   *
   * Purpose: Fetch current user's data using JWT token
   *
   * @param token - JWT authentication token
   * @returns Promise with user data
   *
   * API Endpoint: GET /api/users/me
   *
   * Use case: Refresh user data after token is restored from localStorage
   */
  getCurrentUser: async (token: string) => {
    try {
      // Make GET request with Authorization header
      const response = await axiosInstance.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,  // JWT token in Authorization header
        },
      });

      // Return user data
      return response.data;

    } catch (error: any) {
      // If failed, throw error
      throw new Error('Failed to fetch user data');
    }
  },
};

// Export auth service for use in other files
export default authService;

/**
 * HOW TO USE IN COMPONENTS:
 *
 * import authService from '../api/services/authService';
 *
 * // Login
 * try {
 *   const response = await authService.login({
 *     identifier: "john@example.com",
 *     password: "password123"
 *   });
 *
 *   console.log(response.jwt);   // Token
 *   console.log(response.user);  // User data
 * } catch (error) {
 *   console.error(error.message);
 * }
 *
 * // Register
 * try {
 *   const response = await authService.register({
 *     username: "john_doe",
 *     email: "john@example.com",
 *     password: "password123"
 *   });
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
```

---

## 📁 File: `src/api/services/postService.ts`

**Purpose:** Handle all post-related API calls

```typescript
// Import configured axios instance
import axiosInstance from '../axios';

/**
 * TYPE DEFINITIONS
 *
 * Define interfaces for posts and API responses
 */

// User interface (simplified)
interface User {
  id: number;
  username: string;
  email: string;
}

// Post interface
interface Post {
  id: number;
  title: string;
  content: string | any;   // Can be string or rich text array
  createdAt: string;
  updatedAt: string;
  author?: User;
}

// Strapi response format (Strapi v4 wraps data)
interface StrapiResponse<T> {
  data: T;       // Actual data
  meta?: any;    // Metadata (pagination, etc.)
}

/**
 * UTILITY FUNCTION: Convert plain text to Strapi rich text format
 *
 * Strapi's rich text editor stores content as JSON array of blocks
 * We need to convert plain text strings to this format
 *
 * @param text - Plain text string
 * @returns Array of rich text blocks
 *
 * Example:
 * Input: "Hello\nWorld"
 * Output: [
 *   { type: 'paragraph', children: [{ type: 'text', text: 'Hello' }] },
 *   { type: 'paragraph', children: [{ type: 'text', text: 'World' }] }
 * ]
 */
const convertToRichText = (text: string): any[] => {
  // Split text by newlines to create separate paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

  // If no content, return empty paragraph
  if (paragraphs.length === 0) {
    return [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '' }]
      }
    ];
  }

  // Convert each paragraph to rich text block format
  return paragraphs.map(paragraph => ({
    type: 'paragraph',          // Block type
    children: [                  // Block content
      {
        type: 'text',            // Text node
        text: paragraph          // Actual text
      }
    ]
  }));
};

/**
 * POST SERVICE
 *
 * Contains all post-related API functions
 */
const postService = {
  /**
   * GET ALL POSTS
   *
   * Purpose: Fetch all posts from database
   *
   * @returns Promise with array of posts
   *
   * API: GET /api/posts?populate=author
   *
   * Query parameter "populate=author":
   * - Tells Strapi to include author information
   * - Without it, we only get author ID
   * - With it, we get full author object (username, email, etc.)
   */
  getAllPosts: async (): Promise<Post[]> => {
    try {
      // Make GET request with populate parameter
      const response = await axiosInstance.get<StrapiResponse<Post[]>>(
        '/api/posts?populate=author'
      );

      // Strapi v4 wraps data: { data: [...] }
      // Extract the actual posts array
      return response.data.data;

    } catch (error: any) {
      // Log error for debugging
      console.error('Error fetching posts:', error);

      // Extract error message
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch posts';

      // Throw error
      throw new Error(errorMessage);
    }
  },

  /**
   * GET POST BY ID
   *
   * Purpose: Fetch a specific post by its ID
   *
   * @param id - Post ID
   * @returns Promise with post data
   *
   * API: GET /api/posts/:id?populate=author
   */
  getPostById: async (id: number): Promise<Post> => {
    try {
      // Make GET request with post ID in URL
      const response = await axiosInstance.get<StrapiResponse<Post>>(
        `/api/posts/${id}?populate=author`
      );

      // Extract post from response
      return response.data.data;

    } catch (error: any) {
      console.error('Error fetching post:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch post';

      throw new Error(errorMessage);
    }
  },

  /**
   * CREATE POST
   *
   * Purpose: Create a new post
   *
   * @param data - Object with title and content
   * @returns Promise with created post data
   *
   * API: POST /api/posts?populate=author
   *
   * Important:
   * - User must be authenticated (token required)
   * - Strapi automatically links post to authenticated user
   * - Content is converted to rich text format
   */
  createPost: async (data: { title: string; content: string }): Promise<Post> => {
    try {
      // Convert plain text content to Strapi rich text format
      const richTextContent = convertToRichText(data.content);

      // Prepare post data
      const postData = {
        title: data.title,
        content: richTextContent  // Rich text array
      };

      // Make POST request
      // Strapi v4 expects: { data: {...} }
      // ?populate=author returns post WITH author info
      const response = await axiosInstance.post<StrapiResponse<Post>>(
        '/api/posts?populate=author',
        { data: postData }          // Wrap in { data: ... }
      );

      console.log('Post created successfully:', response.data);

      // Return created post
      return response.data.data;

    } catch (error: any) {
      // Enhanced error logging
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);

      // Extract error message
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        'Failed to create post';

      throw new Error(errorMessage);
    }
  },

  /**
   * UPDATE POST
   *
   * Purpose: Modify an existing post
   *
   * @param id - Post ID to update
   * @param data - Fields to update (title, content)
   * @returns Promise with updated post data
   *
   * API: PUT /api/posts/:id?populate=author
   *
   * Security:
   * - User can only update their own posts
   * - Strapi checks if authenticated user owns the post
   */
  updatePost: async (id: number, data: { title?: string; content?: string }): Promise<Post> => {
    try {
      // Prepare update data
      const updateData: any = {
        // Include title if provided
        ...(data.title && { title: data.title })
      };

      // If content is being updated, convert to rich text
      if (data.content !== undefined) {
        updateData.content = convertToRichText(data.content);
      }

      // Make PUT request
      // PUT is for updating existing resources
      const response = await axiosInstance.put<StrapiResponse<Post>>(
        `/api/posts/${id}?populate=author`,
        { data: updateData }         // Wrap in { data: ... }
      );

      console.log('Post updated successfully:', response.data);

      // Return updated post
      return response.data.data;

    } catch (error: any) {
      console.error('Error updating post:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to update post';

      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE POST
   *
   * Purpose: Remove a post from database
   *
   * @param id - Post ID to delete
   * @returns Promise (resolves when deletion complete)
   *
   * API: DELETE /api/posts/:id
   *
   * Security:
   * - User can only delete their own posts
   * - Strapi verifies post ownership
   *
   * Important:
   * - This permanently deletes the post
   * - Cannot be undone
   */
  deletePost: async (id: number): Promise<void> => {
    try {
      // Make DELETE request with post ID
      await axiosInstance.delete(`/api/posts/${id}`);

      console.log('Post deleted successfully');

      // No return value needed
      // Success = post was deleted

    } catch (error: any) {
      console.error('Error deleting post:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to delete post';

      throw new Error(errorMessage);
    }
  },
};

// Export post service
export default postService;

/**
 * HOW TO USE IN COMPONENTS:
 *
 * import postService from '../api/services/postService';
 *
 * // Get all posts
 * const posts = await postService.getAllPosts();
 *
 * // Create post
 * const newPost = await postService.createPost({
 *   title: "My First Post",
 *   content: "Hello world!"
 * });
 *
 * // Update post
 * const updated = await postService.updatePost(1, {
 *   title: "Updated Title"
 * });
 *
 * // Delete post
 * await postService.deletePost(1);
 */
```

---

**CONTINUE TO PART 2 for remaining files...**

This is Part 1. Would you like me to continue with Part 2 containing:
- Todo Service
- React Components (ProtectedRoute, etc.)
- Pages (Login, Register, Dashboard, Posts, Todos)
- Main App files

Let me know and I'll create Part 2 immediately!
