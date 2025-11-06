/**
 * APP COMPONENT
 *
 * Purpose: Main application component that sets up routing
 *
 * What does this component do?
 * - Sets up React Router for navigation between pages
 * - Defines all routes (URLs) in the application
 * - Wraps protected routes with authentication check
 * - Includes Navbar on all pages
 * - Provides overall application structure
 *
 * This is the root component of the application
 * All other components are rendered through this component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

/**
 * IMPORT COMPONENTS
 *
 * Import all page components and shared components
 * These will be used in the routing configuration
 */
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * IMPORT PAGES
 *
 * Each page component represents a different view in the app
 */
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Users from './pages/Users';
import Profile from './pages/Profile';

/**
 * APP COMPONENT
 *
 * This is a functional component
 */
const App: React.FC = () => {
  return (
    /**
     * ROUTER
     *
     * What is BrowserRouter?
     * - Component from react-router-dom
     * - Enables client-side routing (navigation without page reload)
     * - Uses HTML5 History API for clean URLs (no # in URL)
     *
     * Why do we need it?
     * - Single Page Application (SPA) - only one HTML page
     * - JavaScript changes content based on URL
     * - Faster navigation (no full page reload)
     * - Better user experience
     */
    <Router>
      {/**
       * AUTH PROVIDER
       *
       * What does this do?
       * - Wraps entire app with authentication context
       * - Makes auth state available to all components
       * - Any component can use useAuth() hook to access user data
       *
       * Why wrap the entire app?
       * - Authentication is needed throughout the app
       * - Navbar needs user info
       * - Routes need to check if user is logged in
       * - Many components need current user data
       */}
      <AuthProvider>
        {/**
         * NAVBAR
         *
         * Why is it outside Routes?
         * - We want Navbar to appear on ALL pages
         * - If inside a Route, it would only show on that route
         * - Placing it here makes it persist across all pages
         */}
        <Navbar />

        {/**
         * ROUTES
         *
         * What is Routes?
         * - Container for all Route components
         * - React Router v6 component (replaces Switch from v5)
         * - Renders the first matching route
         *
         * How does routing work?
         * 1. User navigates to a URL (e.g., /posts)
         * 2. Routes looks through all Route components
         * 3. Finds the matching path
         * 4. Renders that Route's element
         */}
        <Routes>
          {/**
           * HOME ROUTE
           *
           * Path: / (root URL)
           * What it shows: Home page
           * When to access: Always accessible (public)
           *
           * element prop: What component to render
           */}
          <Route path="/" element={<Home />} />

          {/**
           * LOGIN ROUTE
           *
           * Path: /login
           * What it shows: Login form
           * When to access: Public (anyone can access)
           *
           * Purpose: Allow users to log in
           */}
          <Route path="/login" element={<Login />} />

          {/**
           * REGISTER ROUTE
           *
           * Path: /register
           * What it shows: Registration form
           * When to access: Public (anyone can access)
           *
           * Purpose: Allow new users to create accounts
           */}
          <Route path="/register" element={<Register />} />

          {/**
           * POSTS ROUTE (PROTECTED)
           *
           * Path: /posts
           * What it shows: Posts page with CRUD operations
           * When to access: Only when logged in
           *
           * Why ProtectedRoute?
           * - Wraps the page component
           * - Checks if user is logged in
           * - If yes: shows Posts page
           * - If no: redirects to /login
           *
           * This is how we protect routes from unauthorized access
           */}
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />

          {/**
           * USERS ROUTE (PROTECTED)
           *
           * Path: /users
           * What it shows: Users management page
           * When to access: Only when logged in
           *
           * Purpose: View and manage users
           */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          {/**
           * PROFILE ROUTE (PROTECTED)
           *
           * Path: /profile
           * What it shows: User profile page
           * When to access: Only when logged in
           *
           * Purpose: View and edit own profile
           */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/**
           * CATCH-ALL ROUTE (404)
           *
           * Path: * (wildcard - matches any path not matched above)
           * What it does: Redirects to home page
           *
           * Why do we need this?
           * - If user goes to /nonexistent-page
           * - No route above matches
           * - This route catches it
           * - Redirects to home instead of showing blank page
           *
           * Alternative: Could show a custom 404 page
           * <Route path="*" element={<NotFoundPage />} />
           */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// Export App component as default export
export default App;

/**
 * LEARNING NOTES
 *
 * React Router Concepts:
 *
 * 1. BrowserRouter (Router):
 *    - Provides routing context to entire app
 *    - Must wrap all routing-related components
 *    - Only one per application
 *
 * 2. Routes:
 *    - Container for all Route definitions
 *    - Renders the first matching route
 *    - Replaces Switch from React Router v5
 *
 * 3. Route:
 *    - Defines a URL path and what to show
 *    - path prop: URL pattern to match
 *    - element prop: Component to render
 *
 * 4. Navigate:
 *    - Component that redirects to another route
 *    - replace prop: Replace current history entry
 *    - Alternative to useNavigate hook
 *
 * Protected Routes Pattern:
 * - Wrap protected pages with ProtectedRoute component
 * - ProtectedRoute checks authentication
 * - Keeps route protection logic in one place
 * - Reusable across multiple routes
 *
 * Component Hierarchy:
 * Router
 *   └─ AuthProvider (provides auth context)
 *       ├─ Navbar (always visible)
 *       └─ Routes (page content)
 *           ├─ Route (/) → Home
 *           ├─ Route (/login) → Login
 *           ├─ Route (/register) → Register
 *           ├─ Route (/posts) → ProtectedRoute → Posts
 *           ├─ Route (/users) → ProtectedRoute → Users
 *           ├─ Route (/profile) → ProtectedRoute → Profile
 *           └─ Route (*) → Navigate to /
 *
 * URL Structure:
 * http://localhost:5173/          → Home
 * http://localhost:5173/login     → Login
 * http://localhost:5173/register  → Register
 * http://localhost:5173/posts     → Posts (protected)
 * http://localhost:5173/users     → Users (protected)
 * http://localhost:5173/profile   → Profile (protected)
 */
