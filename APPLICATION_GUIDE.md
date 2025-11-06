# Complete Application Guide
## React + TypeScript + Strapi Full Stack Application

---

# Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Project Structure](#project-structure)
5. [Authentication System](#authentication-system)
6. [Posts Feature](#posts-feature)
7. [Todos Feature](#todos-feature)
8. [API Integration](#api-integration)
9. [Deployment](#deployment)

---

# 1. Project Overview

## What This Application Does

This is a full-stack web application that provides:
- **User Authentication** (Register, Login, Logout)
- **Posts Management** (Create, Read, Update, Delete posts)
- **Todos Management** (Create, Read, Update, Delete todos)
- **Protected Routes** (Only authenticated users can access features)

## Application Flow

```
User Registration → Login → Dashboard → Posts/Todos Management
```

---

# 2. Technology Stack

## Frontend Technologies

```
React 18         - UI Framework
TypeScript       - Type Safety
Tailwind CSS     - Styling
React Router     - Navigation
Axios            - HTTP Client
Vite             - Build Tool
```

## Backend Technologies

```
Strapi v4        - Headless CMS & API
PostgreSQL       - Database
JWT              - Authentication
```

---

# 3. Project Setup

## Step 1: Create React Application

```bash
# Create Vite + React + TypeScript project
npm create vite@latest posts -- --template react-ts

# Navigate to project
cd posts

# Install dependencies
npm install
```

## Step 2: Install Required Packages

```bash
# React Router for navigation
npm install react-router-dom

# Axios for API calls
npm install axios

# Tailwind CSS for styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Step 3: Configure Tailwind CSS

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 4: Environment Variables

**Create .env file:**
```env
VITE_API_URL=http://localhost:1337
```

---

# 4. Project Structure

## Directory Organization

```
posts/
├── src/
│   ├── api/
│   │   ├── axios.ts              # Axios configuration
│   │   ├── interceptors.ts       # Request/Response interceptors
│   │   └── services/
│   │       ├── authService.ts    # Authentication API calls
│   │       ├── postService.ts    # Posts API calls
│   │       └── todoService.ts    # Todos API calls
│   ├── components/
│   │   ├── ProtectedRoute.tsx    # Route protection
│   │   ├── PostList.tsx          # Posts display
│   │   └── TodoList.tsx          # Todos display
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication state
│   ├── pages/
│   │   ├── Login.tsx             # Login page
│   │   ├── Register.tsx          # Registration page
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── Posts.tsx             # Posts management
│   │   └── Todos.tsx             # Todos management
│   ├── types/
│   │   ├── auth.types.ts         # Auth type definitions
│   │   ├── post.types.ts         # Post type definitions
│   │   └── todo.types.ts         # Todo type definitions
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

---

# 5. Authentication System

## 5.1 Authentication Types

**src/types/auth.types.ts:**
```typescript
// User interface - represents a user in the system
export interface User {
  id: number;
  username: string;
  email: string;
  blocked?: boolean;
  confirmed?: boolean;
}

// Login credentials
export interface LoginCredentials {
  identifier: string;  // Email or username
  password: string;
}

// Registration data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Authentication response from Strapi
export interface AuthResponse {
  jwt: string;         // Authentication token
  user: User;          // User information
}
```

## 5.2 Authentication Context

**Purpose:** Manages authentication state globally across the app

**src/contexts/AuthContext.tsx:**
```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../api/services/authService';
import { User } from '../types/auth.types';

// Context shape
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load saved auth data on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login function
  const login = async (identifier: string, password: string) => {
    const response = await authService.login({ identifier, password });

    // Save to state
    setToken(response.jwt);
    setUser(response.user);

    // Save to localStorage
    localStorage.setItem('token', response.jwt);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    const response = await authService.register({ username, email, password });

    // Save to state
    setToken(response.jwt);
    setUser(response.user);

    // Save to localStorage
    localStorage.setItem('token', response.jwt);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 5.3 Authentication Service

**Purpose:** Handles API calls for authentication

**src/api/services/authService.ts:**
```typescript
import axiosInstance from '../axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth.types';

const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        '/api/auth/local',
        credentials
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        '/api/auth/local/register',
        data
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    try {
      const response = await axiosInstance.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch user data');
    }
  },
};

export default authService;
```

## 5.4 Login Page

**src/pages/Login.tsx:**
```typescript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email or Username</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

## 5.5 Protected Routes

**Purpose:** Prevent unauthorized access to protected pages

**src/components/ProtectedRoute.tsx:**
```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
```

---

# 6. Posts Feature

## 6.1 Post Types

**src/types/post.types.ts:**
```typescript
import { User } from './user.types';

// Post structure from Strapi
export interface Post {
  id: number;
  documentId?: string;
  title: string;
  content: string | any;  // Can be plain text or rich text
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author?: User;
}

// Data for creating a post
export interface CreatePostData {
  title: string;
  content: string;
}

// Data for updating a post
export interface UpdatePostData {
  title?: string;
  content?: string;
}
```

## 6.2 Post Service

**Purpose:** Handle all post-related API operations

**src/api/services/postService.ts:**
```typescript
import axiosInstance from '../axios';

interface Post {
  id: number;
  title: string;
  content: string | any;
  createdAt: string;
  updatedAt: string;
  author?: any;
}

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

// Convert plain text to Strapi rich text format
const convertToRichText = (text: string): any[] => {
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

  if (paragraphs.length === 0) {
    return [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '' }]
      }
    ];
  }

  return paragraphs.map(paragraph => ({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: paragraph
      }
    ]
  }));
};

const postService = {
  // Get all posts
  getAllPosts: async (): Promise<Post[]> => {
    try {
      const response = await axiosInstance.get<StrapiResponse<Post[]>>(
        '/api/posts?populate=author'
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch posts');
    }
  },

  // Get post by ID
  getPostById: async (id: number): Promise<Post> => {
    try {
      const response = await axiosInstance.get<StrapiResponse<Post>>(
        `/api/posts/${id}?populate=author`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch post');
    }
  },

  // Create new post
  createPost: async (data: { title: string; content: string }): Promise<Post> => {
    try {
      const richTextContent = convertToRichText(data.content);

      const postData = {
        title: data.title,
        content: richTextContent
      };

      const response = await axiosInstance.post<StrapiResponse<Post>>(
        '/api/posts?populate=author',
        { data: postData }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create post');
    }
  },

  // Update post
  updatePost: async (id: number, data: { title?: string; content?: string }): Promise<Post> => {
    try {
      const updateData: any = {
        ...(data.title && { title: data.title })
      };

      if (data.content !== undefined) {
        updateData.content = convertToRichText(data.content);
      }

      const response = await axiosInstance.put<StrapiResponse<Post>>(
        `/api/posts/${id}?populate=author`,
        { data: updateData }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update post');
    }
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/posts/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete post');
    }
  },
};

export default postService;
```

## 6.3 Posts Page

**Purpose:** Display, create, edit, and delete posts

**src/pages/Posts.tsx (Key Components):**

### Utility Function - Extract Text from Rich Text
```typescript
const extractTextFromRichText = (content: any): string => {
  if (typeof content === 'string') {
    return content;
  }

  if (!content) {
    return '';
  }

  if (Array.isArray(content)) {
    let text = '';
    content.forEach((block: any) => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach((child: any) => {
          if (child.text) {
            text += child.text + ' ';
          }
        });
      }
    });
    return text.trim();
  }

  return '';
};
```

### Fetch Posts
```typescript
const fetchPosts = async () => {
  try {
    const data = await postService.getAllPosts();

    // Process posts to extract plain text from rich text
    const processedPosts = data.map((post: Post) => ({
      ...post,
      content: extractTextFromRichText(post.content)
    }));

    setPosts(processedPosts);
    setError(null);
  } catch (err: any) {
    setError(err.message || 'Failed to load posts');
  } finally {
    setLoading(false);
  }
};
```

### Create/Update Post
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (title.trim().length === 0 || content.trim().length === 0) {
    setError('Title and content are required');
    return;
  }

  setFormLoading(true);

  try {
    if (isEditing && editingPostId !== null) {
      await postService.updatePost(editingPostId, {
        title: title.trim(),
        content: content.trim(),
      });
      setSuccess('Post updated successfully!');
    } else {
      await postService.createPost({
        title: title.trim(),
        content: content.trim(),
      });
      setSuccess('Post created successfully!');
    }

    await fetchPosts();
    handleCloseForm();
  } catch (err: any) {
    setError(err.message || 'Failed to save post');
  } finally {
    setFormLoading(false);
  }
};
```

### Delete Post
```typescript
const handleDelete = async (postId: number, postTitle: string) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${postTitle}"?`
  );

  if (!confirmed) return;

  try {
    await postService.deletePost(postId);
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    setSuccess('Post deleted successfully!');
  } catch (err: any) {
    setError(err.message || 'Failed to delete post');
  }
};
```

---

# 7. Todos Feature

## 7.1 Todo Types

**src/types/todo.types.ts:**
```typescript
export interface Todo {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

## 7.2 Todo Service

**src/api/services/todoService.ts:**
```typescript
import axiosInstance from '../axios';
import { Todo, CreateTodoData, UpdateTodoData } from '../../types/todo.types';

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

const todoService = {
  // Get all todos
  getAllTodos: async (): Promise<Todo[]> => {
    try {
      const response = await axiosInstance.get<StrapiResponse<Todo[]>>(
        '/api/todos'
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch todos');
    }
  },

  // Get todo by ID
  getTodoById: async (id: number): Promise<Todo> => {
    try {
      const response = await axiosInstance.get<StrapiResponse<Todo>>(
        `/api/todos/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch todo');
    }
  },

  // Create new todo
  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    try {
      const response = await axiosInstance.post<StrapiResponse<Todo>>(
        '/api/todos',
        { data }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create todo');
    }
  },

  // Update todo
  updateTodo: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    try {
      const response = await axiosInstance.put<StrapiResponse<Todo>>(
        `/api/todos/${id}`,
        { data }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update todo');
    }
  },

  // Delete todo
  deleteTodo: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/todos/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete todo');
    }
  },

  // Toggle todo completion
  toggleTodo: async (id: number, completed: boolean): Promise<Todo> => {
    try {
      const response = await axiosInstance.put<StrapiResponse<Todo>>(
        `/api/todos/${id}`,
        { data: { completed } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to toggle todo');
    }
  },
};

export default todoService;
```

## 7.3 Todos Page (Key Functions)

### Fetch Todos
```typescript
const fetchTodos = async () => {
  try {
    const data = await todoService.getAllTodos();
    setTodos(data);
    setError(null);
  } catch (err: any) {
    setError(err.message || 'Failed to load todos');
  } finally {
    setLoading(false);
  }
};
```

### Toggle Todo Completion
```typescript
const handleToggle = async (id: number, completed: boolean) => {
  try {
    await todoService.toggleTodo(id, !completed);
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );
  } catch (err: any) {
    setError(err.message || 'Failed to toggle todo');
  }
};
```

---

# 8. API Integration

## 8.1 Axios Configuration

**src/api/axios.ts:**
```typescript
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

