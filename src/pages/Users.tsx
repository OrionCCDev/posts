/**
 * USERS PAGE
 *
 * Purpose: Display and manage all users in the system
 *
 * What does this page do?
 * - Fetch and display list of all users
 * - Show user information in a table
 * - Allow deleting users (with confirmation)
 * - Handle loading states
 * - Show error messages
 *
 * Features:
 * - View all users
 * - Delete user (CRUD Delete operation)
 * - Real-time updates after operations
 *
 * Note: In a real application, you might want to add:
 * - Edit user functionality
 * - Pagination for large user lists
 * - Search/filter capabilities
 * - Admin-only access control
 */

import React, { useState, useEffect } from 'react';
import userService from '../api/services/userService';
import { useAuth } from '../contexts/AuthContext';

/**
 * TypeScript INTERFACE
 *
 * Define User structure
 */
interface User {
  id: number;
  username: string;
  email: string;
  blocked?: boolean;
  confirmed?: boolean;
}

/**
 * USERS COMPONENT
 */
const Users: React.FC = () => {
  /**
   * HOOKS
   */

  // Get current user from auth context
  // We'll use this to prevent users from deleting themselves
  const { user: currentUser } = useAuth();

  /**
   * STATE MANAGEMENT
   */

  // Array of all users
  const [users, setUsers] = useState<User[]>([]);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Error message state
  const [error, setError] = useState<string | null>(null);

  // Success message state (shown after operations)
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * FETCH USERS EFFECT
   *
   * What is useEffect?
   * - React hook for side effects (API calls, subscriptions, etc.)
   * - Runs after component renders
   * - Can run once or when dependencies change
   *
   * Purpose: Fetch users when component first loads
   *
   * How it works:
   * 1. Component mounts (page loads)
   * 2. useEffect runs
   * 3. Fetch users from API
   * 4. Update state with user data
   * 5. Component re-renders with data
   */
  useEffect(() => {
    // Function to fetch users
    const fetchUsers = async () => {
      try {
        // Call user service to get all users
        const data = await userService.getAllUsers();

        // Update state with fetched users
        setUsers(data);

        // Clear any previous error
        setError(null);
      } catch (err: any) {
        // If fetch fails, set error message
        setError(err.message || 'Failed to load users');
      } finally {
        // Always set loading to false when done
        // Whether success or error
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchUsers();
  }, []); // Empty array = run once on mount

  /**
   * DELETE USER HANDLER
   *
   * Purpose: Delete a user from the system
   *
   * How it works:
   * 1. Show confirmation dialog (prevent accidental deletion)
   * 2. If confirmed, call API to delete user
   * 3. If successful, remove user from local state (update UI)
   * 4. Show success message
   * 5. If failed, show error message
   *
   * @param userId - ID of user to delete
   * @param username - Username (for confirmation message)
   */
  const handleDeleteUser = async (userId: number, username: string) => {
    // Show confirmation dialog
    // window.confirm returns true if user clicks OK, false if Cancel
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${username}"? This action cannot be undone.`
    );

    // If user clicked Cancel, stop here
    if (!confirmed) {
      return;
    }

    // Prevent users from deleting themselves
    // This would log them out immediately
    if (currentUser && currentUser.id === userId) {
      setError('You cannot delete your own account from this page');
      return;
    }

    try {
      // Call API to delete user
      await userService.deleteUser(userId);

      // Remove user from local state
      // Filter creates new array without the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      // Show success message
      setSuccess(`User "${username}" has been deleted successfully`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

      // Clear any previous error
      setError(null);
    } catch (err: any) {
      // If deletion fails, show error
      setError(err.message || 'Failed to delete user');
    }
  };

  /**
   * LOADING STATE
   *
   * While fetching users, show loading spinner
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER USERS PAGE
   */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage all users in the system
        </p>
      </div>

      {/*
        ERROR ALERT
        Show if there's an error
      */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/*
        SUCCESS ALERT
        Show after successful operations
      */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/*
        USERS TABLE
        Display users in a responsive table
      */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/*
          Check if there are any users
          If no users, show message
        */}
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          // If users exist, show table
          <table className="min-w-full divide-y divide-gray-200">
            {/*
              TABLE HEADER
              Defines column names
            */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/*
              TABLE BODY
              Map through users array and create a row for each user
            */}
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                /*
                  TABLE ROW for each user
                  key prop is required for React lists
                  Helps React identify which items changed
                */
                <tr key={user.id}>
                  {/* ID Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>

                  {/* Username Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                      {/* Show "You" badge if this is the current user */}
                      {currentUser && currentUser.id === user.id && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Email Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/*
                      Show status badges
                      Green for confirmed, red for blocked
                    */}
                    <div className="flex flex-col space-y-1">
                      {user.confirmed ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Unconfirmed
                        </span>
                      )}
                      {user.blocked && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Blocked
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/*
                      DELETE BUTTON
                      Disabled if this is the current user
                      (prevent self-deletion)
                    */}
                    <button
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      disabled={currentUser?.id === user.id}
                      className={`text-red-600 hover:text-red-900 ${
                        currentUser?.id === user.id
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      title={
                        currentUser?.id === user.id
                          ? 'Cannot delete yourself'
                          : 'Delete user'
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/*
        USER COUNT
        Show total number of users
      */}
      <div className="mt-4 text-sm text-gray-600">
        Total users: {users.length}
      </div>
    </div>
  );
};

// Export component
export default Users;

/**
 * LEARNING NOTES
 *
 * Array Methods:
 * - map(): Transform each item in array (create new array)
 * - filter(): Remove items that don't meet condition (create new array)
 *
 * Immutability:
 * - Don't modify state directly: users.push() ❌
 * - Create new array: setUsers([...users, newUser]) ✓
 * - React needs new reference to detect changes
 *
 * Confirmation Dialogs:
 * - Always confirm destructive actions (delete, etc.)
 * - Prevents accidental data loss
 * - window.confirm is simple but not pretty
 * - In production, use custom modal component
 *
 * Real-time Updates:
 * - After delete, we update local state
 * - This immediately updates UI without refetching
 * - Faster user experience
 * - Make sure local state matches server state
 */
