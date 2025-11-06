/**
 * MAIN ENTRY POINT
 *
 * Purpose: Bootstrap the React application
 *
 * What does this file do?
 * - Entry point of the entire application
 * - Creates the React root and renders the App component
 * - Imports global styles
 * - This is where the React app starts
 *
 * Execution Flow:
 * 1. Browser loads index.html
 * 2. index.html loads this main.tsx file
 * 3. This file imports React and App component
 * 4. Creates React root attached to #root div
 * 5. Renders App component into the root
 * 6. React takes over and manages the UI from here
 */

/**
 * IMPORT REACT
 *
 * What is React?
 * - JavaScript library for building user interfaces
 * - Creates and manages components
 * - Handles rendering and updates efficiently
 */
import React from 'react';

/**
 * IMPORT REACT DOM
 *
 * What is ReactDOM?
 * - Package for rendering React components to the DOM
 * - DOM = Document Object Model (HTML structure)
 * - Bridges React components with browser HTML
 *
 * Why separate from React?
 * - React can render to different targets (web, mobile, VR)
 * - ReactDOM is specifically for web browsers
 * - React Native uses different renderer for mobile apps
 */
import ReactDOM from 'react-dom/client';

/**
 * IMPORT APP COMPONENT
 *
 * What is App?
 * - Root component of our application
 * - Contains all routing and page components
 * - Everything in our app is inside App
 */
import App from './App';

/**
 * IMPORT GLOBAL STYLES
 *
 * What is this?
 * - Global CSS file with base styles
 * - Tailwind CSS directives
 * - Applied to entire application
 *
 * Why import CSS in JavaScript?
 * - Vite (build tool) processes CSS imports
 * - Bundles CSS with JavaScript
 * - CSS is automatically injected into HTML
 */
import './index.css';

/**
 * CREATE REACT ROOT
 *
 * What is createRoot?
 * - React 18+ API for creating a root
 * - Replaces ReactDOM.render from older versions
 * - Enables new React 18 features (concurrent rendering)
 *
 * What is document.getElementById('root')?
 * - Gets the <div id="root"> element from index.html
 * - This is where React will render our app
 * - All React components will be children of this div
 *
 * Why ! (non-null assertion)?
 * - TypeScript safety feature
 * - We're telling TypeScript "this element definitely exists"
 * - If it doesn't exist, app will crash (as it should)
 */
const root = ReactDOM.createRoot(
  document.getElementById('root')!
);

/**
 * RENDER APP
 *
 * What does render do?
 * - Takes React component and renders it to the DOM
 * - Updates the DOM when state changes
 * - Manages the entire React component tree
 *
 * What is StrictMode?
 * - React development tool
 * - Highlights potential problems in the app
 * - Only runs in development (not production)
 * - Doesn't render any visible UI
 *
 * What does StrictMode do?
 * - Warns about unsafe lifecycle methods
 * - Warns about deprecated APIs
 * - Detects unexpected side effects
 * - Helps write better React code
 *
 * Why wrap App in StrictMode?
 * - Best practice for development
 * - Helps catch bugs early
 * - Prepares code for future React versions
 * - No downside (only in development)
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * WHAT HAPPENS AFTER THIS?
 *
 * 1. React renders the App component
 * 2. App sets up Router and AuthProvider
 * 3. Router determines which page to show based on URL
 * 4. That page component renders
 * 5. All components connect to create the full UI
 * 6. React manages updates when state changes
 * 7. User can interact with the application
 */

/**
 * LEARNING NOTES
 *
 * React 18 Changes:
 * - Old way (React 17): ReactDOM.render(<App />, document.getElementById('root'))
 * - New way (React 18): createRoot(element).render(<App />)
 * - New API enables concurrent features
 * - Automatic batching for better performance
 *
 * Virtual DOM:
 * - React keeps a virtual copy of the DOM in memory
 * - When state changes, React updates virtual DOM
 * - Compares with actual DOM (diffing)
 * - Only updates what changed (efficient)
 *
 * Component Tree:
 * The structure created from this entry point:
 *
 * root (HTML element)
 *   └─ StrictMode (development wrapper)
 *       └─ App (our root component)
 *           └─ Router
 *               └─ AuthProvider
 *                   ├─ Navbar
 *                   └─ Routes
 *                       └─ [Page Components]
 *
 * Build Process (Vite):
 * 1. Development:
 *    - Vite serves this file with fast HMR
 *    - Changes reload instantly
 *    - TypeScript is transpiled to JavaScript
 *
 * 2. Production:
 *    - Vite bundles all files
 *    - Minifies code (smaller file size)
 *    - Optimizes for performance
 *    - Creates static files for deployment
 */
