/**
 * LOGIN PAGE
 *
 * Purpose: Allow users to log into the application
 *
 * What does this page do?
 * - Display a login form (username/email and password)
 * - Validate user input
 * - Send credentials to Strapi for authentication
 * - Redirect to home page on successful login
 * - Show error messages if login fails
 *
 * Flow:
 * 1. User enters credentials
 * 2. User clicks "Login" button
 * 3. Form submits → calls login function
 * 4. If successful → redirect to home
 * 5. If failed → show error message
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LOGIN COMPONENT
 */
const Login: React.FC = () => {
  /**
   * HOOKS
   */

  // Get login function from auth context
  const { login } = useAuth();

  // Get navigation function for redirecting after login
  const navigate = useNavigate();

  /**
   * FORM STATE
   *
   * What is state?
   * - Data that can change in a component
   * - When state changes, component re-renders
   *
   * useState hook:
   * - Returns [currentValue, functionToUpdateValue]
   * - Example: const [count, setCount] = useState(0)
   */

  // Store username/email entered by user
  const [identifier, setIdentifier] = useState('');

  // Store password entered by user
  const [password, setPassword] = useState('');

  // Store error message (null if no error)
  const [error, setError] = useState<string | null>(null);

  // Track if login request is in progress
  // Used to disable button and show loading state
  const [loading, setLoading] = useState(false);

  /**
   * FORM SUBMIT HANDLER
   *
   * Purpose: Handle login form submission
   *
   * What is an event handler?
   * - Function that runs when an event occurs (like form submit)
   * - Receives event object as parameter
   *
   * How it works:
   * 1. Prevent default form behavior (page reload)
   * 2. Clear any previous error
   * 3. Set loading state to true (show loading, disable button)
   * 4. Call login function from auth context
   * 5. If successful, redirect to home page
   * 6. If failed, show error message
   * 7. Set loading state back to false
   *
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    // Without this, page would reload
    e.preventDefault();

    // Clear any previous error message
    setError(null);

    // Set loading state to true
    // This disables the submit button and shows loading text
    setLoading(true);

    try {
      // Call login function from auth context
      // This sends credentials to Strapi
      await login(identifier, password);

      // If we reach here, login was successful
      // Redirect user to home page
      navigate('/');
    } catch (err: any) {
      // If login fails, catch the error
      // Set error message to display to user
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      // Always run this, whether success or error
      // Set loading back to false
      setLoading(false);
    }
  };

  /**
   * RENDER LOGIN FORM
   *
   * JSX Structure:
   * - Centered container
   * - Card with form
   * - Input fields
   * - Submit button
   * - Link to register page
   */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      {/*
        Form Container Card
        - max-w-md: Maximum width for readability
        - w-full: Full width up to max-w
        - bg-white: White background
        - rounded-lg: Rounded corners
        - shadow-md: Drop shadow for depth
        - p-8: Padding inside card
      */}
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>

        {/*
          ERROR ALERT
          Conditional rendering: only show if error exists
          If error is not null, display error message
        */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/*
          LOGIN FORM
          onSubmit: Function to call when form is submitted
          Can submit by clicking button or pressing Enter
        */}
        <form onSubmit={handleSubmit}>
          {/*
            USERNAME/EMAIL INPUT FIELD
          */}
          <div className="mb-4">
            {/* Label for input (accessibility) */}
            <label
              htmlFor="identifier"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username or Email
            </label>

            {/*
              Input field
              - type="text": Text input
              - value: Controlled input (React manages the value)
              - onChange: Update state when user types
              - required: HTML5 validation (must be filled)
            */}
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username or email"
              required
            />
          </div>

          {/*
            PASSWORD INPUT FIELD
          */}
          <div className="mb-6">
            {/* Label for password */}
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>

            {/*
              Password input
              - type="password": Hides characters (shows dots)
              - Controlled input with onChange
            */}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/*
            SUBMIT BUTTON
            - type="submit": Triggers form submission
            - disabled: Can't click while loading
            - Conditional text: "Logging in..." or "Login"
          */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'  // Gray when loading
                : 'bg-blue-600 hover:bg-blue-700'   // Blue when ready
            }`}
          >
            {/* Show different text based on loading state */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/*
          LINK TO REGISTER PAGE
          For users who don't have an account yet
        */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Export component
export default Login;
