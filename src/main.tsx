// import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <QueryClientProvider client={queryClient}>
//     <App />
//   </QueryClientProvider>
// );
// src/main.tsx

// ============================================
// IMPORTS
// ============================================
// Import React library
// React is needed for JSX transformation
// Even though we don't use it directly, it's required
//
// WHY import React?
// - JSX compiles to React.createElement()
// - TypeScript/Babel transform JSX
// - React must be in scope
//
// Note: In React 17+, new JSX transform doesn't require this
// But we include it for compatibility and clarity
import React from 'react';

// Import ReactDOM client
// ReactDOM is the bridge between React and browser DOM
// createRoot is the new React 18 API for rendering
//
// WHY ReactDOM?
// - React is platform-agnostic
// - ReactDOM connects React to web browsers
// - createRoot enables concurrent features
//
// Old API (React 17):
// import ReactDOM from 'react-dom';
// ReactDOM.render(<App />, rootElement);
//
// New API (React 18):
// import ReactDOM from 'react-dom/client';
// ReactDOM.createRoot(rootElement).render(<App />);
import ReactDOM from 'react-dom/client';

// Import main App component
// This is the root component we just created
// Contains RouterProvider which handles all routing
import App from './App';

// Import global CSS styles
// This file contains base styles for the entire app
//
// WHY import CSS?
// - Applies global styles
// - Resets browser defaults
// - Sets base typography
// - Provides utility classes
//
// Note: CSS imports work because Vite handles them
// Vite injects CSS into <style> tags in <head>
import './index.css';

// ============================================
// CRITICAL IMPORT - ACTIVATE INTERCEPTORS
// ============================================
// Import interceptors to activate them
// This is REQUIRED for auth tokens, logging, error handling
//
// WHY this import?
// - Interceptors are defined in interceptors.ts
// - But defining them doesn't activate them
// - Importing runs the code, which adds interceptors to axios
//
// What happens when imported:
// 1. File executes
// 2. api.interceptors.request.use() runs
// 3. api.interceptors.response.use() runs
// 4. Interceptors are now active for all requests
//
// CRITICAL: Without this import:
// ❌ No auth tokens added to requests
// ❌ No request/response logging
// ❌ No automatic error handling
// ❌ No token refresh
// ❌ API calls will fail (401 Unauthorized)
//
// Even though we don't use anything from this import,
// the side effect (activating interceptors) is what we need
//
// Alternative approach (not recommended):
// Import in App.tsx or each service file
// But here is better - runs once, applies everywhere
import './api/interceptors';

// ============================================
// DEV: Seed localStorage with a JWT for quick testing
// ============================================
// If you want to auto-use a JWT you obtain from Postman during
// development, set VITE_DEV_JWT in a .env file (not committed).
// Example .env (project root):
// VITE_DEV_JWT=eyJ...your_jwt_here
// Optionally set VITE_DEV_USER_JSON to a JSON string for the user
// VITE_DEV_USER_JSON={"id":4,"username":"dev","email":"dev@example.com"}
// This code only runs in development (import.meta.env.DEV)
if (import.meta.env.DEV) {
  const DEV_JWT = import.meta.env.VITE_DEV_JWT as string | undefined;
  const DEV_USER_JSON = import.meta.env.VITE_DEV_USER_JSON as string | undefined;

  if (DEV_JWT) {
    try {
      // Seed token so interceptors will attach it to requests
      localStorage.setItem('accessToken', DEV_JWT);

      // If developer provided a user JSON, save it immediately
      if (DEV_USER_JSON) {
        try {
          // Validate JSON
          const parsed = JSON.parse(DEV_USER_JSON);
          localStorage.setItem('user', JSON.stringify(parsed));
        } catch (e) {
          // If JSON invalid, ignore and we'll attempt to fetch /users/me below
          // eslint-disable-next-line no-console
          console.warn('[DEV] VITE_DEV_USER_JSON is invalid JSON, will attempt /users/me', e);
        }
      }

      // Try to fetch current user to ensure localStorage.user is accurate
      // We import authService dynamically to avoid potential circular imports at startup
      (async () => {
        try {
          const mod = await import('./api/services/authService');
          const user = await mod.authService.getCurrentUser();
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            // eslint-disable-next-line no-console
            console.log('[DEV] seeded accessToken and user from VITE_DEV_JWT');
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[DEV] could not fetch /users/me with VITE_DEV_JWT', err);
        }
      })();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[DEV] error seeding VITE_DEV_JWT', e);
    }
  }
}

// ============================================
// WHAT IS main.tsx? ==========================
// ============================================
/*
main.tsx = Entry point of your application

Think of it like the ignition key for a car:
- Starts everything
- Runs once
- Initializes the app

EXECUTION ORDER:
================
1. Browser loads index.html
2. index.html includes <script src="/src/main.tsx">
3. Vite compiles main.tsx to JavaScript
4. main.tsx executes:
   a. Imports run (React, ReactDOM, App, CSS, interceptors)
   b. Creates root
   c. Renders <App />
5. App component renders
6. Router initializes
7. First route component renders
8. User sees the page

FILE PURPOSE:
=============
- Connect React to DOM
- Render root component
- Import global styles
- Activate axios interceptors
- Configure React (StrictMode, etc.)

WHY IN src/ FOLDER?
===================
- Vite convention
- Development server expects it
- Entry point for bundler
- Source code organization
*/

