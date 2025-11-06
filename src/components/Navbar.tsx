/**
 * NAVBAR COMPONENT
 *
 * Purpose: Display navigation menu at the top of the page
 *
 * What does this component do?
 * - Shows links to different pages (Home, Users, Posts, Profile)
 * - Displays current user's name
 * - Provides logout button
 * - Changes appearance based on whether user is logged in
 *
 * This is a presentational component that appears on every page
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * NAVBAR COMPONENT
 *
 * This is a functional component using React hooks
 */
const Navbar: React.FC = () => {
  /**
   * HOOKS
   *
   * What are hooks?
   * - Special functions that let you use React features
   * - Must be called at the top level of component
   * - Names start with "use"
   */

  // Get authentication state and functions from context
  // useAuth is our custom hook that accesses AuthContext
  const { user, logout } = useAuth();

  // Get navigation function from react-router
  // useNavigate lets us programmatically navigate to different pages
  const navigate = useNavigate();

  /**
   * LOGOUT HANDLER
   *
   * Purpose: Handle logout button click
   *
   * How it works:
   * 1. Call logout function from context
   * 2. This clears user data and token
   * 3. Navigate to login page
   *
   * Why a separate function?
   * - Can't call navigate directly in JSX
   * - Keeps JSX clean and readable
   */
  const handleLogout = () => {
    // Call logout function from auth context
    logout();

    // Redirect user to login page
    navigate('/login');
  };

  /**
   * RENDER NAVBAR
   *
   * JSX Structure:
   * - <nav>: Semantic HTML5 element for navigation
   * - Tailwind CSS classes for styling (bg-blue-600, text-white, etc.)
   * - Conditional rendering based on user state
   */
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      {/*
        Container for navbar content
        - max-w-7xl: Maximum width for large screens
        - mx-auto: Center the container
        - px-4: Horizontal padding
        - py-3: Vertical padding
      */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/*
          Flex container for navbar items
          - flex: Use flexbox layout
          - justify-between: Space items to edges
          - items-center: Vertically center items
        */}
        <div className="flex justify-between items-center">
          {/*
            LEFT SIDE: Brand name and navigation links
          */}
          <div className="flex items-center space-x-6">
            {/*
              Brand/Logo
              Link to home page
            */}
            <Link to="/" className="text-xl font-bold hover:text-blue-200">
              Strapi Posts App
            </Link>

            {/*
              Navigation Links
              Only shown if user is logged in
              Conditional rendering: {condition && <element>}
              If user exists (is logged in), show the nav links
            */}
            {user && (
              <div className="flex space-x-4">
                {/* Link to Posts page */}
                <Link
                  to="/posts"
                  className="hover:text-blue-200 transition"
                >
                  Posts
                </Link>

                {/* Link to Users page */}
                <Link
                  to="/users"
                  className="hover:text-blue-200 transition"
                >
                  Users
                </Link>

                {/* Link to Profile page */}
                <Link
                  to="/profile"
                  className="hover:text-blue-200 transition"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>

          {/*
            RIGHT SIDE: User info and logout button
          */}
          <div className="flex items-center space-x-4">
            {/*
              CONDITIONAL RENDERING
              Show different content based on user state
            */}
            {user ? (
              // User is logged in - show username and logout button
              <>
                {/* Display username */}
                <span className="text-sm">
                  Hello, <span className="font-semibold">{user.username}</span>
                </span>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              // User is not logged in - show login and register links
              <div className="flex space-x-3">
                {/* Link to Login page */}
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Login
                </Link>

                {/* Link to Register page */}
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export component so it can be used in other files
export default Navbar;
