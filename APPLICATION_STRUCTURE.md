# Application Structure - Files We Created/Modified

This document shows ONLY the files we created or modified for the application, excluding default setup files.

---

## 📁 Complete Directory Structure

```
posts/
│
├── 📄 .env                                    # Environment variables (API URL)
├── 📄 .gitignore                              # Git ignore rules
│
├── 📂 src/                                    # Source code directory
│   │
│   ├── 📂 api/                                # API layer
│   │   ├── 📄 axios.ts                        # Axios configuration
│   │   ├── 📄 interceptors.ts                 # Request/Response interceptors
│   │   │
│   │   └── 📂 services/                       # API services
│   │       ├── 📄 authService.ts              # Authentication API calls
│   │       ├── 📄 postService.ts              # Posts API calls
│   │       └── 📄 todoService.ts              # Todos API calls
│   │
│   ├── 📂 types/                              # TypeScript type definitions
│   │   ├── 📄 auth.types.ts                   # Auth types (User, Login, Register)
│   │   ├── 📄 post.types.ts                   # Post types
│   │   └── 📄 todo.types.ts                   # Todo types
│   │
│   ├── 📂 contexts/                           # React Context (Global State)
│   │   └── 📄 AuthContext.tsx                 # Authentication context & provider
│   │
│   ├── 📂 components/                         # Reusable components
│   │   └── 📄 ProtectedRoute.tsx              # Route protection component
│   │
│   ├── 📂 pages/                              # Page components (Routes)
│   │   ├── 📄 Login.tsx                       # Login page
│   │   ├── 📄 Register.tsx                    # Registration page
│   │   ├── 📄 Dashboard.tsx                   # Dashboard (home) page
│   │   ├── 📄 Posts.tsx                       # Posts management page
│   │   └── 📄 Todos.tsx                       # Todos management page
│   │
│   ├── 📄 App.tsx                             # Main app component (Routing setup)
│   ├── 📄 main.tsx                            # Entry point (Modified)
│   └── 📄 index.css                           # Global styles (Modified)
│
├── 📄 tailwind.config.js                      # Tailwind CSS configuration
├── 📄 postcss.config.js                       # PostCSS configuration
├── 📄 tsconfig.json                           # TypeScript configuration
├── 📄 vite.config.ts                          # Vite build tool configuration
├── 📄 package.json                            # Project dependencies
└── 📄 index.html                              # HTML entry point (Modified)
```

---

## 📊 Files Breakdown by Category

### 1️⃣ Configuration Files (Root Level)
```
📄 .env                     # API URL configuration
📄 .gitignore              # Git ignore patterns
📄 tailwind.config.js      # Tailwind CSS setup
📄 postcss.config.js       # CSS processing
📄 tsconfig.json           # TypeScript compiler options
📄 vite.config.ts          # Build tool settings
📄 package.json            # Dependencies and scripts
```

### 2️⃣ API Layer (src/api/)
```
📁 api/
  ├── axios.ts             # Base axios instance with API URL
  ├── interceptors.ts      # Add auth token & handle 401 errors
  └── services/
      ├── authService.ts   # login(), register(), getCurrentUser()
      ├── postService.ts   # CRUD operations for posts
      └── todoService.ts   # CRUD operations for todos
```

**What each service does:**
- **authService**: Login, Register, Get current user
- **postService**: Create, Read, Update, Delete posts
- **todoService**: Create, Read, Update, Delete, Toggle todos

### 3️⃣ Type Definitions (src/types/)
```
📁 types/
  ├── auth.types.ts        # User, LoginCredentials, RegisterData, AuthResponse
  ├── post.types.ts        # Post, CreatePostData, UpdatePostData
  └── todo.types.ts        # Todo, CreateTodoData, UpdateTodoData
```

**Purpose**: Type safety for all data structures

### 4️⃣ Context (Global State) (src/contexts/)
```
📁 contexts/
  └── AuthContext.tsx      # Authentication state & functions
                           # - user, token, login(), register(), logout()
                           # - isAuthenticated
                           # - Persists to localStorage
```

**Provides to entire app:**
- Current user info
- Login/logout functions
- Authentication status

### 5️⃣ Components (src/components/)
```
📁 components/
  └── ProtectedRoute.tsx   # Wraps routes that require authentication
                           # Redirects to /login if not authenticated
```

### 6️⃣ Pages (src/pages/)
```
📁 pages/
  ├── Login.tsx            # Login form with email/username & password
  ├── Register.tsx         # Registration form (username, email, password)
  ├── Dashboard.tsx        # Home page after login (links to Posts & Todos)
  ├── Posts.tsx            # Full posts management (Create, Edit, Delete, View)
  └── Todos.tsx            # Full todos management (Create, Toggle, Delete)
```

**Page Features:**
- **Login**: Form validation, error handling, redirect to dashboard
- **Register**: Account creation, validation, auto-login
- **Dashboard**: Welcome message, navigation cards
- **Posts**: Modal form, rich text handling, author check
- **Todos**: Checkbox toggle, inline forms

### 7️⃣ Main Application Files (src/)
```
📁 src/
  ├── App.tsx              # Main component with React Router setup
  │                        # - Defines all routes
  │                        # - Wraps protected routes
  │
  ├── main.tsx             # Entry point - mounts React app to DOM
  │
  └── index.css            # Global styles & Tailwind imports
```

