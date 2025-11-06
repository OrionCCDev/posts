// import {
//   Route,
//   createBrowserRouter,
//   createRoutesFromElements,
// } from "react-router-dom";
// import ProtectedRoute from "../components/auth/ProtectedRoute";
// import PageNotFound from "../pages/PageNotFound";
// import RootLayout from "../pages/Layout";
// import ErrorHandler from "../components/errors/ErrorHandler";
// import HomePage from "../pages";
// import LoginPage from "../pages/Login";
// import RegisterPage from "../pages/Register";
// import TodosPage from "../pages/Todos";



// const storageKey = "loggedInUser";
// const userDataString = localStorage.getItem(storageKey);
// const userData = userDataString ? JSON.parse(userDataString) : null;

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Root Layout */}
//       <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
//         <Route
//           index
//           element={
//             <ProtectedRoute
//               isAllowed={userData?.jwt}
//               redirectPath="/login"
//               data={userData}
//             >
//               <HomePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute
//               isAllowed={userData?.jwt}
//               redirectPath="/login"
//               data={userData}
//             >
//               <h2>Profile page</h2>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/todos"
//           element={
//             <ProtectedRoute
//               isAllowed={userData?.jwt}
//               redirectPath="/login"
//               data={userData}
//             >
//               <TodosPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="login"
//           element={
//             <ProtectedRoute
//               isAllowed={!userData?.jwt}
//               redirectPath="/"
//               data={userData}
//             >
//               <LoginPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="register"
//           element={
//             <ProtectedRoute
//               isAllowed={!userData?.jwt}
//               redirectPath="/register"
//               data={userData}
//             >
//               <RegisterPage />
//             </ProtectedRoute>
//           }
//         />
//       </Route>

//       {/* Page Not Found */}
//       <Route path="*" element={<PageNotFound />} />
//     </>
//   )
// );

// export default router;
// src/router.tsx
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Posts from '../pages/Posts';
import ProtectedRoute from '../components/ProtectedRoute';

// ============================================
// REACT ROUTER EXPLAINED
// ============================================
/*
PURPOSE:
========
React Router enables navigation without page reloads
Traditional websites: Click link → Server returns new HTML page → Full reload
Single Page Apps (SPA): Click link → JavaScript swaps content → No reload

BENEFITS:
=========
- Faster navigation (no page reload)
- Preserve state across routes
- Better user experience
- Smooth transitions
- Browser back/forward work

createBrowserRouter:
====================
- Uses HTML5 History API
- Clean URLs (/dashboard not /#/dashboard)
- Supports data loading
- Error boundaries
- Modern React Router v6 API

Route Object Structure:
=======================
{
  path: '/url-path',      // URL to match
  element: <Component />  // Component to render
}
*/

// ============================================
// ROUTER CONFIGURATION
// ============================================
export const router = createBrowserRouter([
  
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  // No authentication required
  // Anyone can access
  
  {
    // Root path - Homepage
    path: '/',
    element: <Login />,
  },
  {
    // Login path - Explicit login URL
    path: '/login',
    element: <Login />,
  },
  
  // ==========================================
  // PROTECTED ROUTES
  // ==========================================
  // Authentication required
  // Wrapped with ProtectedRoute component
  // Auto-redirects to /login if not authenticated
  
  {
    // Dashboard - Main page after login
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    // Users list page
    path: '/users',
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    // Posts management page
    path: '/posts',
    element: (
      <ProtectedRoute>
        <Posts />
      </ProtectedRoute>
    ),
  },
]);

// ============================================
// HOW ROUTING WORKS
// ============================================
/*
FLOW:
=====
1. User types URL or clicks link
2. Browser URL changes
3. RouterProvider (in App.tsx) detects change
4. Router checks configured routes
5. Finds matching path
6. Renders corresponding element
7. If element is ProtectedRoute:
   a. Checks authentication
   b. If authenticated → renders children
   c. If not → redirects to /login

EXAMPLES:
=========
User types: http://localhost:5173/
→ Matches: path: '/'
→ Renders: <Login />

User types: http://localhost:5173/dashboard
→ Matches: path: '/dashboard'
→ Renders: <ProtectedRoute><Dashboard /></ProtectedRoute>
→ ProtectedRoute checks auth
→ If has token: Shows Dashboard
→ If no token: <Navigate to="/login" />

NAVIGATION:
===========
In components:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard'); // Changes URL and shows Dashboard

With Link component:
import { Link } from 'react-router-dom';
<Link to="/posts">View Posts</Link> // Clickable link

PARAMETERS:
===========
Dynamic routes:
{
  path: '/posts/:id',
  element: <PostDetail />
}

In component:
import { useParams } from 'react-router-dom';
const { id } = useParams(); // Get :id from URL
*/