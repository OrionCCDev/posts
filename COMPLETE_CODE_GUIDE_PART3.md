# Complete Code Guide - Part 3 (Final)
## Posts Page, Todos Page, and Main Application Files

This is the final part with detailed explanations for all remaining files.

---

# 9. PAGES (Continued)

## 📁 File: `src/pages/Posts.tsx`

**Purpose:** Complete posts management page (view, create, edit, delete)

```typescript
// React imports
import React, { useState, useEffect } from 'react';

// Import post service for API calls
import postService from '../api/services/postService';

// Import useAuth to get current user
import { useAuth } from '../contexts/AuthContext';

/**
 * TYPE DEFINITIONS (local to this file)
 */

// User interface
interface User {
  id: number;
  username: string;
  email: string;
}

// Post interface
interface Post {
  id: number;
  documentId?: string;
  title: string;
  content: string | any;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author?: User;
}

/**
 * UTILITY FUNCTION: Extract plain text from rich text
 *
 * Strapi stores content as JSON array (rich text format)
 * This function converts it to plain string for display
 *
 * @param content - Rich text content or string
 * @returns Plain text string
 */
const extractTextFromRichText = (content: any): string => {
  // If already a string, return it
  if (typeof content === 'string') {
    return content;
  }

  // If null/undefined, return empty string
  if (!content) {
    return '';
  }

  // If array (rich text format), extract text
  if (Array.isArray(content)) {
    let text = '';

    // Loop through each block
    content.forEach((block: any) => {
      // Check if block has children
      if (block.children && Array.isArray(block.children)) {
        // Loop through children and extract text
        block.children.forEach((child: any) => {
          if (child.text) {
            text += child.text + ' ';
          }
        });
      }
    });

    // Return trimmed text
    return text.trim();
  }

  // If we can't parse it, return empty string
  return '';
};

/**
 * POSTS PAGE COMPONENT
 */
const Posts: React.FC = () => {
  // Get current user from auth context
  const { user } = useAuth();

  /**
   * STATE MANAGEMENT
   */

  // Posts list
  const [posts, setPosts] = useState<Post[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);        // Initial load
  const [formLoading, setFormLoading] = useState(false); // Form submission

  // Messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form visibility
  const [showForm, setShowForm] = useState(false);

  // Edit mode tracking
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  // Form input values
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  /**
   * EFFECT: Fetch posts on component mount
   *
   * useEffect with empty dependency array runs once when component mounts
   */
  useEffect(() => {
    fetchPosts();  // Fetch posts from API
  }, []); // Empty array = run once on mount

  /**
   * FETCH POSTS FUNCTION
   *
   * Purpose: Load all posts from API
   */
  const fetchPosts = async () => {
    try {
      // Call post service to get all posts
      const data = await postService.getAllPosts();

      console.log('📦 Raw posts data:', data);

      // Process posts to extract plain text from rich text
      const processedPosts = data.map((post: Post) => ({
        ...post,  // Keep all other fields
        content: extractTextFromRichText(post.content)  // Convert content
      }));

      console.log('✅ Processed posts:', processedPosts);

      // Update state with processed posts
      setPosts(processedPosts);

      // Clear any errors
      setError(null);

    } catch (err: any) {
      // Log error
      console.error('❌ Error fetching posts:', err);

      // Show error message to user
      setError(err.message || 'Failed to load posts');

    } finally {
      // Always clear loading state (whether success or error)
      setLoading(false);
    }
  };

  /**
   * OPEN CREATE FORM
   *
   * Purpose: Show form in "create" mode
   */
  const handleCreateClick = () => {
    // Reset form fields
    setTitle('');
    setContent('');

    // Clear edit mode
    setEditingPostId(null);
    setIsEditing(false);

    // Show form
    setShowForm(true);
  };

  /**
   * OPEN EDIT FORM
   *
   * Purpose: Show form in "edit" mode with existing post data
   *
   * @param post - The post to edit
   */
  const handleEditClick = (post: Post) => {
    // Pre-fill form with post data
    setTitle(post.title);
    setContent(extractTextFromRichText(post.content));

    // Set edit mode
    setEditingPostId(post.id);
    setIsEditing(true);

    // Show form
    setShowForm(true);
  };

  /**
   * CLOSE FORM
   *
   * Purpose: Hide form and reset all form state
   */
  const handleCloseForm = () => {
    // Hide form
    setShowForm(false);

    // Reset form fields
    setTitle('');
    setContent('');

    // Clear edit mode
    setEditingPostId(null);
    setIsEditing(false);
  };

  /**
   * HANDLE FORM SUBMIT
   *
   * Purpose: Create or update post
   *
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission (page refresh)
    e.preventDefault();

    // Validation: Check if title is empty
    if (title.trim().length === 0) {
      setError('Title is required');
      return;  // Stop here
    }

    // Validation: Check if content is empty
    if (content.trim().length === 0) {
      setError('Content is required');
      return;  // Stop here
    }

    // Set loading state
    setFormLoading(true);

    try {
      if (isEditing && editingPostId !== null) {
        /**
         * EDIT MODE - Update existing post
         */
        await postService.updatePost(editingPostId, {
          title: title.trim(),
          content: content.trim(),
        });

        // Show success message
        setSuccess('Post updated successfully!');

      } else {
        /**
         * CREATE MODE - Create new post
         */
        await postService.createPost({
          title: title.trim(),
          content: content.trim(),
        });

        // Show success message
        setSuccess('Post created successfully!');
      }

      // Refresh posts list
      await fetchPosts();

      // Close form
      handleCloseForm();

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      // Log error
      console.error('❌ Error saving post:', err);

      // Show error message
      setError(err.message || 'Failed to save post');

    } finally {
      // Clear loading state
      setFormLoading(false);
    }
  };

  /**
   * DELETE POST FUNCTION
   *
   * Purpose: Remove a post from database
   *
   * @param postId - ID of post to delete
   * @param postTitle - Title of post (for confirmation dialog)
   */
  const handleDelete = async (postId: number, postTitle: string) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`
    );

    // If user clicked "Cancel", stop here
    if (!confirmed) {
      return;
    }

    try {
      // Call API to delete post
      await postService.deletePost(postId);

      // Remove post from state (update UI immediately)
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      // Show success message
      setSuccess('Post deleted successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      // Show error message
      setError(err.message || 'Failed to delete post');
    }
  };

  /**
   * CHECK IF USER CAN MODIFY POST
   *
   * Purpose: Determine if current user can edit/delete a post
   * Users can only modify their own posts
   *
   * @param post - The post to check
   * @returns true if user can modify, false otherwise
   */
  const canModifyPost = (post: Post): boolean => {
    // User must be logged in
    if (!user) return false;

    // Post must have an author
    if (!post.author) return false;

    // User ID must match author ID
    return user.id === post.author.id;
  };

  /**
   * FORMAT DATE FUNCTION
   *
   * Purpose: Convert ISO date string to readable format
   *
   * @param dateString - ISO date string (e.g., "2024-01-15T10:30:00.000Z")
   * @returns Formatted date string (e.g., "January 15, 2024")
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * RENDER: LOADING STATE
   *
   * Show spinner while initial data is loading
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* Spinning loader */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: POSTS PAGE
   */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-800">Posts</h1>

          {/* Page description */}
          <p className="text-gray-600 mt-2">
            Share your thoughts with the community
          </p>
        </div>

        {/* Create post button */}
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
        >
          Create Post
        </button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}

          {/* Close button */}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* SUCCESS ALERT */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* CREATE/EDIT FORM MODAL */}
      {showForm && (
        // Modal overlay (dark background)
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center p-6 border-b">
              {/* Modal title (changes based on mode) */}
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h2>

              {/* Close button */}
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal body - Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Title input */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Content textarea */}
              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your post content here..."
                  required
                />
              </div>

              {/* Form buttons */}
              <div className="flex space-x-3">
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`flex-1 py-2 px-4 rounded font-semibold text-white transition ${
                    formLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {formLoading
                    ? 'Saving...'
                    : isEditing
                    ? 'Update Post'
                    : 'Create Post'}
                </button>

                {/* Cancel button */}
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 py-2 px-4 rounded font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POSTS LIST */}
      <div className="space-y-6">
        {/* Check if there are posts */}
        {posts.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">No posts yet</p>
            <p className="mt-2">Be the first to create a post!</p>
          </div>
        ) : (
          // Render posts
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              {/* Post header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {/* Post title */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>

                  {/* Post metadata */}
                  <div className="text-sm text-gray-500">
                    By{' '}
                    <span className="font-semibold">
                      {post.author?.username || 'Unknown Author'}
                    </span>
                    {' • '}
                    {formatDate(post.createdAt)}

                    {/* Show "(edited)" if post was modified */}
                    {post.updatedAt !== post.createdAt && (
                      <span className="ml-2 text-gray-400">(edited)</span>
                    )}
                  </div>
                </div>

                {/* Edit/Delete buttons (only for post author) */}
                {canModifyPost(post) && (
                  <div className="flex space-x-2 ml-4">
                    {/* Edit button */}
                    <button
                      onClick={() => handleEditClick(post)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Post content */}
              <div className="text-gray-700 whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Export component
export default Posts;

/**
 * COMPONENT LIFECYCLE:
 *
 * 1. Component mounts
 *    ↓
 * 2. useEffect runs → fetchPosts()
 *    ↓
 * 3. Loading state shown (spinner)
 *    ↓
 * 4. API returns posts data
 *    ↓
 * 5. Posts displayed in list
 *    ↓
 * 6. User interactions:
 *    - Click "Create Post" → Show form
 *    - Click "Edit" → Show form with data
 *    - Click "Delete" → Confirm & delete
 *    - Submit form → Create/update post
 */

/**
 * STATE FLOW DIAGRAM:
 *
 * Initial State:
 * - loading: true
 * - posts: []
 * - showForm: false
 *
 * After fetchPosts():
 * - loading: false
 * - posts: [...]
 *
 * Click "Create Post":
 * - showForm: true
 * - isEditing: false
 *
 * Click "Edit":
 * - showForm: true
 * - isEditing: true
 * - editingPostId: <post.id>
 * - title: <post.title>
 * - content: <post.content>
 *
 * Submit form:
 * - formLoading: true
 * - API call
 * - formLoading: false
 * - showForm: false
 * - Refresh posts
 */
```

---

## 📁 File: `src/pages/Todos.tsx`

**Purpose:** Complete todos management page

```typescript
// React imports
import React, { useState, useEffect } from 'react';

// Import todo service
import todoService from '../api/services/todoService';

// Import types
import { Todo } from '../types/todo.types';

/**
 * TODOS PAGE COMPONENT
 */
const Todos: React.FC = () => {
  /**
   * STATE MANAGEMENT
   */

  // Todos list
  const [todos, setTodos] = useState<Todo[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form visibility
  const [showForm, setShowForm] = useState(false);

  // Form input values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  /**
   * EFFECT: Fetch todos on mount
   */
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * FETCH TODOS FUNCTION
   */
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

  /**
   * HANDLE CREATE TODO
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }

    setFormLoading(true);

    try {
      await todoService.createTodo({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });

      setSuccess('Todo created successfully!');
      await fetchTodos();
      setShowForm(false);
      setTitle('');
      setDescription('');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * TOGGLE TODO COMPLETION
   *
   * @param id - Todo ID
   * @param completed - Current completion status
   */
  const handleToggle = async (id: number, completed: boolean) => {
    try {
      // Call API to toggle
      await todoService.toggleTodo(id, !completed);

      // Update state (optimistic update)
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to toggle todo');
    }
  };

  /**
   * DELETE TODO
   *
   * @param id - Todo ID
   * @param title - Todo title (for confirmation)
   */
  const handleDelete = async (id: number, todoTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${todoTitle}"?`
    );

    if (!confirmed) return;

    try {
      await todoService.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setSuccess('Todo deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  /**
   * RENDER: LOADING STATE
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: TODOS PAGE
   */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Todos</h1>
          <p className="text-gray-600 mt-2">Keep track of your tasks</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
        >
          Add Todo
        </button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* SUCCESS ALERT */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* CREATE TODO FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Add New Todo</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter todo title"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`flex-1 py-2 px-4 rounded font-semibold text-white transition ${
                    formLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {formLoading ? 'Adding...' : 'Add Todo'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 px-4 rounded font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TODOS LIST */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">No todos yet</p>
            <p className="mt-2">Add your first todo to get started!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white rounded-lg shadow p-4 flex items-center"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />

              {/* Todo content */}
              <div className="flex-1 ml-4">
                <h3
                  className={`text-lg font-semibold ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.title}
                </h3>

                {todo.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {todo.description}
                  </p>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(todo.id, todo.title)}
                className="text-red-600 hover:text-red-800 font-semibold text-sm ml-4"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Todos;
```

---

# 10. MAIN APPLICATION FILES

## 📁 File: `src/App.tsx`

**Purpose:** Main application component with routing

```typescript
// React Router imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Todos from './pages/Todos';

// Import auth context provider
import { AuthProvider } from './contexts/AuthContext';

// Import protected route component
import ProtectedRoute from './components/ProtectedRoute';

// Import interceptors (sets up axios)
import './api/interceptors';

/**
 * APP COMPONENT
 *
 * Purpose: Root component of the application
 *
 * Responsibilities:
 * - Set up routing
 * - Provide authentication context
 * - Define all application routes
 */
function App() {
  return (
    // Wrap entire app in AuthProvider
    // This makes authentication available to all components
    <AuthProvider>
      {/* Router - Enables navigation between pages */}
      <Router>
        {/* Routes - Define all page routes */}
        <Routes>
          {/* PUBLIC ROUTES - Anyone can access */}

          {/* Home route - Redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Register page */}
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES - Require authentication */}

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Posts page */}
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />

          {/* Todos page */}
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />

          {/* 404 - Catch all unmatched routes */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

/**
 * ROUTING STRUCTURE:
 *
 * /                  → Redirect to /dashboard
 * /login             → Login page (public)
 * /register          → Register page (public)
 * /dashboard         → Dashboard (protected)
 * /posts             → Posts page (protected)
 * /todos             → Todos page (protected)
 * /*                 → 404 page
 */

/**
 * HOW PROTECTED ROUTES WORK:
 *
 * User navigates to /dashboard
 *        ↓
 * ProtectedRoute component checks authentication
 *        ↓
 * Is user logged in?
 *   ↙         ↘
 * YES         NO
 *  ↓           ↓
 * Show        Redirect
 * Dashboard   to /login
 */
```

---

## 📁 File: `src/main.tsx`

**Purpose:** Application entry point

```typescript
// React imports
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import main App component
import App from './App.tsx'

// Import global styles
import './index.css'

/**
 * APPLICATION ENTRY POINT
 *
 * This file is the first JavaScript file that runs
 * It mounts the React application to the DOM
 *
 * Process:
 * 1. Find the root element in index.html (id="root")
 * 2. Create a React root
 * 3. Render the App component
 */

// Get the root element from HTML
// This is defined in index.html: <div id="root"></div>
const rootElement = document.getElementById('root')!

// Create React root
// createRoot is the React 18 way of rendering
const root = ReactDOM.createRoot(rootElement)

// Render the application
root.render(
  // StrictMode helps find bugs during development
  // It runs some checks and warnings
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

/**
 * WHAT IS StrictMode?
 *
 * - Development-only feature
 * - Highlights potential problems
 * - Runs some components twice (to find bugs)
 * - Shows warnings in console
 * - Does NOT affect production build
 *
 * Benefits:
 * - Identifies unsafe lifecycles
 * - Warns about deprecated APIs
 * - Detects unexpected side effects
 */

/**
 * RENDER FLOW:
 *
 * 1. Browser loads index.html
 * 2. index.html includes <script> tag for this file
 * 3. This file runs
 * 4. React root created
 * 5. App component rendered
 * 6. App component renders Router
 * 7. Router renders appropriate page
 * 8. Page content displayed to user
 */
```

---

## 📁 File: `src/index.css`

**Purpose:** Global CSS styles

```css
/**
 * TAILWIND CSS DIRECTIVES
 *
 * These import Tailwind's styles
 */

/* Import Tailwind's base styles (CSS reset) */
@tailwind base;

/* Import Tailwind's component classes */
@tailwind components;

/* Import Tailwind's utility classes */
@tailwind utilities;

/**
 * GLOBAL STYLES
 *
 * Custom styles that apply across the entire app
 */

/* Apply to all elements */
* {
  margin: 0;           /* Remove default margin */
  padding: 0;          /* Remove default padding */
  box-sizing: border-box;  /* Include padding/border in width calculations */
}

/* Body styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;        /* System font stack (native OS fonts) */
  -webkit-font-smoothing: antialiased;      /* Smooth fonts on Mac/iOS */
  -moz-osx-font-smoothing: grayscale;       /* Smooth fonts on Mac */
  background-color: #f9fafb;  /* Light gray background */
}

/* Code blocks */
code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;         /* Monospace font for code */
}

/* Remove focus outline (Tailwind handles this better) */
*:focus {
  outline: none;
}

/**
 * CUSTOM UTILITY CLASSES
 *
 * Add custom utilities here if needed
 */

/* Example: Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

# 11. HTML ENTRY POINT

## 📁 File: `index.html`

**Purpose:** HTML entry point for the application

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Character encoding -->
    <meta charset="UTF-8" />

    <!-- Favicon (browser tab icon) -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />

    <!-- Responsive viewport settings -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Page title (shows in browser tab) -->
    <title>Posts App</title>
  </head>
  <body>
    <!-- Root element where React app mounts -->
    <div id="root"></div>

    <!-- Main JavaScript file -->
    <!-- type="module" enables ES6 imports -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

<!--
  LOAD SEQUENCE:

  1. Browser loads this HTML file
  2. HTML creates <div id="root"></div>
  3. Browser loads /src/main.tsx script
  4. main.tsx runs and mounts React app to #root
  5. React app renders and takes over the page
-->
```

---

# SUMMARY

## What We Built

A complete full-stack application with:

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

### Features
- User authentication (register, login, logout)
- Posts management (CRUD operations)
- Todos management (CRUD operations)
- Protected routes
- Error handling
- Loading states

### Architecture
- **API Layer** - Centralized HTTP client
- **Services Layer** - Business logic
- **Context Layer** - Global state
- **Components Layer** - Reusable UI
- **Pages Layer** - Route components

---

# LEARNING CHECKLIST

✅ **Project Setup**
- Package management with npm
- Vite build tool
- TypeScript configuration
- Tailwind CSS setup

✅ **React Fundamentals**
- Components (functional)
- Hooks (useState, useEffect, useContext)
- Props and state
- Event handling
- Conditional rendering
- Lists and keys

✅ **TypeScript**
- Interfaces
- Type safety
- Type annotations
- Generic types

✅ **React Router**
- Routing setup
- Navigation
- Protected routes
- Redirects

✅ **State Management**
- Local state (useState)
- Global state (Context API)
- Custom hooks

✅ **API Integration**
- Axios configuration
- Interceptors
- Error handling
- CRUD operations

✅ **Authentication**
- JWT tokens
- Login/Register
- Token storage
- Protected routes

✅ **Styling**
- Tailwind CSS utilities
- Responsive design
- Component styling

---

# NEXT STEPS FOR LEARNING

1. **Add Features**
   - Search functionality
   - Pagination
   - File uploads
   - Comments system

2. **Improve UX**
   - Loading skeletons
   - Optimistic updates
   - Toast notifications
   - Form validation

3. **Testing**
   - Unit tests (Jest)
   - Component tests (React Testing Library)
   - E2E tests (Cypress)

4. **Performance**
   - Code splitting
   - Lazy loading
   - Memoization
   - Bundle optimization

5. **Advanced Topics**
   - WebSockets (real-time)
   - State management libraries (Redux, Zustand)
   - Server-side rendering (Next.js)
   - Progressive Web App (PWA)

---

**END OF COMPLETE CODE GUIDE**

You now have every file I created with detailed explanations!
