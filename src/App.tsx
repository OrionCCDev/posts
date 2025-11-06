// import { RouterProvider } from "react-router-dom";
// import router from "./router";
// import { Toaster } from "react-hot-toast";

// const App = () => {
//   return (
//     <main className="min-h-screen pt-24 px-2 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 transition-colors duration-300">
//       <RouterProvider router={router} />
//       <Toaster />
//     </main>
//   );
// };

// export default App;
// src/App.tsx

// ============================================
// IMPORTS
// ============================================
// Import RouterProvider component from react-router-dom
// RouterProvider is a component that provides routing context
// It makes the router available throughout the app
//
// WHY RouterProvider?
// - Connects router to React tree
// - Enables routing functionality
// - Provides context for useNavigate, useParams, etc.
// - Must wrap your entire app
import { RouterProvider } from 'react-router-dom';

// Import our configured router instance
// This is the router we created in router.tsx
// Contains all route definitions
import { router } from './router';

// ============================================
// WHAT IS APP COMPONENT?
// ============================================
/*
APP COMPONENT = Root of your application

Think of it like the foundation of a house:
- Everything builds on top of it
- It's the first component rendered
- It wraps all other components

In our app:
- App.tsx renders RouterProvider
- RouterProvider uses our router
- Router decides which page to show
- Page components render content

COMPONENT HIERARCHY:
====================
App (this file)
  └── RouterProvider
        └── Current Route Component
              ├── Login (if on /login)
              ├── Dashboard (if on /dashboard)
              └── Users (if on /users)

RESPONSIBILITY:
===============
This component has ONE job:
- Render the RouterProvider with our router

That's it! Clean and simple.

Why so simple?
- Single Responsibility Principle
- Easy to understand
- Easy to test
- Easy to modify
*/

// ============================================
// APP COMPONENT FUNCTION
// ============================================
// function App() defines a functional component
//
// function keyword:
// - Standard JavaScript function
// - Can also use: const App = () => { }
//
// App = component name
// - Always starts with capital letter (React convention)
// - PascalCase naming
//
// () = no parameters
// - App component doesn't receive props
// - Self-contained
//
// Return type (implicit): JSX.Element
// - TypeScript infers this
// - Could explicitly type: function App(): JSX.Element
function App() {
  
  // ==========================================
  // RETURN JSX
  // ==========================================
  // return statement defines what to render
  //
  // Returns single JSX element
  // Must return exactly one root element
  //
  // Why single element?
  // - React rule: component returns one element
  // - Can use <> (Fragment) for multiple siblings
  // - Here we only need one: RouterProvider
  return (
    
    // ----------------------------------------
    // ROUTER PROVIDER COMPONENT
    // ----------------------------------------
    // <RouterProvider> is a component from react-router-dom
    //
    // Purpose:
    // - Provides routing context to app
    // - Makes router available everywhere
    // - Enables hooks like useNavigate, useParams
    // - Handles URL changes
    // - Renders matching route components
    //
    // router prop:
    // - Required prop
    // - Accepts router instance
    // - router={router} passes our configured router
    //
    // HOW IT WORKS:
    // 1. RouterProvider receives router prop
    // 2. Looks at current URL in browser
    // 3. Checks router's route definitions
    // 4. Finds matching route
    // 5. Renders that route's element
    //
    // Example flow:
    // - URL: http://localhost:5173/
    // - RouterProvider checks routes
    // - Finds: { path: '/', element: <Login /> }
    // - Renders: <Login /> component
    //
    // Example flow 2:
    // - URL: http://localhost:5173/dashboard
    // - RouterProvider checks routes
    // - Finds: { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> }
    // - Renders: <ProtectedRoute> which checks auth
    // - If authenticated: renders <Dashboard />
    // - If not: <Navigate to="/login" />
    //
    // Self-closing tag:
    // - <RouterProvider router={router} />
    // - No children needed
    // - Router handles rendering
    //
    // Alternative syntax (with children):
    // <RouterProvider router={router}>
    //   {/* Nothing needed here */}
    // </RouterProvider>
    <RouterProvider router={router} />
  );
}

// ============================================
// EXPORT COMPONENT
// ============================================
// export default App;
//
// export = makes component available to other files
// default = this is the default export
// App = what we're exporting
//
// Other files import like:
// import App from './App';
//
// WHY default export?
// - Main component of the file
// - Conventional for components
// - Can import with any name:
//   import MyApp from './App'; // Works!
//   import Application from './App'; // Also works!
//
// Named export alternative:
// export { App };
// Then import: import { App } from './App';
export default App;

