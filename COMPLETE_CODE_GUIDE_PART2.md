# Complete Code Guide - Part 2
## Continuation: React Components, Pages, and Main Application

This is Part 2 of the complete code guide with line-by-line explanations.

---

# 7. SERVICES LAYER (Continued)

## 📁 File: `src/api/services/todoService.ts`

**Purpose:** Handle all todo-related API calls

```typescript
// Import configured axios instance
import axiosInstance from '../axios';

// Import types
import { Todo, CreateTodoData, UpdateTodoData } from '../../types/todo.types';

/**
 * STRAPI RESPONSE INTERFACE
 *
 * Strapi v4 wraps responses in this format
 */
interface StrapiResponse<T> {
  data: T;       // Actual data
  meta?: any;    // Metadata
}

/**
 * TODO SERVICE
 *
 * Contains all todo-related API functions
 */
const todoService = {
  /**
   * GET ALL TODOS
   *
   * Purpose: Fetch all todos from database
   *
   * @returns Promise with array of todos
   *
   * API: GET /api/todos
   */
  getAllTodos: async (): Promise<Todo[]> => {
    try {
      // Make GET request to fetch all todos
      const response = await axiosInstance.get<StrapiResponse<Todo[]>>(
        '/api/todos'
      );

      // Strapi v4 wraps data: { data: [...] }
      // Extract the actual todos array
      return response.data.data;

    } catch (error: any) {
      // Log error for debugging
      console.error('Error fetching todos:', error);

      // Extract error message from Strapi response
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch todos';

      // Throw error with meaningful message
      throw new Error(errorMessage);
    }
  },

  /**
   * GET TODO BY ID
   *
   * Purpose: Fetch a specific todo by its ID
   *
   * @param id - Todo ID
   * @returns Promise with todo data
   *
   * API: GET /api/todos/:id
   */
  getTodoById: async (id: number): Promise<Todo> => {
    try {
      // Make GET request with todo ID in URL
      const response = await axiosInstance.get<StrapiResponse<Todo>>(
        `/api/todos/${id}`
      );

      // Extract todo from response
      return response.data.data;

    } catch (error: any) {
      console.error('Error fetching todo:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch todo';

      throw new Error(errorMessage);
    }
  },

  /**
   * CREATE TODO
   *
   * Purpose: Create a new todo item
   *
   * @param data - Object with title, description, completed status
   * @returns Promise with created todo data
   *
   * API: POST /api/todos
   *
   * Important:
   * - User must be authenticated
   * - completed defaults to false if not provided
   */
  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    try {
      // Make POST request with todo data
      // Strapi v4 expects data wrapped in { data: {...} }
      const response = await axiosInstance.post<StrapiResponse<Todo>>(
        '/api/todos',
        { data }          // Wrap data
      );

      console.log('Todo created successfully:', response.data);

      // Return created todo
      return response.data.data;

    } catch (error: any) {
      console.error('Error creating todo:', error);

      // Extract error message
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to create todo';

      throw new Error(errorMessage);
    }
  },

  /**
   * UPDATE TODO
   *
   * Purpose: Modify an existing todo
   *
   * @param id - Todo ID to update
   * @param data - Fields to update
   * @returns Promise with updated todo data
   *
   * API: PUT /api/todos/:id
   *
   * Common use cases:
   * - Update title: { title: "New title" }
   * - Toggle completion: { completed: true }
   * - Update description: { description: "New description" }
   */
  updateTodo: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    try {
      // Make PUT request with todo ID and update data
      const response = await axiosInstance.put<StrapiResponse<Todo>>(
        `/api/todos/${id}`,
        { data }          // Wrap data
      );

      console.log('Todo updated successfully:', response.data);

      // Return updated todo
      return response.data.data;

    } catch (error: any) {
      console.error('Error updating todo:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to update todo';

      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE TODO
   *
   * Purpose: Remove a todo from database
   *
   * @param id - Todo ID to delete
   * @returns Promise (resolves when deletion complete)
   *
   * API: DELETE /api/todos/:id
   *
   * Important: This permanently deletes the todo
   */
  deleteTodo: async (id: number): Promise<void> => {
    try {
      // Make DELETE request with todo ID
      await axiosInstance.delete(`/api/todos/${id}`);

      console.log('Todo deleted successfully');

      // No return value needed

    } catch (error: any) {
      console.error('Error deleting todo:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to delete todo';

      throw new Error(errorMessage);
    }
  },

  /**
   * TOGGLE TODO COMPLETION
   *
   * Purpose: Quick function to toggle completed status
   *
   * @param id - Todo ID
   * @param completed - New completion status
   * @returns Promise with updated todo data
   *
   * This is a convenience function that calls updateTodo
   * specifically for toggling completion status
   */
  toggleTodo: async (id: number, completed: boolean): Promise<Todo> => {
    try {
      // Call updateTodo with only completed field
      const response = await axiosInstance.put<StrapiResponse<Todo>>(
        `/api/todos/${id}`,
        { data: { completed } }  // Only update completed status
      );

      console.log('Todo toggled successfully');

      // Return updated todo
      return response.data.data;

    } catch (error: any) {
      console.error('Error toggling todo:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to toggle todo';

      throw new Error(errorMessage);
    }
  },
};

// Export todo service
export default todoService;

/**
 * HOW TO USE IN COMPONENTS:
 *
 * import todoService from '../api/services/todoService';
 *
 * // Get all todos
 * const todos = await todoService.getAllTodos();
 *
 * // Create todo
 * const newTodo = await todoService.createTodo({
 *   title: "Buy groceries",
 *   description: "Milk, eggs, bread",
 *   completed: false
 * });
 *
 * // Update todo
 * const updated = await todoService.updateTodo(1, {
 *   title: "Buy groceries and vegetables"
 * });
 *
 * // Toggle completion
 * await todoService.toggleTodo(1, true);
 *
 * // Delete todo
 * await todoService.deleteTodo(1);
 */
```

