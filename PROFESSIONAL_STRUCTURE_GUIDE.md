# Professional Application Structure Guide
## Complete Folder & File Organization Explained

This document explains the **professional architecture** of our application with proper folder organization.

---

## 📁 Table of Contents

1. [Overview](#overview)
2. [src/api](#srcapi---api-layer)
3. [src/components](#srccomponents---reusable-ui-components)
4. [src/config](#srcconfig---configuration-files)
5. [src/contexts](#srccontexts---global-state-management)
6. [src/data](#srcdata---static-data-constants)
7. [src/hooks](#srchooks---custom-react-hooks)
8. [src/interfaces](#srcinterfaces---typescript-interfaces)
9. [src/pages](#srcpages---page-components)
10. [src/router](#srcrouter---routing-configuration)
11. [src/types](#srctypes---type-definitions)
12. [src/validation](#srcvalidation---form-validation-schemas)
13. [Complete File Tree](#complete-file-tree)

---

## 📊 Overview

### Why This Structure?

This professional architecture provides:

✅ **Separation of Concerns** - Each folder has a specific purpose
✅ **Scalability** - Easy to add new features
✅ **Maintainability** - Easy to find and update code
✅ **Reusability** - Components and hooks can be shared
✅ **Type Safety** - Clear type definitions
✅ **Team Collaboration** - Everyone knows where things go

### Folder Count: 12 Main Folders

```
src/
├── api/          → Backend communication
├── components/   → Reusable UI pieces
├── config/       → App configuration
├── contexts/     → Global state
├── data/         → Static data & constants
├── hooks/        → Custom React hooks
├── interfaces/   → TypeScript interfaces
├── pages/        → Route pages
├── router/       → Routing setup
├── types/        → Type definitions
├── validation/   → Form validation
└── lib/          → Utility functions
```

---

## 1. src/api/ - API Layer

**Purpose:** Handle ALL communication with the backend (Strapi)

### 📁 Structure

```
src/api/
├── axios.ts                    # Legacy axios setup
├── config.ts                   # API configuration
├── interceptors.ts             # Request/Response interceptors
└── services/
    ├── authService.ts          # Authentication APIs
    ├── userService.ts          # User management APIs
    └── postService.ts          # Posts management APIs
```

### 📄 Files Explained

#### **axios.ts** (Legacy)
```typescript
// Old axios configuration
// Being replaced by config/axios.config.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
});

export default axiosInstance;
```

**Purpose:** Basic axios HTTP client setup
**Status:** Legacy, prefer config/axios.config.ts

#### **config.ts**
```typescript
// API configuration constants
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:1337',
  TIMEOUT: 10000,
  // Other API settings
};
```

**Purpose:** Centralize API configuration
**Why:** Easy to change settings in one place

#### **interceptors.ts**
```typescript
// Automatically add auth token to requests
// Handle 401 errors globally
```

**Purpose:**
- Add JWT token to every request automatically
- Handle authentication errors (401)
- Log requests/responses
- Transform data

**How it works:**
```
Request Flow:
User calls API → Interceptor adds token → Request sent to server

Response Flow:
Server responds → Interceptor checks for errors → Data returned
```

#### **services/authService.ts**
```typescript
// Authentication-related API calls
export const authService = {
  login(credentials) { /* ... */ },
  register(data) { /* ... */ },
  logout() { /* ... */ },
  getCurrentUser() { /* ... */ }
};
```

**Purpose:** All authentication API calls
**Functions:**
- `login()` - Authenticate user
- `register()` - Create new account
- `logout()` - End session
- `getCurrentUser()` - Get user info

#### **services/userService.ts**
```typescript
// User management API calls
export const userService = {
  getAllUsers() { /* ... */ },
  getUserById(id) { /* ... */ },
  updateUser(id, data) { /* ... */ },
  deleteUser(id) { /* ... */ }
};
```

**Purpose:** User CRUD operations
**When to use:** Managing user profiles, user lists

#### **services/postService.ts**
```typescript
// Posts management API calls
export const postService = {
  getAllPosts() { /* ... */ },
  getPostById(id) { /* ... */ },
  createPost(data) { /* ... */ },
  updatePost(id, data) { /* ... */ },
  deletePost(id) { /* ... */ }
};
```

**Purpose:** Posts CRUD operations
**Features:** Rich text handling, author population

---

## 2. src/components/ - Reusable UI Components

**Purpose:** Reusable UI pieces that can be used across multiple pages

### 📁 Structure

```
src/components/
├── ProtectedRoute.tsx          # Route protection (legacy)
├── Navbar.tsx                  # Navigation bar
├── TodoSkeleton.tsx            # Loading skeleton for todos
├── TodoList.tsx                # Todo list component
│
├── auth/
│   └── ProtectedRoute.tsx      # Route protection (new location)
│
├── errors/
│   └── ErrorHandler.tsx        # Global error handler
│
└── ui/
    ├── Button.tsx              # Reusable button
    ├── Input.tsx               # Reusable input field
    ├── Textarea.tsx            # Reusable textarea
    ├── Modal.tsx               # Reusable modal dialog
    ├── InputErrorMessage.tsx   # Input error display
    └── Paginator.tsx           # Pagination component
```

### 📄 Component Categories

#### **Authentication Components** (auth/)
```
ProtectedRoute.tsx
```
**Purpose:** Wrap routes that require authentication
**Usage:**
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```
**How it works:**
1. Check if user is authenticated
2. If yes → Render children (Dashboard)
3. If no → Redirect to /login

#### **Error Components** (errors/)
```
ErrorHandler.tsx
```
**Purpose:** Display errors gracefully
**Features:**
- Catch React errors
- Show user-friendly messages
- Log errors for debugging

#### **UI Components** (ui/)

**Button.tsx**
```tsx
// Reusable button with variants
<Button variant="primary" size="lg">
  Click Me
</Button>
```
**Props:**
- `variant` - primary, secondary, danger
- `size` - sm, md, lg
- `disabled` - true/false
- `loading` - Show spinner

**Input.tsx**
```tsx
// Reusable input field
<Input
  type="email"
  placeholder="Enter email"
  error="Invalid email"
/>
```
**Features:**
- Built-in error display
- Various types (text, email, password)
- Validation styling

**Modal.tsx**
```tsx
// Reusable modal dialog
<Modal isOpen={showModal} onClose={handleClose}>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</Modal>
```
**Features:**
- Backdrop overlay
- Close on click outside
- Keyboard support (ESC key)
- Animations

**Paginator.tsx**
```tsx
// Pagination component
<Paginator
  currentPage={1}
  totalPages={10}
  onPageChange={handlePageChange}
/>
```
**Purpose:** Navigate through paginated data

#### **Feature Components** (Root Level)

**Navbar.tsx**
```tsx
// Main navigation bar
// Displayed on all pages
```
**Features:**
- Logo
- Navigation links
- User menu
- Logout button

**TodoList.tsx**
```tsx
// Display list of todos
// Used in Todos page
```
**Props:**
- `todos` - Array of todo items
- `onToggle` - Handle completion toggle
- `onDelete` - Handle deletion

**TodoSkeleton.tsx**
```tsx
// Loading placeholder for todos
// Shows while data is loading
```
**Purpose:** Better UX during loading

---

## 3. src/config/ - Configuration Files

**Purpose:** Centralize all configuration settings

### 📁 Structure

```
src/config/
└── axios.config.ts             # Axios HTTP client configuration
```

### 📄 Files Explained

#### **axios.config.ts**
```typescript
import axios from "axios";

// Create configured axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",  // API URL
  timeout: 1000,                         // Request timeout
  headers: {
    'Content-Type': 'application/json'   // Default headers
  }
});

export default axiosInstance;
```

**Purpose:** Configure HTTP client for API calls

**Configuration Options:**
- `baseURL` - Base API URL
- `timeout` - Request timeout (ms)
- `headers` - Default headers
- `withCredentials` - Send cookies

**Why centralize config:**
- Change API URL in one place
- Consistent settings across app
- Easy environment switching
- Add interceptors once

**Environment-based config:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

const axiosInstance = axios.create({
  baseURL: API_URL,  // Different per environment
});
```

---

## 4. src/contexts/ - Global State Management

**Purpose:** Share state across multiple components without prop drilling

### 📁 Structure

```
src/contexts/
└── AuthContext.tsx             # Authentication global state
```

### 📄 Files Explained

#### **AuthContext.tsx**
```typescript
// Global authentication state
// Available to entire app
```

**What it provides:**
```typescript
interface AuthContextType {
  user: User | null;              // Current user
  token: string | null;           // JWT token
  login: (email, password) => Promise<void>;
  register: (username, email, password) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;       // Computed: !!token
}
```

**How to use:**
```tsx
// In any component
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <p>Welcome, {user.username}!</p>;
  }

  return <button onClick={() => login(email, password)}>Login</button>;
}
```

**Why use Context:**

❌ **Without Context (Prop Drilling):**
```tsx
<App user={user} login={login}>
  <Layout user={user} login={login}>
    <Header user={user} login={login}>
      <UserMenu user={user} login={login}>
        {/* Finally use it here */}
      </UserMenu>
    </Header>
  </Layout>
</App>
```

✅ **With Context (Direct Access):**
```tsx
<AuthProvider>  {/* Provide at top level */}
  <App>
    <Layout>
      <Header>
        <UserMenu />  {/* Use directly with useAuth() */}
      </Header>
    </Layout>
  </App>
</AuthProvider>
```

**Features:**
- Persists to localStorage
- Auto-restore on page reload
- Token management
- Logout clears everything

**Future contexts to add:**
- `ThemeContext` - Dark/light mode
- `NotificationContext` - Toast messages
- `LanguageContext` - i18n support

---

## 5. src/data/ - Static Data & Constants

**Purpose:** Store static data, form configurations, and constants

### 📁 Structure

```
src/data/
└── index.ts                    # Form configurations & constants
```

### 📄 Files Explained

#### **index.ts**
```typescript
// Form field configurations
export const REGISTER_FORM: IRegisterInput[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "text",
    validation: {
      required: true,
      minLength: 5,
    },
  },
  {
    name: "email",
    placeholder: "Email",
    type: "email",
    validation: {
      required: true,
      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    },
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export const LOGIN_FORM: ILoginInput[] = [ /* ... */ ];
```

**Purpose:** Define form structures in one place

**Why store form configs:**
- ✅ Reusable across components
- ✅ Easy to update field properties
- ✅ Consistent validation rules
- ✅ Generate forms dynamically
- ✅ Single source of truth

**Usage in component:**
```tsx
import { REGISTER_FORM } from '../data';

function RegisterPage() {
  return (
    <form>
      {REGISTER_FORM.map(field => (
        <Input
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          type={field.type}
          validation={field.validation}
        />
      ))}
    </form>
  );
}
```

**Benefits:**
1. **DRY Principle** - Don't repeat yourself
2. **Easy Updates** - Change once, updates everywhere
3. **Type Safety** - TypeScript checks structure
4. **Consistency** - Same format across forms

**Other data to store here:**
```typescript
// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth/local',
  POSTS: '/posts',
  USERS: '/users',
};

// App constants
export const APP_CONFIG = {
  APP_NAME: 'My App',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Menu items
export const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'Posts', path: '/posts', icon: '📝' },
  { label: 'Profile', path: '/profile', icon: '👤' },
];
```

---

## 6. src/hooks/ - Custom React Hooks

**Purpose:** Reusable logic encapsulated in custom hooks

### 📁 Structure

```
src/hooks/
└── useAuthenticatedQuery.ts    # Custom hook for authenticated API calls
```

### 📄 Files Explained

#### **useAuthenticatedQuery.ts**
```typescript
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";

// Custom hook for authenticated GET requests
const useAuthenticatedQuery = ({ queryKey, url, config }) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data;
    },
  });
};
```

**Purpose:** Simplify data fetching with React Query

**What it provides:**
- Automatic caching
- Background refetching
- Loading states
- Error handling
- Authentication included

**Usage:**
```tsx
function PostsList() {
  const { data, isLoading, error } = useAuthenticatedQuery({
    queryKey: ['posts'],
    url: '/posts',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Benefits:**
- No need to manage loading/error states manually
- Automatic caching (faster subsequent loads)
- Automatic refetching
- Optimistic updates

**Other useful hooks to add:**

**useLocalStorage**
```typescript
// Persist state to localStorage
const [name, setName] = useLocalStorage('name', 'Guest');
```

**useDebounce**
```typescript
// Delay updates (useful for search)
const debouncedSearch = useDebounce(searchTerm, 500);
```

**useToggle**
```typescript
// Boolean state with toggle function
const [isOpen, toggleOpen] = useToggle(false);
```

**useAuth (already in context)**
```typescript
// Convenient hook for auth context
const { user, login, logout } = useAuth();
```

---

## 7. src/interfaces/ - TypeScript Interfaces

**Purpose:** Define complex data structures and shapes

### 📁 Structure

```
src/interfaces/
└── index.ts                    # All interface definitions
```

### 📄 Files Explained

#### **index.ts**
```typescript
// Form input interfaces
export interface IRegisterInput {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

export interface ILoginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

// Error response interface
export interface IErrorResponse {
  error: {
    details?: {
      errors: {
        message: string;
      }[];
    };
    message?: string;
  };
}

// Todo interface
export interface ITodo {
  id: number;
  title: string;
  description: string;
}
```

**Purpose:** Type safety for complex structures

**Interface vs Type:**

```typescript
// Interface (can be extended)
interface IUser {
  id: number;
  name: string;
}

interface IAdmin extends IUser {
  role: 'admin';
}

// Type (more flexible)
type User = {
  id: number;
  name: string;
};

type Admin = User & {
  role: 'admin';
};
```

**When to use Interface:**
- ✅ Object shapes
- ✅ Class structures
- ✅ Need to extend/implement
- ✅ API response shapes

**When to use Type:**
- ✅ Unions (`type Status = 'active' | 'inactive'`)
- ✅ Intersections (`type Combined = A & B`)
- ✅ Primitives (`type ID = string | number`)
- ✅ Function types

**Best practices:**
- Prefix interfaces with `I` (IUser, IPost)
- Keep related interfaces together
- Export from index for easy imports
- Document complex interfaces

---

## 8. src/pages/ - Page Components

**Purpose:** Full-page components that correspond to routes

### 📁 Structure

```
src/pages/
├── index.tsx                   # Export all pages
├── Layout.tsx                  # Common page layout
├── Login.tsx                   # Login page
├── Register.tsx                # Registration page
├── Dashboard.tsx               # Dashboard home
├── Posts.tsx                   # Posts management
├── Posts.debug.tsx             # Posts debugging version
├── Todos.tsx                   # Todos management
├── Users.tsx                   # Users list
├── Profile.tsx                 # User profile
├── Home.tsx                    # Home/landing page
└── PageNotFound.tsx            # 404 error page
```

### 📄 Page Types

#### **Authentication Pages**
```
Login.tsx       → User login
Register.tsx    → New user registration
```

#### **Main Pages**
```
Dashboard.tsx   → Home after login
Posts.tsx       → Manage posts
Todos.tsx       → Manage todos
Users.tsx       → View users list
Profile.tsx     → User profile
```

#### **Special Pages**
```
Layout.tsx      → Common layout wrapper
Home.tsx        → Landing page
PageNotFound.tsx → 404 error
```

#### **index.tsx** (Page Exports)
```typescript
// Centralized page exports
export { default as LoginPage } from './Login';
export { default as RegisterPage } from './Register';
export { default as DashboardPage } from './Dashboard';
export { default as PostsPage } from './Posts';
export { default as TodosPage } from './Todos';
```

**Purpose:** Easy imports

```typescript
// Instead of:
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';

// Do this:
import { LoginPage, RegisterPage } from '../pages';
```

---

## 9. src/router/ - Routing Configuration

**Purpose:** Define all application routes in one place

### 📁 Structure

```
src/router/
└── index.tsx                   # React Router configuration
```

### 📄 Files Explained

#### **index.tsx**
```typescript
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Posts from '../pages/Posts';
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  // Protected routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/posts',
    element: (
      <ProtectedRoute>
        <Posts />
      </ProtectedRoute>
    ),
  },
]);
```

**Purpose:** Centralized routing configuration

**Route Types:**

**Public Routes** - No authentication required
```typescript
{
  path: '/login',
  element: <Login />
}
```

**Protected Routes** - Authentication required
```typescript
{
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

**Dynamic Routes** - URL parameters
```typescript
{
  path: '/posts/:id',
  element: <PostDetail />
}

// In component:
const { id } = useParams();
```

**Nested Routes** - Child routes
```typescript
{
  path: '/dashboard',
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <DashboardHome />
    },
    {
      path: 'settings',
      element: <Settings />
    }
  ]
}
```

**Benefits of centralized routing:**
- ✅ See all routes at a glance
- ✅ Easy to add/remove routes
- ✅ Consistent route protection
- ✅ Single source of truth
- ✅ Easy to generate sitemap

---

## 10. src/types/ - Type Definitions

**Purpose:** TypeScript type definitions for data models

### 📁 Structure

```
src/types/
├── api.types.ts                # API-related types
├── post.types.ts               # Post data types
└── user.types.ts               # User data types
```

### 📄 Files Explained

#### **api.types.ts**
```typescript
// Strapi API response format
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Error response
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
```

**Purpose:** Types for API responses

#### **post.types.ts**
```typescript
// Post data structure
export interface Post {
  id: number;
  documentId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

// Create post data
export interface CreatePostData {
  title: string;
  content: string;
}

// Update post data
export interface UpdatePostData {
  title?: string;
  content?: string;
}
```

**Purpose:** Types for post-related data

#### **user.types.ts**
```typescript
// User data structure
export interface User {
  id: number;
  username: string;
  email: string;
  blocked?: boolean;
  confirmed?: boolean;
}

// Auth response
export interface AuthResponse {
  jwt: string;
  user: User;
}

// Login credentials
export interface LoginCredentials {
  identifier: string;
  password: string;
}

// Registration data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
```

**Purpose:** Types for user and authentication data

**Type Organization Tips:**

```typescript
// ✅ Good: Separate by domain
post.types.ts
user.types.ts
todo.types.ts

// ❌ Bad: All in one file
types.ts (thousands of lines)

// ✅ Good: Related types together
export interface Post { /* ... */ }
export interface CreatePostData { /* ... */ }
export interface UpdatePostData { /* ... */ }

// ✅ Good: Use type utilities
export type PartialPost = Partial<Post>;
export type PostWithoutId = Omit<Post, 'id'>;
export type PostTitleOnly = Pick<Post, 'title'>;
```

---

## 11. src/validation/ - Form Validation Schemas

**Purpose:** Centralize form validation rules using Yup

### 📁 Structure

```
src/validation/
└── index.ts                    # All validation schemas
```

### 📄 Files Explained

#### **index.ts**
```typescript
import * as yup from "yup";

// Register form validation
export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(5, "Username should be at least 5 characters"),

    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a valid email address"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters"),
  })
  .required();

// Login form validation
export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .required("Email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a valid email address"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters"),
  })
  .required();
```

**Purpose:** Define validation rules once, use everywhere

**Why use Yup:**
- ✅ Declarative validation
- ✅ Readable error messages
- ✅ Async validation support
- ✅ Schema composition
- ✅ Works with React Hook Form
- ✅ TypeScript support

**Usage with React Hook Form:**
```tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../validation';

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema)  // Connect Yup schema
  });

  const onSubmit = (data) => {
    // Data is validated before this runs
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Register</button>
    </form>
  );
}
```

**Validation Features:**

```typescript
// String validation
yup.string()
  .required('Field required')
  .min(5, 'Min 5 chars')
  .max(20, 'Max 20 chars')
  .email('Invalid email')
  .url('Invalid URL')
  .matches(/regex/, 'Custom message')

// Number validation
yup.number()
  .required()
  .positive('Must be positive')
  .integer('Must be integer')
  .min(0)
  .max(100)

// Boolean validation
yup.boolean()
  .required()
  .oneOf([true], 'Must accept terms')

// Array validation
yup.array()
  .of(yup.string())
  .min(1, 'At least 1 item')
  .max(5, 'Max 5 items')

// Object validation
yup.object({
  name: yup.string().required(),
  age: yup.number().required()
})

// Conditional validation
yup.string().when('otherField', {
  is: 'value',
  then: yup.string().required(),
  otherwise: yup.string()
})

// Custom validation
yup.string().test(
  'unique-username',
  'Username already taken',
  async (value) => {
    const exists = await checkUsername(value);
    return !exists;
  }
)
```

**Additional schemas to add:**

```typescript
// Post creation/edit
export const postSchema = yup.object({
  title: yup.string()
    .required('Title is required')
    .min(3, 'Title too short')
    .max(100, 'Title too long'),

  content: yup.string()
    .required('Content is required')
    .min(10, 'Content too short')
});

// Todo creation/edit
export const todoSchema = yup.object({
  title: yup.string()
    .required('Title is required')
    .max(50, 'Title too long'),

  description: yup.string()
    .max(200, 'Description too long')
});

// Profile update
export const profileSchema = yup.object({
  username: yup.string()
    .required()
    .min(3)
    .max(20),

  bio: yup.string()
    .max(500, 'Bio too long'),

  website: yup.string()
    .url('Invalid URL')
});
```

---

## 12. Complete File Tree

### Full Application Structure

```
posts/
│
├── 📄 .env                                # Environment variables
├── 📄 .gitignore                          # Git ignore rules
├── 📄 package.json                        # Dependencies
├── 📄 tsconfig.json                       # TypeScript config
├── 📄 vite.config.ts                      # Vite config
├── 📄 tailwind.config.js                  # Tailwind config
├── 📄 index.html                          # HTML entry
│
└── 📂 src/                                # Source code
    │
    ├── 📂 api/                            # API Layer
    │   ├── axios.ts                       # Legacy axios setup
    │   ├── config.ts                      # API configuration
    │   ├── interceptors.ts                # Auth interceptors
    │   └── services/
    │       ├── authService.ts             # Auth API calls
    │       ├── userService.ts             # User API calls
    │       └── postService.ts             # Post API calls
    │
    ├── 📂 components/                     # Reusable Components
    │   ├── ProtectedRoute.tsx             # Route protection (legacy)
    │   ├── Navbar.tsx                     # Navigation bar
    │   ├── TodoSkeleton.tsx               # Loading skeleton
    │   ├── TodoList.tsx                   # Todo list
    │   ├── auth/
    │   │   └── ProtectedRoute.tsx         # Route protection (new)
    │   ├── errors/
    │   │   └── ErrorHandler.tsx           # Error boundary
    │   └── ui/
    │       ├── Button.tsx                 # Button component
    │       ├── Input.tsx                  # Input component
    │       ├── Textarea.tsx               # Textarea component
    │       ├── Modal.tsx                  # Modal component
    │       ├── InputErrorMessage.tsx      # Error message
    │       └── Paginator.tsx              # Pagination
    │
    ├── 📂 config/                         # Configuration
    │   └── axios.config.ts                # Axios configuration
    │
    ├── 📂 contexts/                       # Global State
    │   └── AuthContext.tsx                # Auth context
    │
    ├── 📂 data/                           # Static Data
    │   └── index.ts                       # Form configurations
    │
    ├── 📂 hooks/                          # Custom Hooks
    │   └── useAuthenticatedQuery.ts       # Custom query hook
    │
    ├── 📂 interfaces/                     # TypeScript Interfaces
    │   └── index.ts                       # All interfaces
    │
    ├── 📂 lib/                            # Utilities
    │   └── utils.ts                       # Helper functions
    │
    ├── 📂 pages/                          # Page Components
    │   ├── index.tsx                      # Page exports
    │   ├── Layout.tsx                     # Common layout
    │   ├── Login.tsx                      # Login page
    │   ├── Register.tsx                   # Register page
    │   ├── Dashboard.tsx                  # Dashboard
    │   ├── Posts.tsx                      # Posts page
    │   ├── Posts.debug.tsx                # Debug version
    │   ├── Todos.tsx                      # Todos page
    │   ├── Users.tsx                      # Users page
    │   ├── Profile.tsx                    # Profile page
    │   ├── Home.tsx                       # Home page
    │   └── PageNotFound.tsx               # 404 page
    │
    ├── 📂 router/                         # Routing
    │   └── index.tsx                      # Router config
    │
    ├── 📂 types/                          # Type Definitions
    │   ├── api.types.ts                   # API types
    │   ├── post.types.ts                  # Post types
    │   └── user.types.ts                  # User types
    │
    ├── 📂 validation/                     # Form Validation
    │   └── index.ts                       # Yup schemas
    │
    ├── 📂 zodSchema/                      # Zod Schemas (Alternative)
    │   └── register.ts                    # Zod register schema
    │
    ├── 📄 App.tsx                         # Main App component
    ├── 📄 main.tsx                        # Entry point
    ├── 📄 index.css                       # Global styles
    └── 📄 vite-env.d.ts                   # Vite types
```

---

## 📊 Summary Statistics

| Folder | Files | Purpose |
|--------|-------|---------|
| **api/** | 6 | Backend communication |
| **components/** | 13 | Reusable UI components |
| **config/** | 1 | Configuration files |
| **contexts/** | 1 | Global state management |
| **data/** | 1 | Static data & constants |
| **hooks/** | 1 | Custom React hooks |
| **interfaces/** | 1 | TypeScript interfaces |
| **lib/** | 1 | Utility functions |
| **pages/** | 11 | Route pages |
| **router/** | 1 | Routing configuration |
| **types/** | 3 | Type definitions |
| **validation/** | 1 | Form validation |
| **zodSchema/** | 1 | Alternative validation |
| **Total** | **42 files** | Complete application |

---

## 🎯 Folder Purpose Quick Reference

```
api/          → Talk to backend (Strapi)
components/   → Reusable UI pieces
config/       → App settings
contexts/     → Global state (Auth)
data/         → Static data & constants
hooks/        → Custom React hooks
interfaces/   → TypeScript interfaces
lib/          → Utility functions
pages/        → Full page components
router/       → Route definitions
types/        → Type definitions
validation/   → Form validation (Yup)
```

---

## 🚀 Best Practices Summary

### 1. File Organization
✅ Group by feature/domain
✅ Keep related files together
✅ Use clear, descriptive names
✅ Separate concerns (UI, logic, data)

### 2. Import Organization
```typescript
// 1. External libraries
import React, { useState } from 'react';
import axios from 'axios';

// 2. Internal absolute imports
import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

// 3. Internal relative imports
import { formatDate } from '../utils';
import { Post } from '../types';

// 4. CSS imports
import './styles.css';
```

### 3. Component Structure
```typescript
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title }) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Functions
  const handleClick = () => { /* ... */ };

  // 6. Render
  return <div>{title}</div>;
};
```

### 4. Naming Conventions
```
✅ Components: PascalCase (UserProfile.tsx)
✅ Hooks: camelCase with 'use' prefix (useAuth.ts)
✅ Utils: camelCase (formatDate.ts)
✅ Constants: UPPER_SNAKE_CASE (API_URL)
✅ Interfaces: PascalCase with 'I' prefix (IUser)
✅ Types: PascalCase (User, Post)
```

---

## 📚 Learning Path

### Beginner
1. **Start with pages/** - Understand page structure
2. **Move to components/ui/** - Learn reusable components
3. **Study contexts/** - See global state management
4. **Review types/** - Understand TypeScript

### Intermediate
5. **Explore api/services/** - Learn API integration
6. **Check hooks/** - Custom React hooks
7. **Review router/** - Routing configuration
8. **Study validation/** - Form validation

### Advanced
9. **Full data flow** - From UI → API → Backend
10. **Architecture patterns** - Separation of concerns
11. **Performance optimization** - Memoization, lazy loading
12. **Testing** - Unit and integration tests

---

**END OF PROFESSIONAL STRUCTURE GUIDE**

This structure provides a scalable, maintainable, and professional architecture for your application! 🚀
