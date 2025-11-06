/**
 * PROTECTED ROUTE COMPONENT
 *
 * Purpose: Protect certain pages from unauthorized access
 *
 * What does this component do?
 * - Checks if user is logged in before showing a page
 * - If logged in: shows the requested page
 * - If not logged in: redirects to login page
 *
 * Where to use:
 * - Wrap any route that requires authentication
 * - Example: Profile page, Create Post page, Users page
 *
 * Example usage:
 * ```
 * <Route path="/profile" element={
 *   <ProtectedRoute>
 *     <ProfilePage />
 *   </ProtectedRoute>
 * } />
 * ```
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * TypeScript INTERFACE for Props
 *
 * What are props?
 * - Data passed to a component from its parent
 * - Like function parameters but for components
 *
 * This component accepts:
 * - children: The component/page to protect
 */
interface ProtectedRouteProps {
  children: React.ReactNode;  // The component to render if authenticated
}

/**
 * PROTECTED ROUTE COMPONENT
 *
 * This is a wrapper component that checks authentication
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  /**
   * GET AUTHENTICATION STATE
   *
   * useAuth hook gives us:
   * - user: Current user data (null if not logged in)
   * - loading: Is auth state still being checked?
   */
  const { user, loading } = useAuth();

  /**
   * LOADING STATE
   *
   * Why do we need this?
   * - When app first loads, we check if user is logged in (from localStorage)
   * - This check takes a moment
   * - Without loading state, user would briefly see login page
   * - Then redirect to home if they're logged in
   * - This causes a flash/flicker
   *
   * Solution:
   * - Show loading message while checking
   * - Once checked, show appropriate page
   */
  if (loading) {
    return (
      // Loading screen
      // Centered div with loading message
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* Loading spinner animation */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

          {/* Loading text */}
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * AUTHENTICATION CHECK
   *
   * After loading is done, check if user is logged in
   *
   * If no user (not logged in):
   * - Redirect to login page using Navigate component
   * - replace prop removes current page from history
   *   (user can't press back button to return to protected page)
   *
   * If user exists (logged in):
   * - Render the protected page (children)
   */
  if (!user) {
    // User not logged in - redirect to login page
    return <Navigate to="/login" replace />;
  }

  /**
   * RENDER PROTECTED CONTENT
   *
   * User is authenticated - show the protected page
   * {children} renders whatever component was wrapped by ProtectedRoute
   */
  return <>{children}</>;
};

// Export component for use in routing
export default ProtectedRoute;

/**
 * HOW THIS COMPONENT WORKS - STEP BY STEP EXAMPLE
 *
 * Scenario: User tries to access Profile page
 *
 * 1. App starts
 *    - loading = true (checking auth state)
 *    - Shows "Loading..." message
 *
 * 2. Auth check completes (found user in localStorage)
 *    - loading = false
 *    - user = { id: 1, username: "john", ... }
 *
 * 3. ProtectedRoute checks:
 *    - loading? No (false)
 *    - user? Yes (exists)
 *    - Result: Show Profile page ✓
 *
 * Alternative Scenario: Not logged in
 *
 * 1. App starts
 *    - loading = true
 *    - Shows "Loading..."
 *
 * 2. Auth check completes (no user in localStorage)
 *    - loading = false
 *    - user = null
 *
 * 3. ProtectedRoute checks:
 *    - loading? No (false)
 *    - user? No (null)
 *    - Result: Redirect to /login ✗
 */