---

# 8. REACT COMPONENTS

## 📁 File: `src/components/ProtectedRoute.tsx`

**Purpose:** Prevent unauthorized access to protected pages

```typescript
// React imports
import React from 'react';

// Import Navigate for redirecting
import { Navigate } from 'react-router-dom';

// Import useAuth hook to check authentication status
import { useAuth } from '../contexts/AuthContext';

/**
 * PROTECTED ROUTE PROPS INTERFACE
 *
 * Define what props this component accepts
 */
interface ProtectedRouteProps {
  children: React.ReactNode;  // The component/page to protect
}

/**
 * PROTECTED ROUTE COMPONENT
 *
 * Purpose: Wrap protected pages to require authentication
 *
 * How it works:
 * 1. Check if user is authenticated (using useAuth)
 * 2. If NOT authenticated → redirect to login page
 * 3. If authenticated → render the protected page
 *
 * Usage in App.tsx:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get authentication status from context
  const { isAuthenticated } = useAuth();

  // Check authentication status
  if (!isAuthenticated) {
    /**
     * User is NOT authenticated
     *
     * Navigate component redirects to login page
     * replace prop replaces current history entry
     * (user can't go "back" to protected page they couldn't access)
     */
    return <Navigate to="/login" replace />;
  }

  /**
   * User IS authenticated
   *
   * Render the protected component (children)
   * <> is a React Fragment - renders children without extra DOM elements
   */
  return <>{children}</>;
};

// Export component
export default ProtectedRoute;

/**
 * VISUAL FLOW:
 *
 * User tries to access /dashboard
 *        ↓
 * ProtectedRoute checks authentication
 *        ↓
 *   Is authenticated?
 *    ↙         ↘
 *  YES         NO
 *   ↓           ↓
 * Render      Redirect
 * Dashboard   to /login
 */

/**
 * EXAMPLE WITHOUT ProtectedRoute (BAD):
 *
 * <Route path="/dashboard" element={<Dashboard />} />
 *
 * Problem: Anyone can access /dashboard, even without login!
 *
 * EXAMPLE WITH ProtectedRoute (GOOD):
 *
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 *
 * Benefit: Only authenticated users can access dashboard
 */
```

---

# 9. PAGES

## 📁 File: `src/pages/Login.tsx`

**Purpose:** Login page where users authenticate