// ============================================
// GET ROOT ELEMENT
// ============================================
// document.getElementById('root')
// - document = browser's global DOM object
// - getElementById() = finds element by id attribute
// - 'root' = matches <div id="root"></div> in index.html
//
// Returns: HTMLElement | null
// - HTMLElement if found
// - null if not found
//
// ! (non-null assertion operator)
// - Tells TypeScript: "Trust me, this will never be null"
// - Removes null from type
// - Type becomes: HTMLElement (not HTMLElement | null)
//
// WHY non-null assertion?
// - We know index.html has <div id="root"></div>
// - createRoot requires HTMLElement (not null)
// - ! operator satisfies TypeScript
//
// DANGER: If 'root' doesn't exist:
// - Runtime error
// - App won't render
// - But we control index.html, so it's safe
//
// Alternative (safer but verbose):
// const rootElement = document.getElementById('root');
// if (!rootElement) throw new Error('Root element not found');
// ReactDOM.createRoot(rootElement).render(<App />);

// ============================================
// CREATE ROOT
// ============================================
// ReactDOM.createRoot() is React 18+ API
//
// Purpose:
// - Creates a root for rendering
// - Enables concurrent features
// - Better performance
// - Automatic batching
//
// Parameters:
// - container: HTMLElement where React renders
// - We pass: document.getElementById('root')!
//
// Returns: Root object
// - Has .render() method
// - Has .unmount() method
//
// DIFFERENCE from React 17:
// React 17:
// ReactDOM.render(<App />, document.getElementById('root'));
//
// React 18:
// ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
//
// WHY change?
// - Enables concurrent rendering
// - Better Suspense support
// - Automatic batching of updates
// - Improved performance
//
// Chained method call:
// createRoot(...).render(...)
// - createRoot() returns Root object
// - .render() called on that object
// - All in one expression

// ============================================
// RENDER APP
// ============================================
// .render() method
// - Takes React element to render
// - Mounts element to DOM
// - Updates DOM when element changes
//
// Parameters:
// - element: React element (JSX)
// - We pass: <React.StrictMode><App /></React.StrictMode>

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  // ==========================================
  // STRICT MODE WRAPPER
  // ==========================================
  // <React.StrictMode> is a development tool
  //
  // Purpose:
  // - Identifies potential problems
  // - Highlights unsafe practices
  // - Warns about deprecated APIs
  // - Detects unexpected side effects
  //
  // What it does:
  // - Runs components twice (development only)
  // - Checks for side effects in render
  // - Warns about legacy APIs
  // - Validates refs
  //
  // WHY double rendering?
  // - React 18 concurrent features
  // - Components might render multiple times
  // - StrictMode helps find issues early
  // - Only in development (not production)
  //
  // Example warning:
  // Warning: Legacy context API detected
  // Warning: Unsafe lifecycle method used
  //
  // ONLY affects development:
  // - No extra rendering in production
  // - Warnings don't show in production
  // - No performance impact on users
  //
  // Can remove if needed:
  // ReactDOM.createRoot(...).render(<App />);
  //
  // But recommended to keep:
  // - Catches bugs early
  // - Prepares for future React
  // - No production cost
  <React.StrictMode>
    
    {/* ========================================== */}
    {/* APP COMPONENT */}
    {/* ========================================== */}
    {/* <App /> is our root component */}
    {/*
      What happens:
      1. <App /> creates React element
      2. App component function runs
      3. Returns <RouterProvider router={router} />
      4. RouterProvider initializes
      5. Checks current URL
      6. Renders matching route
      7. User sees first page
      
      Self-closing tag:
      - <App /> is short for <App></App>
      - No children needed
      - Clean syntax
    */}
    <App />
    
  </React.StrictMode>
);

// ============================================
// COMPLETE STARTUP FLOW
// ============================================
/*
STEP-BY-STEP:
=============

1. Browser loads index.html
   <!DOCTYPE html>
   <html>
     <head>...</head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>

2. Browser executes main.tsx
   - Vite compiles TypeScript
   - All imports execute

3. Import './api/interceptors' runs
   - interceptors.ts file executes
   - api.interceptors.request.use() adds request interceptor
   - api.interceptors.response.use() adds response interceptor
   - Interceptors now active for all axios requests

4. Import './index.css' runs
   - CSS loaded into browser
   - Styles applied globally

5. document.getElementById('root') runs
   - Finds: <div id="root"></div>
   - Returns: HTMLDivElement

6. ReactDOM.createRoot() runs
   - Creates React root
   - Attaches to <div id="root">
   - Prepares for rendering

7. .render() runs
   - Receives: <React.StrictMode><App /></React.StrictMode>
   - Creates Virtual DOM

8. <App /> component renders
   - App function executes
   - Returns: <RouterProvider router={router} />

9. <RouterProvider> initializes
   - Receives router prop
   - Checks current URL (window.location)
   - Example URL: http://localhost:5173/

10. RouterProvider finds matching route
    - Looks through router array
    - Finds: { path: '/', element: <Login /> }

11. <Login /> component renders
    - Login function executes
    - Returns JSX with form
    - State variables created

12. React commits to DOM
    - Virtual DOM compared with real DOM
    - Changes applied to real DOM
    - Browser paints screen

13. User sees login page
    - Form visible
    - Can type email/password
    - Can click Login button

14. useEffect hooks run (if any)
    - After initial render
    - Side effects execute
    - Data fetching starts

Total time: Usually < 100ms
User experience: Instant page load
*/

