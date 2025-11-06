// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services/authService';
import { postService } from '../api/services/postService';
import { User } from '../types/user.types';
import { FlatPost } from '../types/post.types';

// ============================================
// useEffect HOOK EXPLAINED
// ============================================
/*
Purpose: Run side effects after component renders
Side effects = anything that affects outside world:
- API calls (fetch data)
- DOM manipulation
- Subscriptions
- Timers
- localStorage

Syntax:
useEffect(() => {
  // Code to run
}, [dependencies]);

Dependencies array:
- [] = run once on mount
- [var] = run when var changes
- no array = run after every render

Why needed?
- Can't fetch data during render (async)
- Need to wait for component in DOM
- Separate render logic from side effects

Example flows:
useEffect(() => {
  fetchData();
}, []); 
// Runs once when component first appears

useEffect(() => {
  updateTitle();
}, [count]); 
// Runs when count changes

useEffect(() => {
  log();
}); 
// Runs after every render (usually avoid this)
*/

// ============================================
// DASHBOARD COMPONENT
// ============================================
// Purpose: Main page after login
// Shows: User info, their posts, navigation options
const Dashboard = () => {
  const [editing, setEditing] = useState(false);
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');

const handleEditProfile = () => {
  if (user) {
    setUsername(user.username);
    setEmail(user.email);
    setEditing(true);
  }
};

const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user) return;
  
  try {
    const updated = await userService.update(user.id, {
      username: username.trim(),
      email: email.trim(),
    });
    
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setEditing(false);
    alert('Profile updated!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Failed to update profile');
  }
};
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // ----------------------------------------
  // USER STATE
  // ----------------------------------------
  // Purpose: Store current user data
  // Type: User | null (can be User object or null)
  // Initial: null (not loaded yet)
  // Updated: After API call returns user data
  const [user, setUser] = useState<User | null>(null);
  
  // ----------------------------------------
  // POSTS STATE
  // ----------------------------------------
  // Purpose: Store user's posts
  // Type: FlatPost[] (array of flattened post objects)
  // Initial: [] (empty array)
  // Updated: After API call returns posts
  const [posts, setPosts] = useState<FlatPost[]>([]);
  
  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------
  // Purpose: Track if data is being fetched
  // Initial: true (start loading immediately)
  // Used for: Show loading message while fetching
  const [loading, setLoading] = useState(true);
  
  // ----------------------------------------
  // NAVIGATION HOOK
  // ----------------------------------------
  const navigate = useNavigate();

  // ==========================================
  // SIDE EFFECT: LOAD DATA ON MOUNT
  // ==========================================
  // Purpose: Fetch user and posts when component appears
  // Dependencies: [] = run once on mount
  // Flow:
  // 1. Component renders (loading=true shows "Loading...")
  // 2. After render, useEffect runs
  // 3. loadData() called
  // 4. API calls made
  // 5. State updated
  // 6. Component re-renders with data
  useEffect(() => {
    loadData();
  }, []); // Empty array = run once

  // ==========================================
  // LOAD DATA FUNCTION
  // ==========================================
  // Purpose: Fetch user info and their posts from Strapi
  // async: Makes asynchronous API calls
  // Called by: useEffect on component mount
  const loadData = async () => {
    try {
      // ----------------------------------------
      // FETCH CURRENT USER FROM STRAPI
      // ----------------------------------------
      // Purpose: Get fresh user data from database
      // Endpoint: GET /api/users/me
      // Why: Ensure data is up-to-date
      // Alternative: authService.getCurrentUserLocal() (faster, cached)
      const currentUser = await authService.getCurrentUser();
      
      // Update user state
      // Triggers re-render with user data
      setUser(currentUser);

      // ----------------------------------------
      // FETCH USER'S POSTS
      // ----------------------------------------
      // Only if user exists (null check)
      if (currentUser) {
        // postService.getByUser() filters posts by author
        // Endpoint: GET /api/posts?filters[author][id][$eq]=userId
        // Returns: Array of posts created by this user
        const userPosts = await postService.getByUser(currentUser.id);
        
        // Update posts state
        setPosts(userPosts);
        
        console.log('✅ Loaded posts:', userPosts.length);
      }
      
    } catch (error) {
      // ----------------------------------------
      // ERROR HANDLING
      // ----------------------------------------
      // If API calls fail (network, server error, etc.)
      console.error('Failed to load data:', error);
      
      // Note: No error state shown in UI
      // Could add: const [error, setError] = useState('')
      // Then show error message to user
      
    } finally {
      // ----------------------------------------
      // STOP LOADING
      // ----------------------------------------
      // Runs whether try succeeds or fails
      // Purpose: Hide loading message, show content
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT HANDLER
  // ==========================================
  // Purpose: Log out user and redirect to login
  // Not async: Just clearing local data
  const handleLogout = () => {
    // Clear authentication (remove token and user from localStorage)
    authService.logout();
    
    // Redirect to login page
    navigate('/login');
  };

  // ==========================================
  // CONDITIONAL RENDERING: LOADING STATE
  // ==========================================
  // Purpose: Show loading message while data fetches
  // Early return pattern: stops execution if true
  // Flow:
  // 1. Component renders
  // 2. loading=true initially
  // 3. Returns loading message
  // 4. useEffect runs, fetches data
  // 5. setLoading(false) called
  // 6. Component re-renders
  // 7. loading=false, skips this if block
  // 8. Main content renders
  if (loading) {
    return (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="card text-center">
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p className="mt-2">Loading from Strapi...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  // If we reach here: loading=false, data loaded
  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <div className="card">
        
        {/* ---------------------------------------- */}
        {/* HEADER WITH LOGOUT */}
        {/* ---------------------------------------- */}
        {/* Flexbox layout: title left, button right */}
        <div className="flex justify-between items-center mb-4">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* USER INFO SECTION */}
        {/* ---------------------------------------- */}
        {/* CONDITIONAL RENDERING
            {user && <div>...</div>}
            Only shows if user exists (not null)
            Prevents errors accessing user.username if user is null */}
        {user && (
  <div className="card" style={{ backgroundColor: 'var(--primary-light)' }}>
    {!editing ? (
      <>
        <h2>Welcome, {user.username}!</h2>
        <p className="text-secondary mt-1">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-secondary">
          <strong>User ID:</strong> {user.id}
        </p>
        <button 
          onClick={handleEditProfile}
          className="btn btn-primary btn-sm mt-2"
        >
          Edit Profile
        </button>
      </>
    ) : (
      <form onSubmit={handleUpdateProfile}>
        <h3 className="mb-2">Edit Profile</h3>
        
        <div className="mb-2">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
            />
          </label>
        </div>
        
        <div className="mb-2">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </label>
        </div>
        
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary btn-sm">
            Save
          </button>
          <button 
            type="button"
            onClick={() => setEditing(false)}
            className="btn btn-secondary btn-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
)}

        {/* ---------------------------------------- */}
        {/* POSTS SECTION */}
        {/* ---------------------------------------- */}
        <div className="mt-4">
          <h2>Your Posts ({posts.length})</h2>
          
          {/* CONDITIONAL RENDERING: Empty State vs Posts List */}
          {posts.length === 0 ? (
            // ----------------------------------------
            // EMPTY STATE
            // ----------------------------------------
            // Shows when user has no posts
            <div className="alert alert-info mt-2">
              <p>No posts yet. Go to Posts page to create your first post!</p>
            </div>
          ) : (
            // ----------------------------------------
            // POSTS LIST
            // ----------------------------------------
            // .map() transforms array to JSX
            // Each post becomes a card
            <>
              {posts.map((post) => (
                // KEY PROP
                // Purpose: Help React identify which items changed
                // Must be unique among siblings
                // Use post.id (unique identifier)
                // Never use array index (causes bugs on reorder)
                <div key={post.id} className="card mt-2">
                  <h3>{post.title}</h3>
                  
                  {/* DANGEROUSLY SET INNER HTML
                      Purpose: Render HTML content (Strapi rich text)
                      Why dangerous: Could allow XSS attacks
                      Safe here: Content from our own Strapi (trusted)
                      Strapi markdown/rich text needs HTML rendering */}
                  <div 
                    className="text-secondary mt-1"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  {/* POST METADATA */}
                  <p className="text-sm text-light mt-2">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ---------------------------------------- */}
        {/* NAVIGATION BUTTONS */}
        {/* ---------------------------------------- */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => navigate('/users')} 
            className="btn btn-primary"
          >
            View All Users
          </button>
          <button 
            onClick={() => navigate('/posts')} 
            className="btn btn-success"
          >
            View All Posts
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPORT
// ============================================
export default Dashboard;

// ============================================
// REACT COMPONENT LIFECYCLE
// ============================================
/*
DETAILED FLOW:
==============

1. INITIAL RENDER
   - Dashboard() function runs
   - State initialized:
     * user = null
     * posts = []
     * loading = true
   - useEffect registered (doesn't run yet)
   - Return JSX evaluated
   - loading=true → returns loading message
   - React renders to DOM
   - User sees "Loading from Strapi..."

2. AFTER RENDER (useEffect runs)
   - useEffect callback executes
   - loadData() called
   - Two API calls made in parallel:
     a) authService.getCurrentUser()
        → GET /api/users/me
        → Returns: {id: 1, username: "john", ...}
     b) After user loaded, postService.getByUser(userId)
        → GET /api/posts?filters[author][id][$eq]=1
        → Returns: [{id: 1, title: "...", ...}, ...]
   - setUser() called → user = {id: 1, ...}
   - setPosts() called → posts = [...]
   - setLoading(false) called → loading = false
   - These setState calls trigger RE-RENDER

3. RE-RENDER WITH DATA
   - Dashboard() function runs again
   - State now has values:
     * user = {id: 1, username: "john", ...}
     * posts = [{id: 1, ...}, ...]
     * loading = false
   - useEffect doesn't run (dependencies haven't changed)
   - Return JSX evaluated
   - loading=false → skips loading block
   - Main content rendered:
     * User info card
     * Posts list
     * Navigation buttons
   - React updates DOM
   - User sees dashboard with data

4. USER CLICKS LOGOUT
   - onClick handler fires
   - handleLogout() called
   - authService.logout() removes token and user
   - navigate('/login') changes URL
   - Router renders Login component
   - Dashboard unmounts

5. USER CLICKS "VIEW ALL POSTS"
   - onClick handler fires
   - navigate('/posts') changes URL
   - Router renders Posts component
   - Dashboard unmounts

UNMOUNT:
========
When user navigates away:
- State destroyed (user, posts, loading)
- useEffect cleanup (if any)
- Event listeners removed
- Component removed from DOM
*/

// ============================================
// KEY CONCEPTS DEMONSTRATED
// ============================================
/*
1. useState:
   - Manage component state
   - Trigger re-renders
   - Persist data between renders

2. useEffect:
   - Run side effects after render
   - Fetch data from API
   - Dependencies control when it runs

3. Async/Await:
   - Handle asynchronous operations
   - Wait for API responses
   - Cleaner than .then() chains

4. Conditional Rendering:
   - Show different UI based on state
   - Loading states
   - Empty states
   - Error states

5. Array.map():
   - Transform array to JSX
   - Render lists
   - Dynamic content

6. Event Handlers:
   - onClick for buttons
   - User interactions
   - Navigate programmatically

7. Component Lifecycle:
   - Mount → Render → Effect
   - Update → Re-render
   - Unmount → Cleanup

8. TypeScript:
   - Type safety
   - Null checks (user && ...)
   - Interface definitions
   - IDE auto-completion
*/