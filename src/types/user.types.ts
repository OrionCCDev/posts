// src/types/user.types.ts

// ============================================
// STRAPI USER TYPE
// ============================================
// Purpose: Define what a Strapi user looks like
// Why: TypeScript needs to know the structure
// Strapi default User model from users-permissions plugin
export interface User {
  id: number;              // Unique identifier
  username: string;        // Login username
  email: string;          // User email
  provider?: string;      // Auth provider (local, google, etc.)
  confirmed?: boolean;    // Email confirmed
  blocked?: boolean;      // Account blocked
  createdAt?: string;     // When user was created
  updatedAt?: string;     // When user was updated
}

// ============================================
// LOGIN CREDENTIALS TYPE
// ============================================
// Purpose: Define login form data structure
// Why: Type-safe form handling
// Strapi uses 'identifier' field (can be email or username)
export interface LoginCredentials {
  identifier: string;     // Email or username
  password: string;       // User password
}

// ============================================
// STRAPI AUTH RESPONSE TYPE
// ============================================
// Purpose: Define what Strapi returns after login
// Why: We need jwt token and user data
// Strapi auth endpoint returns this structure
export interface AuthResponse {
  jwt: string;           // JSON Web Token for authentication
  user: User;           // Logged-in user data
}

// ============================================
// STRAPI WRAPPER TYPES
// ============================================
// Purpose: Strapi wraps all API responses in specific structure
// Why: We need to unwrap data.attributes to get actual data

// For single item responses (GET /api/posts/1)
export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta?: any;
}

// For collection responses (GET /api/posts)
export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}