// ============================================
// COMPLETE FLOW VISUALIZATION
// ============================================
/*
APPLICATION STARTUP:
====================

1. Browser loads index.html
   <div id="root"></div>

2. main.tsx runs:
   import App from './App'
   ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

3. App component renders:
   return <RouterProvider router={router} />

4. RouterProvider initializes:
   - Reads current URL
   - Example: http://localhost:5173/dashboard

5. RouterProvider checks router:
   - Looks through route array
   - Finds: { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> }

6. RouterProvider renders element:
   - <ProtectedRoute> renders
   - Checks: authService.isAuthenticated()
   - If true: renders {children} = <Dashboard />
   - If false: renders <Navigate to="/login" />

7. Component tree built:
   App
     └── RouterProvider
           └── ProtectedRoute
                 └── Dashboard
                       └── [Dashboard content]

8. React renders to DOM:
   - Virtual DOM created
   - Compared with real DOM
   - Real DOM updated
   - User sees Dashboard


USER NAVIGATES:
===============

1. User clicks "View All Users" button
   onClick={() => navigate('/users')}

2. navigate('/users') called:
   - URL changes to /users
   - Browser history updated
   - RouterProvider notified

3. RouterProvider re-evaluates:
   - Checks new URL: /users
   - Finds: { path: '/users', element: <ProtectedRoute><Users /></ProtectedRoute> }

4. RouterProvider renders new route:
   - Old component (Dashboard) unmounts
   - New component (Users) mounts

5. New component tree:
   App
     └── RouterProvider
           └── ProtectedRoute
                 └── Users
                       └── [Users list content]

6. React updates DOM:
   - Dashboard content removed
   - Users content added
   - User sees Users page
*/

// ============================================
// WHY THIS PATTERN?
// ============================================
/*
BENEFITS:
=========
✅ Clean separation of concerns
   - App.tsx = render router
   - router.tsx = define routes
   - Pages = implement features

✅ Easy to understand
   - One file, one purpose
   - No complex logic
   - Obvious what it does

✅ Easy to extend
   - Add global providers here
   - Add error boundaries
   - Add loading screens

✅ Testable
   - Simple component
   - Easy to mock router
   - Straightforward tests

ALTERNATIVE PATTERNS:
====================

Pattern 1: Inline routes in App.tsx
------------------------------------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

Pros:
- Everything in one file
- See all routes at once

Cons:
- App.tsx gets large
- Harder to manage many routes
- Less modular


Pattern 2: With providers
--------------------------
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

Use when you need:
- React Query for data fetching
- Theme/styling providers
- Error boundaries
- Context providers
- Analytics


Pattern 3: With loading state
------------------------------
function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize app
    initializeApp().then(() => setIsReady(true));
  }, []);

  if (!isReady) return <LoadingScreen />;

  return <RouterProvider router={router} />;
}

Use when you need:
- Initialize before rendering
- Load config from API
- Check authentication
- Setup analytics
*/

// ============================================
// EXTENDING THIS APP
// ============================================
/*
ADDING ERROR BOUNDARY:
======================
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}


ADDING GLOBAL LOADING:
======================
import { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <div>Loading app...</div>;
  }

  return <RouterProvider router={router} />;
}


ADDING THEME PROVIDER:
======================
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#007bff',
    danger: '#dc3545',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}


ADDING REACT QUERY:
===================
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}


ADDING AUTHENTICATION CHECK:
=============================
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Refresh token on app start
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Validate token
      authService.validateToken(token).catch(() => {
        // Invalid token, clear it
        authService.logout();
      });
    }
  }, []);

  return <RouterProvider router={router} />;
}
*/

// ============================================
// COMMON MISTAKES
// ============================================
/*
❌ MISTAKE: Not importing RouterProvider
import { router } from './router';
function App() {
  return <router />; // ❌ Wrong!
}

✅ CORRECT:
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
function App() {
  return <RouterProvider router={router} />;
}


❌ MISTAKE: Wrong prop name
<RouterProvider routes={router} />  // ❌ Wrong prop name

✅ CORRECT:
<RouterProvider router={router} />  // ✅ Correct prop


❌ MISTAKE: Forgetting to import router
import { RouterProvider } from 'react-router-dom';
function App() {
  return <RouterProvider router={router} />; // ❌ router not imported
}

✅ CORRECT:
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
function App() {
  return <RouterProvider router={router} />;
}


❌ MISTAKE: Using wrong router type
import { createHashRouter } from 'react-router-dom';
const router = createHashRouter([...]);
// Now URLs have # in them: /#/dashboard

✅ CORRECT (if you want clean URLs):
import { createBrowserRouter } from 'react-router-dom';
const router = createBrowserRouter([...]);
// Clean URLs: /dashboard


❌ MISTAKE: Lowercase component name
function app() { // ❌ Should be capital
  return <RouterProvider router={router} />;
}

✅ CORRECT:
function App() { // ✅ Capital letter
  return <RouterProvider router={router} />;
}
*/

// ============================================
// PERFORMANCE NOTES
// ============================================
/*
CURRENT PERFORMANCE:
====================
✅ Minimal overhead
✅ No unnecessary re-renders
✅ Router handles navigation efficiently
✅ Components mount/unmount as needed

App component:
- Renders once on startup
- Never re-renders (no state/props)
- Very fast
- No performance concerns

RouterProvider:
- Handles URL changes
- Renders matching components
- Efficient diffing
- No performance issues with 100+ users

FOR LARGE APPS:
===============
Consider:
- Code splitting (lazy load routes)
- Suspense boundaries
- Route-level data preloading
- Transition animations

Example with Suspense:
```
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

But for our app size, not needed.
*/

// ============================================
// TESTING
// ============================================
/*
UNIT TEST EXAMPLE:
==================
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  // App renders RouterProvider
  // RouterProvider renders first route (Login)
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});


INTEGRATION TEST EXAMPLE:
==========================
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('navigation flow', async () => {
  render(<App />);
  
  // Should show login
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  
  // Fill in form
  userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  userEvent.type(screen.getByLabelText(/password/i), 'password');
  
  // Submit
  userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Should navigate to dashboard
  await waitFor(() => {
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
*/