## 8.2 Request/Response Interceptors

**src/api/interceptors.ts:**
```typescript
import axiosInstance from './axios';

// Request interceptor - Add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

# 9. Deployment

## 9.1 Build for Production

```bash
# Build the application
npm run build

# This creates a 'dist' folder with optimized production files
```

## 9.2 Deployment Options

### Option 1: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Traditional Hosting
```bash
# Upload the contents of the 'dist' folder to your web server
# Configure your web server to serve the index.html for all routes
```

## 9.3 Environment Variables in Production

Make sure to set these in your hosting platform:
```
VITE_API_URL=https://your-strapi-backend.com
```

---

# Key Concepts Summary

## 1. Component Communication
- Use React Context for global state (Auth)
- Props for parent-child communication
- Custom hooks for shared logic

## 2. State Management
- useState for local component state
- useEffect for side effects (API calls, subscriptions)
- Context API for global state

## 3. API Integration
- Centralized axios instance
- Service layer for API calls
- Interceptors for auth and error handling

## 4. Type Safety
- TypeScript interfaces for all data structures
- Proper typing for functions and components
- Type checking prevents runtime errors

## 5. User Experience
- Loading states for async operations
- Error handling with user-friendly messages
- Success notifications for user actions
- Form validation

## 6. Security
- JWT token authentication
- Protected routes
- Token stored in localStorage
- Automatic token injection in requests

---

# Common Issues & Solutions

## Issue 1: CORS Errors
**Solution:** Configure Strapi's CORS settings in `config/middlewares.js`

## Issue 2: Authentication Token Not Sent
**Solution:** Check axios interceptors are properly configured

## Issue 3: Rich Text Content Display
**Solution:** Use the extractTextFromRichText utility function

## Issue 4: 404 on Page Refresh
**Solution:** Configure your web server for SPA routing

---

# Next Steps & Enhancements

## Possible Improvements

1. **Add Search Functionality**
   - Search posts by title/content
   - Filter todos by completion status

2. **Pagination**
   - Implement pagination for posts and todos
   - Load more functionality

3. **File Uploads**
   - Allow image uploads in posts
   - Profile picture functionality

4. **Real-time Updates**
   - WebSocket integration
   - Live notifications

5. **Enhanced UI**
   - Dark mode toggle
   - Responsive mobile design improvements
   - Loading skeletons

6. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Cypress

---

# Conclusion

This application demonstrates a complete full-stack workflow:

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Strapi CMS with PostgreSQL
- **Features:** Authentication, CRUD operations, Protected routes
- **Best Practices:** Type safety, service layer, error handling

The architecture is scalable and maintainable, following modern web development standards.

---

# Resources

## Documentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Strapi: https://strapi.io/documentation
- Tailwind CSS: https://tailwindcss.com

## Tools
- Vite: https://vitejs.dev
- Axios: https://axios-http.com
- React Router: https://reactrouter.com

---

**End of Guide**
