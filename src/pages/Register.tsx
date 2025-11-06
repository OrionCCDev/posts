/**
 * REGISTER PAGE
 *
 * Purpose: Allow new users to create an account
 *
 * What does this page do?
 * - Display registration form (username, email, password)
 * - Validate user input
 * - Send registration data to Strapi
 * - Automatically log in user after successful registration
 * - Redirect to home page
 * - Show error messages if registration fails
 *
 * Flow:
 * 1. User fills out form
 * 2. User clicks "Register" button
 * 3. Form validates inputs (matching passwords, etc.)
 * 4. Send data to Strapi
 * 5. If successful → user is logged in and redirected to home
 * 6. If failed → show error message
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * REGISTER COMPONENT
 */
const Register: React.FC = () => {
  /**
   * HOOKS
   */

  // Get register function from auth context
  const { register } = useAuth();

  // Get navigation function for redirecting after registration
  const navigate = useNavigate();

  /**
   * FORM STATE
   *
   * We need more fields for registration than login:
   * - username: Unique username
   * - email: Email address
   * - password: Chosen password
   * - confirmPassword: Re-enter password to confirm
   */

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error message state
  const [error, setError] = useState<string | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  /**
   * FORM VALIDATION
   *
   * Purpose: Check if form data is valid before submitting
   *
   * Validation rules:
   * - All fields must be filled
   * - Email must be valid format
   * - Password must be strong enough (min length)
   * - Passwords must match
   *
   * @returns true if valid, false otherwise (sets error message)
   */
  const validateForm = (): boolean => {
    // Check if passwords match
    // This is important to prevent typos in password
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password length
    // Weak passwords are security risk
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Check email format using regex (regular expression)
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check username length
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    // All validations passed
    return true;
  };

  /**
   * FORM SUBMIT HANDLER
   *
   * Purpose: Handle registration form submission
   *
   * How it works:
   * 1. Prevent default form behavior
   * 2. Clear previous errors
   * 3. Validate form data
   * 4. If valid, send to Strapi
   * 5. If successful, user is logged in and redirected
   * 6. If failed, show error
   *
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent page reload
    e.preventDefault();

    // Clear previous error
    setError(null);

    // Validate form
    // If validation fails, stop here
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call register function from auth context
      // This sends data to Strapi's registration endpoint
      await register(username, email, password);

      // If successful, user is now logged in
      // Redirect to home page
      navigate('/');
    } catch (err: any) {
      // If registration fails, show error
      // Common errors: email already exists, username taken
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      // Always set loading back to false
      setLoading(false);
    }
  };

  /**
   * RENDER REGISTRATION FORM
   */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      {/* Form Container Card */}
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Register
        </h2>

        {/* Error Alert - Only show if error exists */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/*
            USERNAME INPUT
          */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
              required
              minLength={3}
            />
            {/* Helper text */}
            <p className="text-sm text-gray-500 mt-1">
              At least 3 characters
            </p>
          </div>

          {/*
            EMAIL INPUT
          */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/*
            PASSWORD INPUT
          */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a password"
              required
              minLength={6}
            />
            {/* Helper text for password requirements */}
            <p className="text-sm text-gray-500 mt-1">
              At least 6 characters
            </p>
          </div>

          {/*
            CONFIRM PASSWORD INPUT
            Purpose: Ensure user typed password correctly
          */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter your password"
              required
            />
          </div>

          {/*
            SUBMIT BUTTON
          */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/*
          LINK TO LOGIN PAGE
          For users who already have an account
        */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Export component
export default Register;

/**
 * LEARNING NOTES
 *
 * Form Validation:
 * - Always validate on client-side (quick feedback)
 * - Always validate on server-side too (security)
 * - Common validations: required fields, email format, password strength
 *
 * Password Security:
 * - Never store passwords in plain text
 * - Strapi automatically hashes passwords
 * - Use HTTPS in production to encrypt transmission
 *
 * User Experience:
 * - Show clear error messages
 * - Disable submit button while loading (prevent double submission)
 * - Give feedback about requirements (helper text)
 * - Provide link to login if user already has account
 */
