// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../api/services/authService';

// ============================================
// WHAT IS A PROTECTED ROUTE?
// ============================================
/*
Purpose: Prevent unauthorized users from accessing pages
Think of it like a bouncer at a club:
- Has ticket (auth token) → Enter
- No ticket → Go to ticket booth (login)

Benefits:
- Security: Only logged-in users see protected content
- UX: Automatic redirect to login
- Reusability: Wrap any component to protect it
- Declarative: Clear which routes need auth

Without ProtectedRoute (bad):
function Dashboard() {
  useEffect(() => {
    if (!isAuthenticated()) navigate('/login');
  }, []);
  // ... rest of component
}
// Must remember to add this to EVERY protected component

With ProtectedRoute (good):
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
// Protection handled automatically
*/

// ============================================
// PROPS INTERFACE
// ============================================
// Purpose: Define what props this component accepts
// children: The component(s) to protect
// React.ReactNode: Any valid React content (components, elements, text, etc.)
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
// Purpose: Wrapper component that checks authentication
// Parameters: { children } - destructured props
// Returns: children if authenticated, Navigate to login if not

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  
  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================
  // Purpose: Determine if user is logged in
  // authService.isAuthenticated() checks for token in localStorage
  // Returns boolean: true (has token) or false (no token)
  const isAuthenticated = authService.isAuthenticated();

  // ==========================================
  // CONDITIONAL RENDERING
  // ==========================================
  // Purpose: Show different content based on auth status
  
  // If NOT authenticated (no token)
  if (!isAuthenticated) {
    // <Navigate> component from react-router-dom
    // Programmatically redirects user to different route
    // to="/login" - destination URL
    // replace - replaces current history entry instead of adding new one
    
    // WHY replace?
    // Without replace:
    // User goes to /dashboard → redirected to /login → logs in → presses back → redirected to /login (loop!)
    // With replace:
    // User goes to /dashboard → redirected to /login (dashboard removed from history) → logs in → presses back → previous page (no loop)
    return <Navigate to="/login" replace />;
  }

  // If authenticated (has token)
  // Return children (the protected component)
  // <></> = React Fragment (wrapper that doesn't add DOM element)
  // Alternative: return children; (also valid)
  return <>{children}</>;
};

// ============================================
// EXPORT
// ============================================
// Default export - can be imported with any name
// import ProtectedRoute from './components/ProtectedRoute'
// import AuthGuard from './components/ProtectedRoute' (also works)
export default ProtectedRoute;

// ============================================
// HOW IT'S USED IN ROUTER
// ============================================
/*
In router.tsx:

import ProtectedRoute from './components/ProtectedRoute';

{
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}

FLOW:
1. User navigates to /dashboard
2. Router renders <ProtectedRoute><Dashboard /></ProtectedRoute>
3. ProtectedRoute checks isAuthenticated()
4a. If true: renders <Dashboard /> (user sees dashboard)
4b. If false: renders <Navigate to="/login" /> (redirected to login)

NESTING:
ProtectedRoute (wrapper)
  └── Dashboard (children)

children prop = everything between opening and closing tags
<ProtectedRoute>
  THIS IS CHILDREN
</ProtectedRoute>
*/

// ============================================
// ALTERNATIVE IMPLEMENTATIONS
// ============================================
/*
BASIC VERSION (What we use):
- Just checks if token exists
- Simple and fast
- Good for most apps

ENHANCED VERSION (Optional):
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUserLocal();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

Usage:
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

LAYOUT VERSION:
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

All protected pages get same layout automatically
*/

// ============================================
// TESTING PROTECTED ROUTE
// ============================================
/*
TEST 1: Not Logged In
- Clear localStorage
- Go to /dashboard
- Should redirect to /login
- URL should be /login

TEST 2: Logged In
- Login first
- Token saved to localStorage
- Go to /dashboard
- Should see Dashboard content
- URL should be /dashboard

TEST 3: Token Expires
- Login
- Remove token from localStorage
- Refresh page
- Should redirect to /login
- Interceptor also handles this (401 response)

TEST 4: Back Button After Logout
- Login and go to dashboard
- Logout
- Press back button
- Should NOT see dashboard
- Should redirect to login
- Because replace=true removed dashboard from history
*/