// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services/authService';

// ============================================
// REACT HOOKS EXPLAINED
// ============================================
/*
WHAT ARE HOOKS?
===============
Hooks are functions that let you "hook into" React features
Available in functional components (not classes)

Common hooks:
- useState: Add state to component
- useEffect: Run side effects
- useNavigate: Navigate programmatically
- useParams: Get URL parameters
- useContext: Access context

WHY HOOKS?
==========
Before: Class components with lifecycle methods (complex)
After: Functional components with hooks (simple)

Rules:
1. Only call at top level (not in loops/conditions)
2. Only call in React functions (components/custom hooks)
*/

// ============================================
// LOGIN COMPONENT
// ============================================
// Purpose: User authentication interface
// Responsibilities:
// - Display login form
// - Handle form submission
// - Call auth API
// - Navigate on success
// - Show errors on failure

const Login = () => {
  
  // ==========================================
  // STATE MANAGEMENT WITH useState
  // ==========================================
  /*
  useState Syntax:
  const [value, setValue] = useState(initialValue);
  
  - value: current state value
  - setValue: function to update state
  - initialValue: starting value
  
  When setValue is called:
  1. State updates
  2. Component re-renders
  3. New value shown in UI
  */
  
  // ----------------------------------------
  // IDENTIFIER STATE
  // ----------------------------------------
  // Purpose: Store email or username input
  // Initial value: '' (empty string)
  // Strapi uses 'identifier' field (can be email OR username)
  const [identifier, setIdentifier] = useState('');
  
  // ----------------------------------------
  // PASSWORD STATE
  // ----------------------------------------
  // Purpose: Store password input
  // Initial value: '' (empty string)
  const [password, setPassword] = useState('');
  
  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------
  // Purpose: Track if login request is in progress
  // Initial value: false (not loading)
  // Used to:
  // - Disable button during request
  // - Show loading text
  // - Prevent double submissions
  const [loading, setLoading] = useState(false);
  
  // ----------------------------------------
  // ERROR STATE
  // ----------------------------------------
  // Purpose: Store error message to display
  // Initial value: '' (no error)
  // Updated when login fails
  const [error, setError] = useState('');
  
  // ==========================================
  // NAVIGATION HOOK
  // ==========================================
  // useNavigate returns function to navigate programmatically
  // Purpose: Redirect after successful login
  // navigate('/path') changes URL and shows that route
  const navigate = useNavigate();

  // ==========================================
  // FORM SUBMIT HANDLER
  // ==========================================
  // Purpose: Handle login form submission
  // Parameters: e (event object)
  // async: Function makes asynchronous operations (API calls)
  const handleSubmit = async (e: React.FormEvent) => {
    // ----------------------------------------
    // PREVENT DEFAULT FORM BEHAVIOR
    // ----------------------------------------
    // Purpose: Stop form from submitting normally
    // Default behavior:
    // - Form POSTs to server
    // - Page reloads
    // - Loses all state
    // preventDefault() stops this
    // We handle submission with JavaScript
    e.preventDefault();
    
    // ----------------------------------------
    // START LOADING STATE
    // ----------------------------------------
    // Update loading to true
    // This will:
    // - Disable button (cursor: not-allowed)
    // - Change text to "Logging in..."
    setLoading(true);
    
    // Clear previous error
    // New attempt, fresh start
    setError('');

    // ----------------------------------------
    // TRY/CATCH BLOCK
    // ----------------------------------------
    // Purpose: Handle success and errors
    try {
      // ----------------------------------------
      // CALL AUTH SERVICE LOGIN
      // ----------------------------------------
      // authService.login() is async
      // await pauses until Promise resolves
      // Returns: { jwt, user }
      // Flow:
      // 1. Send credentials to Strapi
      // 2. Strapi validates
      // 3. Returns token if valid
      // 4. Token saved to localStorage
      const response = await authService.login({ identifier, password });
      
      console.log('✅ Login successful:', response);
      
      // ----------------------------------------
      // NAVIGATE TO DASHBOARD
      // ----------------------------------------
      // Login succeeded, redirect user
      // navigate() changes URL
      // Router renders Dashboard component
      // User sees their dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      // ----------------------------------------
      // ERROR HANDLING
      // ----------------------------------------
      // This runs if login fails
      // Possible reasons:
      // - Wrong credentials
      // - Network error
      // - Server error
      
      console.error('❌ Login failed:', err);
      
      // Set error message to display
      // err.message might be from authService
      // Or generic message as fallback
      setError(err.message || 'Login failed. Please check your credentials.');
      
    } finally {
      // ----------------------------------------
      // FINALLY BLOCK
      // ----------------------------------------
      // Runs whether try succeeds or fails
      // Perfect for cleanup
      
      // Stop loading state
      // Button enabled again
      // Text back to "Login"
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER JSX
  // ==========================================
  // Purpose: Define UI structure
  // return statement defines what appears on screen
  
  return (
    <div className="container-sm" style={{ marginTop: '50px' }}>
      <div className="card">
        {/* ---------------------------------------- */}
        {/* PAGE TITLE */}
        {/* ---------------------------------------- */}
        <h1 className="text-center mb-3">Login to Strapi App</h1>
        
        {/* ---------------------------------------- */}
        {/* LOGIN FORM */}
        {/* ---------------------------------------- */}
        {/* onSubmit prop: function to call when form submits
            Can be triggered by:
            1. Clicking submit button
            2. Pressing Enter in input field */}
        <form onSubmit={handleSubmit}>
          
          {/* ---------------------------------------- */}
          {/* IDENTIFIER INPUT */}
          {/* ---------------------------------------- */}
          <div className="mb-2">
            <label>
              Email or Username:
              {/* CONTROLLED INPUT PATTERN
                  value={identifier}: Input shows current state
                  onChange: Updates state when user types
                  Flow:
                  1. User types 'j'
                  2. onChange fires
                  3. setIdentifier('j') called
                  4. State updates: identifier = 'j'
                  5. Component re-renders
                  6. Input value = 'j'
                  
                  Benefits:
                  - React controls value (single source of truth)
                  - Can validate as user types
                  - Can transform input (uppercase, trim, etc.)
                  - Easy to clear/reset */}
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="john@example.com or johndoe"
                className="w-full"
              />
            </label>
          </div>

          {/* ---------------------------------------- */}
          {/* PASSWORD INPUT */}
          {/* ---------------------------------------- */}
          <div className="mb-2">
            <label>
              Password:
              {/* type="password": hides characters (shows dots)
                  Same controlled input pattern as above */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </label>
          </div>

          {/* ---------------------------------------- */}
          {/* ERROR MESSAGE (Conditional) */}
          {/* ---------------------------------------- */}
          {/* CONDITIONAL RENDERING
              {error && <div>...</div>}
              Logical AND (&&):
              - If left is truthy, render right
              - If left is falsy, render nothing
              
              Examples:
              error = "Invalid credentials" → shows div
              error = "" → shows nothing
              
              Why this works:
              - React ignores false, null, undefined
              - Strings render as text
              - "" (empty string) is falsy */}
          {error && (
            <div className="alert alert-error mb-2">
              {error}
            </div>
          )}

          {/* ---------------------------------------- */}
          {/* SUBMIT BUTTON */}
          {/* ---------------------------------------- */}
          {/* type="submit": Triggers form onSubmit
              disabled={loading}: Disable while loading
              className: Dynamic classes based on loading
              
              TERNARY OPERATOR:
              condition ? ifTrue : ifFalse
              loading ? 'btn-secondary' : 'btn-primary'
              If loading: gray button (disabled style)
              If not loading: blue button (enabled) */}
          <button
            type="submit"
            disabled={loading}
            className={`btn ${loading ? 'btn-secondary' : 'btn-primary'} btn-lg w-full`}
          >
            {/* Button text changes based on loading
                loading true: "Logging in..."
                loading false: "Login" */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* ---------------------------------------- */}
        {/* TEST INFO BOX */}
        {/* ---------------------------------------- */}
        <div className="alert alert-info mt-3">
          <strong>🔑 Test Credentials:</strong>
          <p className="text-sm mt-1"><code>Email: john@example.com</code></p>
          <p className="text-sm"><code>Password: Password123!</code></p>
          <hr style={{ margin: '10px 0' }} />
          <p className="text-sm">
            Make sure Strapi is running at http://localhost:1337
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPORT
// ============================================
export default Login;

// ============================================
// COMPONENT LIFECYCLE
// ============================================
/*
MOUNT (First Render):
=====================
1. Component function runs
2. useState creates state variables:
   - identifier = ''
   - password = ''
   - loading = false
   - error = ''
3. useNavigate initializes
4. JSX returned
5. React renders to DOM
6. User sees login form

USER TYPES EMAIL:
=================
1. User types 'j' in email input
2. onChange event fires
3. setIdentifier('j') called
4. State updates: identifier = 'j'
5. Component re-renders
6. Input value becomes 'j'
7. User sees 'j' in input
(Repeat for each character)

USER SUBMITS FORM:
==================
1. User clicks "Login" button
2. Form onSubmit event fires
3. handleSubmit function called
4. e.preventDefault() stops page reload
5. setLoading(true) → button disabled
6. setError('') → clear old error
7. authService.login() called
8. await pauses execution
9a. SUCCESS path:
    - Strapi returns { jwt, user }
    - Token saved to localStorage
    - navigate('/dashboard') called
    - URL changes
    - Dashboard renders
9b. ERROR path:
    - Strapi returns error
    - catch block executes
    - setError('Login failed...')
    - Error message appears
10. finally block executes
11. setLoading(false) → button enabled

UNMOUNT (Leave Page):
=====================
1. User navigates away
2. Component unmounts
3. State destroyed
4. If return, fresh state created
*/