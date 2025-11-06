// src/api/services/userService.ts
import api from '../interceptors';
import { User } from '../../types/user.types';

// ============================================
// USER SERVICE
// ============================================
// Purpose: Handle all user-related API operations
// Why: Centralize user management logic
// Separation: Keep API calls separate from components

export const userService = {
  
  // ==========================================
  // GET ALL USERS
  // ==========================================
  // Purpose: Fetch list of all users from Strapi
  // Endpoint: GET /api/users
  // Returns: Promise<User[]> (array of users)
  // Auth: Requires authentication (token added by interceptor)
  getAll: async (): Promise<User[]> => {
    try {
      // ----------------------------------------
      // STRAPI USERS ENDPOINT
      // ----------------------------------------
      // Strapi users-permissions plugin provides /users endpoint
      // This is different from other endpoints:
      // - NOT wrapped in data.attributes
      // - Returns array directly
      // - Comes from plugin, not custom collection
      
      // Make GET request to /users
      // <User[]> tells TypeScript response is array of User objects
      const response = await api.get<User[]>('/users');
      
      // Return response.data (array of users)
      // Example: [{id: 1, username: "john", ...}, {id: 2, ...}]
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Re-throw so calling code can handle
      throw error;
    }
  },

  // ==========================================
  // GET USER BY ID
  // ==========================================
  // Purpose: Fetch single user by their ID
  // Endpoint: GET /api/users/:id
  // Parameters: id (user ID to fetch)
  // Returns: Promise<User> (single user object)
  // Example: getById(1) fetches user with id=1
  getById: async (id: number): Promise<User> => {
    try {
      // Template string: `text ${variable}`
      // ${id} inserts id value into URL
      // Example: id=5 → GET /users/5
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  // ==========================================
  // UPDATE USER
  // ==========================================
  // Purpose: Update user information
  // Endpoint: PUT /api/users/:id
  // Parameters:
  //   - id: user ID to update
  //   - userData: fields to update
  // Returns: Promise<User> (updated user)
  // Note: In Strapi, users can typically only update themselves
  update: async (id: number, userData: Partial<User>): Promise<User> => {
    try {
      // api.put() makes HTTP PUT request
      // First argument: URL with user ID
      // Second argument: data to update
      // Partial<User> means all fields optional
      const response = await api.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  // ==========================================
  // NOTE: USER CREATION
  // ==========================================
  /*
  In Strapi, you typically DON'T create users directly via /users endpoint
  Instead, use authService.register() which:
  - Creates user account
  - Sends confirmation email (if enabled)
  - Returns JWT token
  - Handles all auth setup
  
  Direct user creation is usually restricted to admins only
  */
};

// ============================================
// HOW TO USE USER SERVICE
// ============================================
/*
In a component:

import { userService } from './api/services/userService';

// Get all users
const loadUsers = async () => {
  const users = await userService.getAll();
  console.log('Users:', users);
  setUsers(users);
};

// Get specific user
const loadUser = async (userId: number) => {
  const user = await userService.getById(userId);
  console.log('User:', user);
};

// Update user
const updateProfile = async () => {
  const updated = await userService.update(currentUser.id, {
    username: 'newusername'
  });
  console.log('Updated:', updated);
};
*/