/**
 * USER SERVICE
 *
 * Purpose: Handle all user-related CRUD operations
 *
 * What is CRUD?
 * - Create: Add new users
 * - Read: Get user information
 * - Update: Modify user data
 * - Delete: Remove users
 *
 * This service manages user data through the Strapi API
 */

import axiosInstance from '../axios';

/**
 * TypeScript INTERFACE for User
 *
 * Defines what properties a user has
 */
interface User {
  id: number;          // Unique identifier
  username: string;    // Username
  email: string;       // Email address
  blocked?: boolean;   // Is user blocked?
  confirmed?: boolean; // Is email confirmed?
}

/**
 * Interface for updating user data
 * These are the fields that can be updated
 */
interface UpdateUserData {
  username?: string;  // Optional: new username
  email?: string;     // Optional: new email
  password?: string;  // Optional: new password
}

/**
 * USER SERVICE OBJECT
 *
 * Contains all functions for user management
 */
const userService = {
  /**
   * GET ALL USERS FUNCTION
   *
   * Purpose: Fetch a list of all users from Strapi
   *
   * How it works:
   * 1. Make GET request to /api/users endpoint
   * 2. Strapi returns an array of all users
   * 3. Return the array to calling code
   *
   * When to use:
   * - Displaying a list of users in admin panel
   * - User management page
   *
   * @returns Promise with array of users
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      // Make GET request to fetch all users
      // Authentication token is automatically added by axios interceptor
      const response = await axiosInstance.get<User[]>('/api/users');

      // Return the array of users
      return response.data;
    } catch (error: any) {
      // If request fails, throw error with message
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch users';

      throw new Error(errorMessage);
    }
  },

  /**
   * GET USER BY ID FUNCTION
   *
   * Purpose: Fetch information about a specific user
   *
   * How it works:
   * 1. Make GET request to /api/users/:id
   * 2. Strapi returns data for that specific user
   * 3. Return the user data
   *
   * When to use:
   * - Viewing a user's profile
   * - Getting details before editing
   *
   * @param id - The ID of the user to fetch
   * @returns Promise with user data
   */
  getUserById: async (id: number): Promise<User> => {
    try {
      // Make GET request with user ID in URL
      // Example: /api/users/5 will fetch user with ID 5
      const response = await axiosInstance.get<User>(`/api/users/${id}`);

      // Return the user data
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch user';

      throw new Error(errorMessage);
    }
  },

  /**
   * UPDATE USER FUNCTION
   *
   * Purpose: Modify user information
   *
   * How it works:
   * 1. Make PUT request to /api/users/:id with new data
   * 2. Strapi updates the user in database
   * 3. Strapi returns the updated user data
   * 4. Return updated data to calling code
   *
   * When to use:
   * - User editing their profile
   * - Admin modifying user data
   * - Changing password
   *
   * Important Security Note:
   * - In Strapi, users can only update their own profile by default
   * - Only admins can update other users
   *
   * @param id - The ID of the user to update
   * @param data - Object with fields to update
   * @returns Promise with updated user data
   */
  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    try {
      // Make PUT request with user ID in URL and data in body
      // PUT is used for updating existing resources
      const response = await axiosInstance.put<User>(
        `/api/users/${id}`,
        data
      );

      // If updating current user, update localStorage too
      // This keeps the stored user data in sync
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Check if we're updating the currently logged-in user
        if (user.id === id) {
          // Update stored user data with new data
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      }

      // Return updated user data
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to update user';

      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE USER FUNCTION
   *
   * Purpose: Remove a user from the system
   *
   * How it works:
   * 1. Make DELETE request to /api/users/:id
   * 2. Strapi removes user from database
   * 3. Return success status
   *
   * When to use:
   * - Admin deleting user accounts
   * - User deleting their own account
   *
   * Important:
   * - This permanently deletes the user
   * - Cannot be undone
   * - In production, consider "soft delete" (marking as deleted instead)
   *
   * @param id - The ID of the user to delete
   * @returns Promise that resolves when deletion is complete
   */
  deleteUser: async (id: number): Promise<void> => {
    try {
      // Make DELETE request with user ID in URL
      // DELETE is used for removing resources
      await axiosInstance.delete(`/api/users/${id}`);

      // No return value needed for delete
      // Success means user was deleted
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to delete user';

      throw new Error(errorMessage);
    }
  },

  /**
   * UPDATE USER PASSWORD FUNCTION
   *
   * Purpose: Change a user's password
   *
   * How it works:
   * 1. Make POST request to custom endpoint with passwords
   * 2. Backend verifies current password
   * 3. If correct, updates to new password
   * 4. Returns success or error
   *
   * Security:
   * - Requires current password for verification
   * - Prevents unauthorized password changes
   *
   * Note: This uses Strapi's built-in change-password endpoint
   *
   * @param currentPassword - User's current password
   * @param newPassword - New password to set
   * @param confirmPassword - Confirmation of new password
   * @returns Promise that resolves when password is changed
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    try {
      // Make POST request to change password endpoint
      await axiosInstance.post('/api/auth/change-password', {
        currentPassword,   // Current password for verification
        password: newPassword,         // New password
        passwordConfirmation: confirmPassword, // Must match new password
      });

      // Success - password has been changed
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to change password';

      throw new Error(errorMessage);
    }
  },
};

// Export the service for use in other files
export default userService;