```typescript
// React imports
import React, { useState } from 'react';

// Router imports for navigation
import { useNavigate, Link } from 'react-router-dom';

// Import useAuth hook for login function
import { useAuth } from '../contexts/AuthContext';

/**
 * LOGIN PAGE COMPONENT
 *
 * Purpose: Allow users to log in with email/username and password
 *
 * Features:
 * - Login form
 * - Error handling
 * - Loading state
 * - Link to registration page
 */
const Login: React.FC = () => {
  // Get navigate function for redirecting after login
  const navigate = useNavigate();

  // Get login function from auth context
  const { login } = useAuth();

  // STATE: Form input values
  const [identifier, setIdentifier] = useState('');  // Email or username
  const [password, setPassword] = useState('');      // Password

  // STATE: Error message
  const [error, setError] = useState('');

  // STATE: Loading state (true while API call is in progress)
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE FORM SUBMIT
   *
   * Purpose: Process login when user submits form
   *
   * @param e - Form event
   *
   * Process:
   * 1. Prevent default form submission (page refresh)
   * 2. Clear previous errors
   * 3. Set loading state
   * 4. Call login function
   * 5. On success: redirect to dashboard
   * 6. On error: show error message
   * 7. Always: clear loading state
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent page refresh on form submit
    e.preventDefault();

    // Clear any previous error messages
    setError('');

    // Set loading state (disables button, shows loading text)
    setLoading(true);

    try {
      // Call login function from auth context
      // This makes API call to authenticate user
      await login(identifier, password);

      // If we reach here, login was successful
      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      // Login failed
      // Display error message to user
      setError(err.message || 'Login failed');

    } finally {
      // Always run this, whether success or error
      // Clear loading state
      setLoading(false);
    }
  };

  /**
   * RENDER LOGIN PAGE
   */
  return (
    // Full-height container with centered content
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Login card */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Page title */}
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Error message (only shown if error exists) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Email/Username input */}
          <div className="mb-4">
            {/* Label */}
            <label className="block text-gray-700 mb-2">
              Email or Username
            </label>

            {/* Input field */}
            <input
              type="text"                          // Text input
              value={identifier}                   // Controlled input (value from state)
              onChange={(e) => setIdentifier(e.target.value)}  // Update state on change
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email or username"
              required                             // HTML5 validation
            />
          </div>

          {/* Password input */}
          <div className="mb-6">
            {/* Label */}
            <label className="block text-gray-700 mb-2">
              Password
            </label>

            {/* Input field */}
            <input
              type="password"                      // Password input (hidden text)
              value={password}                     // Controlled input
              onChange={(e) => setPassword(e.target.value)}  // Update state
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required                             // HTML5 validation
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"                          // Submit form on click
            disabled={loading}                     // Disable while loading
            className={`w-full py-2 rounded font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'  // Gray when loading
                : 'bg-blue-600 hover:bg-blue-700'   // Blue when ready
            }`}
          >
            {/* Button text changes based on loading state */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to registration page */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

// Export component
export default Login;

/**
 * COMPONENT FLOW:
 *
 * 1. User enters email and password
 * 2. User clicks "Login" button
 * 3. handleSubmit runs:
 *    - Prevents page refresh
 *    - Sets loading = true
 *    - Calls login() from AuthContext
 *    - login() calls authService.login()
 *    - API returns JWT token and user data
 *    - Token saved to localStorage
 *    - User redirected to /dashboard
 * 4. If error occurs:
 *    - Error message displayed
 *    - Loading state cleared
 *    - User can try again
 */
```

---

## 📁 File: `src/pages/Register.tsx`

**Purpose:** Registration page for new users

