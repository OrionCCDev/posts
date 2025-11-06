// src/types/api.types.ts

// ============================================
// API ERROR INTERFACE
// ============================================
// This defines what an error looks like when API calls fail
// Standardizes error handling across your entire app
export interface ApiError {
  // 💬 Human-readable error message
  // Example: "User not found" or "Invalid credentials"
  // This is what you show to the user
  message: string;
  
  // 🏷️ Error category/type
  // Example: "VALIDATION_ERROR", "AUTH_ERROR", "NETWORK_ERROR"
  // Helps you handle different error types differently
  type: string;
  
  // 🔢 HTTP status code (optional)
  // Example: 404, 401, 500, etc.
  // The ? means it might not exist (e.g., network errors have no status)
  status?: number;
  
  // 📋 Detailed validation errors (optional)
  // Record<string, string[]> means:
  // - Keys are field names (string)
  // - Values are arrays of error messages (string[])
  // Example: 
  // {
  //   "email": ["Email is required", "Email must be valid"],
  //   "password": ["Password must be at least 8 characters"]
  // }
  errors?: Record<string, string[]>;
}

// ============================================
// PAGINATED RESPONSE INTERFACE (GENERIC)
// ============================================
// This defines the structure for paginated API responses
// <T> is a GENERIC - it can be replaced with any type

// WHY USE GENERICS?
// Instead of creating separate interfaces for each type:
// - PaginatedUserResponse
// - PaginatedPostResponse
// - PaginatedProductResponse
// We create ONE interface that works for ALL types!

export interface PaginatedResponse<T> {
  // 📦 Array of items of type T
  // T[] means "array of whatever type T is"
  // 
  // EXAMPLES:
  // If T is User: data will be User[]
  // If T is Post: data will be Post[]
  // If T is Product: data will be Product[]
  //
  // The actual items returned from the API
  data: T[];
  
  // 🔢 Total number of items in the database
  // Example: 150 (even though we only return 10 per page)
  // Used to calculate total number of pages
  total: number;
  
  // 📄 Current page number
  // Example: 1, 2, 3, etc.
  // Used for pagination UI
  page: number;
  
  // 📊 Number of items per page
  // Example: 10, 25, 50
  // Used to determine how many items to show
  limit: number;
}

// ============================================
// HOW TO USE PaginatedResponse<T>
// ============================================
/*
EXAMPLE 1: Paginated Users
--------------------------
const response: PaginatedResponse<User> = {
  data: [
    { id: 1, name: "John", email: "john@example.com", username: "john" },
    { id: 2, name: "Jane", email: "jane@example.com", username: "jane" }
  ],
  total: 150,    // 150 total users in database
  page: 1,       // Currently on page 1
  limit: 10      // Showing 10 users per page
};

// Now TypeScript knows:
response.data[0].name  // ✅ Works - TypeScript knows this is a User
response.data[0].title // ❌ Error - User doesn't have 'title' property


EXAMPLE 2: Paginated Posts
--------------------------
interface Post {
  id: number;
  title: string;
  body: string;
}

const response: PaginatedResponse<Post> = {
  data: [
    { id: 1, title: "First Post", body: "Content..." },
    { id: 2, title: "Second Post", body: "More content..." }
  ],
  total: 500,    // 500 total posts
  page: 2,       // Currently on page 2
  limit: 20      // Showing 20 posts per page
};

// Now TypeScript knows:
response.data[0].title  // ✅ Works - TypeScript knows this is a Post
response.data[0].name   // ❌ Error - Post doesn't have 'name' property


EXAMPLE 3: Using in API Service
-------------------------------
async function getUsers(page: number): Promise<PaginatedResponse<User>> {
  const response = await api.get(`/users?page=${page}`);
  return response.data;
  // Return type is PaginatedResponse<User>
  // TypeScript ensures the response matches the interface
}

async function getPosts(page: number): Promise<PaginatedResponse<Post>> {
  const response = await api.get(`/posts?page=${page}`);
  return response.data;
  // Return type is PaginatedResponse<Post>
  // TypeScript ensures the response matches the interface
}


WHY THIS IS POWERFUL:
--------------------
1. REUSABILITY: One interface for all paginated responses
2. TYPE SAFETY: TypeScript knows what's in the data array
3. CONSISTENCY: All paginated responses have the same structure
4. MAINTAINABILITY: Change the interface once, affects all uses
*/

// ============================================
// GENERIC TYPE VISUALIZATION
// ============================================
/*
Think of <T> like a TEMPLATE:

PaginatedResponse<T> is like a FORM:
┌─────────────────────────────┐
│ PaginatedResponse           │
│ ┌─────────────────────────┐ │
│ │ data: [T, T, T, ...]    │ │  ← T is the placeholder
│ │ total: number           │ │
│ │ page: number            │ │
│ │ limit: number           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

When you use it, you FILL IN the blank:
PaginatedResponse<User>    → T becomes User
PaginatedResponse<Post>    → T becomes Post
PaginatedResponse<Product> → T becomes Product

It's like a customizable blueprint!
*/