// ============================================
// WHAT IF THINGS GO WRONG?
// ============================================
/*
ERROR: Root element not found
==============================
Error: Cannot read property 'createRoot' of null

Cause:
- document.getElementById('root') returns null
- No element with id="root" in HTML

Fix:
- Check index.html has <div id="root"></div>
- Check spelling: "root" not "Root" or "app"


ERROR: Cannot find module './App'
==================================
Cause:
- App.tsx doesn't exist
- Wrong path
- File not saved

Fix:
- Create App.tsx file
- Check file location
- Verify import path


ERROR: Interceptors not working
================================
Symptom:
- API calls fail with 401
- No auth token in requests
- No console logs

Cause:
- Forgot to import './api/interceptors'
- Import in wrong place
- Interceptors file has errors

Fix:
- Add import './api/interceptors' to main.tsx
- Check interceptors.ts for syntax errors
- Verify import runs before first API call


ERROR: Styles not loading
==========================
Symptom:
- No styling
- Plain HTML look
- Missing CSS

Cause:
- index.css doesn't exist
- Wrong import path
- CSS file empty

Fix:
- Create index.css file
- Verify import './index.css'
- Add some CSS to test


ERROR: Blank white screen
==========================
Cause:
- JavaScript error during render
- Component crash
- Infinite loop

Fix:
- Open browser console (F12)
- Check error messages
- Add error boundary
- Debug component code
*/

// ============================================
// PRODUCTION BUILD
// ============================================
/*
DEVELOPMENT (npm run dev):
==========================
- Vite dev server runs
- Hot module replacement
- main.tsx compiled on-the-fly
- Source maps enabled
- Fast refresh
- Development warnings
- React.StrictMode active

Command:
npm run dev

Result:
- App runs at http://localhost:5173
- Changes update instantly
- Console shows warnings


PRODUCTION (npm run build):
============================
- Vite builds optimized bundle
- main.tsx compiled to JavaScript
- CSS extracted and minified
- Code split by routes
- Tree shaking removes unused code
- Minified and compressed

Command:
npm run build

Result:
- dist/ folder created
- Contains optimized files:
  - index.html
  - assets/index-[hash].js
  - assets/index-[hash].css
- Ready to deploy
- No React.StrictMode
- No development warnings


PREVIEW PRODUCTION:
===================
Command:
npm run preview

Result:
- Serves production build locally
- Test optimized version
- See exact production behavior
*/

// ============================================
// ENVIRONMENT VARIABLES
// ============================================
/*
ACCESSING IN main.tsx:
======================
// Vite exposes env vars via import.meta.env
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const mode = import.meta.env.MODE; // 'development' or 'production'

console.log('API URL:', apiUrl);
console.log('Mode:', mode);


BUILT-IN VARIABLES:
===================
import.meta.env.MODE           // 'development' or 'production'
import.meta.env.DEV            // true in development
import.meta.env.PROD           // true in production
import.meta.env.BASE_URL       // base URL
import.meta.env.VITE_*         // custom variables from .env


USING IN APP INITIALIZATION:
=============================
if (import.meta.env.DEV) {
  console.log('Development mode');
  // Enable debug tools
}

if (import.meta.env.PROD) {
  // Disable console logs
  console.log = () => {};
}
*/

// ============================================
// PERFORMANCE MONITORING
// ============================================
/*
ADDING PERFORMANCE TRACKING:
============================
// Track initial load time
const startTime = performance.now();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log render time
requestAnimationFrame(() => {
  const endTime = performance.now();
  console.log(`Initial render: ${endTime - startTime}ms`);
});


ADDING ERROR TRACKING:
=======================
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service (Sentry, LogRocket)
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking service
});


ADDING ANALYTICS:
=================
// Initialize analytics
if (import.meta.env.PROD) {
  // Google Analytics
  // Mixpanel
  // Custom analytics
}
*/

// ============================================
// ALTERNATIVE CONFIGURATIONS
// ============================================
/*
WITHOUT STRICT MODE:
====================
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);


WITH CONCURRENT MODE FEATURES:
===============================
import { startTransition } from 'react';

// Mark updates as non-urgent
startTransition(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  );
});


WITH ERROR BOUNDARY:
====================
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return <div>Error: {error.message}</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
);


WITH PROVIDERS:
===============
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
*/