```typescript
// React imports
import React, { useState } from 'react';

// Router imports
import { useNavigate, Link } from 'react-router-dom';

// Import useAuth hook for register function
import { useAuth } from '../contexts/AuthContext';

/**
 * REGISTER PAGE COMPONENT
 *
 * Purpose: Allow new users to create an account
 *
 * Features:
 * - Registration form (username, email, password)
 * - Error handling
 * - Loading state
 * - Link to login page
 */
const Register: React.FC = () => {
  // Get navigate function for redirecting after registration
  const navigate = useNavigate();

  // Get register function from auth context
  const { register } = useAuth();

  // STATE: Form input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // STATE: Error and success messages
  const [error, setError] = useState('');

  // STATE: Loading state
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE FORM SUBMIT
   *
   * Purpose: Process registration when user submits form
   *
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Basic validation: check password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;  // Stop here, don't submit
    }

    // Set loading state
    setLoading(true);

    try {
      // Call register function from auth context
      // This makes API call to create new user
      await register(username, email, password);

      // If successful, user is auto-logged in by Strapi
      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      // Registration failed
      // Display error message
      setError(err.message || 'Registration failed');

    } finally {
      // Clear loading state
      setLoading(false);
    }
  };

  /**
   * RENDER REGISTRATION PAGE
   */
  return (
    // Full-height container with centered content
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Registration card */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Page title */}
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Username input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
              required
              minLength={3}  // Username must be at least 3 characters
            />
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"   // Email validation by browser
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a password (min. 6 characters)"
              required
              minLength={6}  // Password must be at least 6 characters
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Link to login page */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// Export component
export default Register;

/**
 * VALIDATION LEVELS:
 *
 * 1. HTML5 Validation (built-in):
 *    - required: Field must not be empty
 *    - type="email": Must be valid email format
 *    - minLength: Minimum character length
 *
 * 2. Custom Validation (our code):
 *    - Password length check: if (password.length < 6)
 *
 * 3. Server Validation (Strapi):
 *    - Username uniqueness
 *    - Email uniqueness
 *    - Email format validation
 */
```

---

## 📁 File: `src/pages/Dashboard.tsx`

**Purpose:** Main dashboard page after login

```typescript
// React imports
import React from 'react';

// Router imports
import { Link } from 'react-router-dom';

// Import useAuth to get current user
import { useAuth } from '../contexts/AuthContext';

/**
 * DASHBOARD PAGE COMPONENT
 *
 * Purpose: Home page after user logs in
 *
 * Features:
 * - Welcome message with username
 * - Navigation cards to Posts and Todos
 * - Logout button
 */
const Dashboard: React.FC = () => {
  // Get user and logout function from auth context
  const { user, logout } = useAuth();

  /**
   * RENDER DASHBOARD
   */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* App logo/title */}
          <h1 className="text-xl font-bold text-gray-800">My App</h1>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            {/* Display username */}
            <span className="text-gray-600">
              Welcome, {user?.username}!
            </span>

            {/* Logout button */}
            <button
              onClick={logout}  // Call logout function on click
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

        {/* Navigation cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Posts card */}
          <Link
            to="/posts"  // Link to posts page
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {/* Card icon */}
            <div className="text-4xl mb-4">📝</div>

            {/* Card title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Posts</h3>

            {/* Card description */}
            <p className="text-gray-600">
              Create and manage your posts. Share your thoughts with others.
            </p>
          </Link>

          {/* Todos card */}
          <Link
            to="/todos"  // Link to todos page
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {/* Card icon */}
            <div className="text-4xl mb-4">✅</div>

            {/* Card title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Todos</h3>

            {/* Card description */}
            <p className="text-gray-600">
              Keep track of your tasks. Mark them complete when done.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export component
export default Dashboard;

/**
 * TAILWIND CSS CLASSES EXPLAINED:
 *
 * Layout:
 * - min-h-screen: Minimum height = viewport height
 * - container: Center content with max-width
 * - mx-auto: Horizontal margin auto (centers)
 * - px-4: Horizontal padding
 * - py-8: Vertical padding
 *
 * Grid:
 * - grid: CSS grid layout
 * - grid-cols-1: 1 column on mobile
 * - md:grid-cols-2: 2 columns on medium screens+
 * - gap-6: Gap between grid items
 *
 * Colors:
 * - bg-gray-100: Light gray background
 * - text-gray-800: Dark gray text
 * - bg-white: White background
 *
 * Effects:
 * - shadow-md: Medium shadow
 * - hover:shadow-lg: Large shadow on hover
 * - transition: Smooth transitions
 */
```

---

**Continue to Part 3? (Y/N)**

I've completed Part 2 with:
- Todo Service
- ProtectedRoute component
- Login page
- Register page
- Dashboard page

Part 3 will include:
- Posts page (full implementation)
- Todos page (full implementation)
- App.tsx (main application setup)
- main.tsx (entry point)
- index.css (global styles)

Would you like me to create Part 3 now?
