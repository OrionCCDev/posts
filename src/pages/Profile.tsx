/**
 * PROFILE PAGE
 *
 * Purpose: Allow users to view and edit their profile information
 *
 * What does this page do?
 * - Display current user's information
 * - Allow editing username and email
 * - Allow changing password
 * - Update profile in Strapi
 * - Sync changes with auth context
 *
 * Features:
 * - View profile information
 * - Edit profile (CRUD Update operation)
 * - Change password
 * - Form validation
 * - Loading states
 * - Success/error messages
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../api/services/userService';

/**
 * PROFILE COMPONENT
 */
const Profile: React.FC = () => {
  /**
   * HOOKS
   */

  // Get current user and update function from auth context
  const { user, updateUser } = useAuth();

  /**
   * STATE FOR PROFILE FORM
   *
   * Initialize with current user data
   * Use || '' to provide empty string if user field is undefined
   */
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  /**
   * STATE FOR PASSWORD CHANGE FORM
   *
   * Separate state for password change
   * We don't show current password in the form
   */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  /**
   * UI STATE
   */
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  /**
   * UPDATE PROFILE HANDLER
   *
   * Purpose: Update username and/or email
   *
   * How it works:
   * 1. Validate input
   * 2. Call API to update user
   * 3. Update auth context with new data
   * 4. Show success message
   *
   * @param e - Form submit event
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    // Prevent page reload
    e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validate username
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // If user object doesn't exist, something is wrong
    if (!user) {
      setError('User not found. Please log in again.');
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call API to update user
      // Only send fields that might have changed
      const updatedUser = await userService.updateUser(user.id, {
        username,
        email,
      });

      // Update auth context with new user data
      // This updates localStorage and re-renders components
      updateUser(updatedUser);

      // Show success message
      setSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Failed to update profile');
    } finally {
      // Always set loading back to false
      setLoading(false);
    }
  };

  /**
   * CHANGE PASSWORD HANDLER
   *
   * Purpose: Change user's password
   *
   * How it works:
   * 1. Validate passwords (match, length)
   * 2. Call API to change password
   * 3. Clear password fields
   * 4. Show success message
   *
   * @param e - Form submit event
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    // Prevent page reload
    e.preventDefault();

    // Clear previous messages
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validate new password length
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate new password is different from current
    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    // Set loading state
    setPasswordLoading(true);

    try {
      // Call API to change password
      await userService.changePassword(
        currentPassword,
        newPassword,
        confirmNewPassword
      );

      // Clear password fields
      // Reset form after successful change
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Show success message
      setPasswordSuccess('Password changed successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      // Show error message
      // Common error: current password is incorrect
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      // Always set loading back to false
      setPasswordLoading(false);
    }
  };

  /**
   * RENDER PROFILE PAGE
   */
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      {/*
        TWO-COLUMN LAYOUT
        Left: Profile information form
        Right: Change password form
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/*
          LEFT COLUMN: UPDATE PROFILE FORM
        */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Profile Information
          </h2>

          {/* Success Alert */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile}>
            {/* User ID (Read-only display) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                User ID
              </label>
              <input
                type="text"
                value={user?.id || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is your unique user identifier (cannot be changed)
              </p>
            </div>

            {/* Username Input */}
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
                required
                minLength={3}
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
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
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/*
          RIGHT COLUMN: CHANGE PASSWORD FORM
        */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Change Password
          </h2>

          {/* Success Alert */}
          {passwordSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {passwordSuccess}
            </div>
          )}

          {/* Error Alert */}
          {passwordError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {passwordError}
            </div>
          )}

          {/* Password Change Form */}
          <form onSubmit={handleChangePassword}>
            {/* Current Password Input */}
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your current password to verify it's you
              </p>
            </div>

            {/* New Password Input */}
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
              <p className="text-sm text-gray-500 mt-1">
                At least 6 characters
              </p>
            </div>

            {/* Confirm New Password Input */}
            <div className="mb-6">
              <label
                htmlFor="confirmNewPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={passwordLoading}
              className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
                passwordLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Export component
export default Profile;

/**
 * LEARNING NOTES
 *
 * Form Separation:
 * - Profile info and password change are separate forms
 * - Each has its own submit handler
 * - Each has its own loading/error states
 * - Better UX: can update one without affecting the other
 *
 * Password Security Best Practices:
 * - Always require current password to change password
 * - Never pre-fill password fields
 * - Clear password fields after successful change
 * - Validate new password is different from old
 * - Use type="password" to hide input
 *
 * Context Synchronization:
 * - After updating profile, call updateUser()
 * - This keeps auth context in sync with server
 * - All components using useAuth will get updated data
 * - localStorage is also updated automatically
 *
 * Read-only Fields:
 * - User ID cannot be changed
 * - Show it for reference
 * - Use disabled attribute and gray background
 * - Helps users understand what can/cannot be changed
 */
