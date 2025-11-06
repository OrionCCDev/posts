/**
 * HOME PAGE
 *
 * Purpose: Welcome page and landing page for the application
 *
 * What does this page do?
 * - Welcome users to the application
 * - Provide navigation to main features
 * - Show different content for logged-in vs logged-out users
 * - Explain what the app does
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * HOME COMPONENT
 */
const Home: React.FC = () => {
  /**
   * HOOKS
   */

  // Get current user from auth context
  // We'll show different content based on login state
  const { user } = useAuth();

  /**
   * RENDER HOME PAGE
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Welcome Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
            Welcome to Strapi Posts App
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 text-center">
            A simple learning project demonstrating React + TypeScript with Strapi backend
          </p>

          {/*
            CONDITIONAL CONTENT
            Show different content based on whether user is logged in
          */}
          {user ? (
            // LOGGED IN USER - Show personalized greeting and links
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <p className="text-lg text-gray-700">
                  Hello, <span className="font-bold">{user.username}</span>! 👋
                </p>
                <p className="text-gray-600 mt-2">
                  You're logged in and ready to explore.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Posts Card */}
                <Link
                  to="/posts"
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">📝</div>
                  <h3 className="text-xl font-bold mb-2">Posts</h3>
                  <p className="text-blue-100">
                    Create, read, update, and delete posts
                  </p>
                </Link>

                {/* Users Card */}
                <Link
                  to="/users"
                  className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="text-xl font-bold mb-2">Users</h3>
                  <p className="text-green-100">
                    View and manage users in the system
                  </p>
                </Link>

                {/* Profile Card */}
                <Link
                  to="/profile"
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">⚙️</div>
                  <h3 className="text-xl font-bold mb-2">Profile</h3>
                  <p className="text-purple-100">
                    Update your profile and change password
                  </p>
                </Link>
              </div>
            </div>
          ) : (
            // LOGGED OUT USER - Show call-to-action to login/register
            <div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <p className="text-lg text-gray-700">
                  You're not logged in yet.
                </p>
                <p className="text-gray-600 mt-2">
                  Please login or register to access all features.
                </p>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-center transition shadow hover:shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-center transition shadow hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* Features Section - Always visible */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              What You Can Learn
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              {/* Feature 1 */}
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    React + TypeScript
                  </h3>
                  <p className="text-sm">
                    Modern React with TypeScript for type safety and better
                    developer experience
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Strapi Backend
                  </h3>
                  <p className="text-sm">
                    Connect to Strapi headless CMS for API and database
                    management
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Authentication
                  </h3>
                  <p className="text-sm">
                    JWT-based authentication with login, register, and protected routes
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    CRUD Operations
                  </h3>
                  <p className="text-sm">
                    Complete Create, Read, Update, Delete operations for users and posts
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    React Router
                  </h3>
                  <p className="text-sm">
                    Client-side routing with protected routes and navigation
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Context API
                  </h3>
                  <p className="text-sm">
                    State management using React Context for authentication
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Technology Stack
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                React
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                TypeScript
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                Vite
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Strapi
              </span>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                Tailwind CSS
              </span>
              <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                Axios
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export component
export default Home;

/**
 * LEARNING NOTES
 *
 * Conditional Rendering:
 * - Use ternary operator: condition ? ifTrue : ifFalse
 * - Or logical AND: condition && <element>
 * - Show different UI based on state
 * - Common pattern for logged-in vs logged-out views
 *
 * Gradient Backgrounds:
 * - Tailwind classes: bg-gradient-to-br from-color to-color
 * - Creates professional, modern look
 * - Can be applied to backgrounds, buttons, etc.
 *
 * Card Hover Effects:
 * - transform hover:-translate-y-1 (move up on hover)
 * - hover:shadow-lg (larger shadow on hover)
 * - transition (smooth animation)
 * - Makes UI feel interactive and responsive
 *
 * Responsive Grid:
 * - grid-cols-1 (1 column on mobile)
 * - md:grid-cols-2 (2 columns on medium+ screens)
 * - md:grid-cols-3 (3 columns on medium+ screens)
 * - Adapts to different screen sizes
 */