### 8️⃣ HTML Entry (Root)
```
index.html               # HTML template with <div id="root">
```

---

## 🎯 File Count Summary

| Category | Files | Purpose |
|----------|-------|---------|
| **API Services** | 3 | Handle all backend API calls |
| **Type Definitions** | 3 | TypeScript interfaces |
| **Contexts** | 1 | Global authentication state |
| **Components** | 1 | Route protection |
| **Pages** | 5 | User interface pages |
| **Main Files** | 3 | App setup & entry point |
| **Config Files** | 7 | Build & tool configuration |
| **Total** | **23 files** | Complete application |

---

## 🗂️ Organized by Feature

### Authentication Feature
```
📁 Authentication
  ├── src/api/services/authService.ts      # API calls
  ├── src/types/auth.types.ts              # Types
  ├── src/contexts/AuthContext.tsx         # State management
  ├── src/components/ProtectedRoute.tsx    # Route protection
  ├── src/pages/Login.tsx                  # Login UI
  └── src/pages/Register.tsx               # Register UI
```

### Posts Feature
```
📁 Posts
  ├── src/api/services/postService.ts      # API calls
  ├── src/types/post.types.ts              # Types
  └── src/pages/Posts.tsx                  # Posts UI
```

### Todos Feature
```
📁 Todos
  ├── src/api/services/todoService.ts      # API calls
  ├── src/types/todo.types.ts              # Types
  └── src/pages/Todos.tsx                  # Todos UI
```

### Core Application
```
📁 Core
  ├── src/api/axios.ts                     # HTTP client
  ├── src/api/interceptors.ts              # Request/response handling
  ├── src/App.tsx                          # Routing
  ├── src/main.tsx                         # Entry point
  ├── src/index.css                        # Global styles
  └── src/pages/Dashboard.tsx              # Home page
```

---

## 📝 Quick Reference - What Each Folder Does

```
src/
├── api/          → Communicate with backend (Strapi)
├── types/        → Define data structures (TypeScript)
├── contexts/     → Share state across components (Auth)
├── components/   → Reusable UI pieces (ProtectedRoute)
└── pages/        → Full page components (Login, Posts, etc.)
```

---

## 🔥 Most Important Files (Must Understand)

If you're learning, focus on these key files first:

1. **src/contexts/AuthContext.tsx** - How authentication works
2. **src/api/services/authService.ts** - How to make API calls
3. **src/pages/Login.tsx** - How forms and state work
4. **src/pages/Posts.tsx** - Complete CRUD example
5. **src/App.tsx** - How routing connects everything
6. **src/api/interceptors.ts** - How to add auth to requests

---

## 🌳 Visual Tree (ASCII)

```
posts
│
├── Config Files (.env, tailwind.config.js, etc.)
│
└── src/
    │
    ├── api/
    │   ├── axios.ts
    │   ├── interceptors.ts
    │   └── services/
    │       ├── authService.ts
    │       ├── postService.ts
    │       └── todoService.ts
    │
    ├── types/
    │   ├── auth.types.ts
    │   ├── post.types.ts
    │   └── todo.types.ts
    │
    ├── contexts/
    │   └── AuthContext.tsx
    │
    ├── components/
    │   └── ProtectedRoute.tsx
    │
    ├── pages/
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── Dashboard.tsx
    │   ├── Posts.tsx
    │   └── Todos.tsx
    │
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

---

## 📋 Checklist - Files We Created

### Setup & Configuration
- ✅ .env
- ✅ .gitignore
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ vite.config.ts
- ✅ tsconfig.json

### API Layer
- ✅ src/api/axios.ts
- ✅ src/api/interceptors.ts
- ✅ src/api/services/authService.ts
- ✅ src/api/services/postService.ts
- ✅ src/api/services/todoService.ts

### Type Definitions
- ✅ src/types/auth.types.ts
- ✅ src/types/post.types.ts
- ✅ src/types/todo.types.ts

### State Management
- ✅ src/contexts/AuthContext.tsx

### Components
- ✅ src/components/ProtectedRoute.tsx

### Pages
- ✅ src/pages/Login.tsx
- ✅ src/pages/Register.tsx
- ✅ src/pages/Dashboard.tsx
- ✅ src/pages/Posts.tsx
- ✅ src/pages/Todos.tsx

### Main Application
- ✅ src/App.tsx
- ✅ src/main.tsx
- ✅ src/index.css
- ✅ index.html

---

## 🎓 Learning Path

**Beginner:**
1. Start with `src/pages/Login.tsx` - Understand forms and state
2. Look at `src/contexts/AuthContext.tsx` - See how global state works
3. Check `src/api/services/authService.ts` - Learn API calls

**Intermediate:**
4. Study `src/pages/Posts.tsx` - Full CRUD implementation
5. Understand `src/api/interceptors.ts` - Request/response handling
6. Review `src/App.tsx` - Routing and navigation

**Advanced:**
7. Analyze the full data flow from API to UI
8. Understand TypeScript types and interfaces
9. Learn the complete authentication flow

---

**Total: 23 files we created/modified** (excluding node_modules, dist, and other generated files)

---

Would you like me to create a visual diagram of how these files connect to each other?
