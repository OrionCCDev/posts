/**
 * POSTS PAGE
 *
 * Purpose: Manage posts (view, create, edit, delete)
 *
 * What does this page do?
 * - Display all posts with author information
 * - Allow creating new posts
 * - Allow editing own posts
 * - Allow deleting own posts
 * - Show loading and error states
 *
 * Features:
 * - Full CRUD operations for posts
 * - Create: Add new post
 * - Read: View all posts
 * - Update: Edit existing post
 * - Delete: Remove post
 *
 * This is the main feature of the application
 */

import React, { useState, useEffect } from 'react';
import postService from '../api/services/postService';
import { useAuth } from '../contexts/AuthContext';

/**
 * TypeScript INTERFACES
 */

// Simplified User interface
interface User {
  id: number;
  username: string;
  email: string;
}

// Post interface matching Strapi response
interface Post {
  id: number;
  documentId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author?: User;
}

/**
 * POSTS COMPONENT
 */
const Posts: React.FC = () => {
  /**
   * HOOKS
   */

  // Get current user from auth context
  // We'll use this to check if user can edit/delete posts
  const { user } = useAuth();

  /**
   * STATE MANAGEMENT
   */

  // Array of all posts
  const [posts, setPosts] = useState<Post[]>([]);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Error message state
  const [error, setError] = useState<string | null>(null);

  // Success message state
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * CREATE/EDIT FORM STATE
   */

  // Is form visible? (for create/edit modal)
  const [showForm, setShowForm] = useState(false);

  // Is this an edit operation? (vs create)
  const [isEditing, setIsEditing] = useState(false);

  // ID of post being edited (null for create)
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  // Form field values
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Form loading state
  const [formLoading, setFormLoading] = useState(false);

  /**
   * FETCH POSTS EFFECT
   *
   * Purpose: Load all posts when component mounts
   *
   * Runs once when page loads
   */
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array = run once on mount

  /**
   * FETCH POSTS FUNCTION
   *
   * Purpose: Get all posts from API
   *
   * Why separate function?
   * - Can be called from multiple places
   * - After creating/editing/deleting post
   * - On initial load
   */
  const fetchPosts = async () => {
    try {
      // Call API to get all posts
      const data = await postService.getAllPosts();

      // Update state with posts
      setPosts(data);

      // Clear any error
      setError(null);
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Failed to load posts');
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  /**
   * OPEN CREATE FORM
   *
   * Purpose: Show form in create mode
   *
   * How it works:
   * 1. Clear form fields
   * 2. Set isEditing to false
   * 3. Show form modal
   */
  const handleCreateClick = () => {
    // Reset form
    setTitle('');
    setContent('');
    setEditingPostId(null);

    // Set to create mode
    setIsEditing(false);

    // Show form
    setShowForm(true);
  };

  /**
   * OPEN EDIT FORM
   *
   * Purpose: Show form in edit mode with post data
   *
   * How it works:
   * 1. Fill form fields with post data
   * 2. Set isEditing to true
   * 3. Store post ID for updating
   * 4. Show form modal
   *
   * @param post - The post to edit
   */
  const handleEditClick = (post: Post) => {
    // Fill form with post data
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post.id);

    // Set to edit mode
    setIsEditing(true);

    // Show form
    setShowForm(true);
  };

  /**
   * CLOSE FORM
   *
   * Purpose: Hide form and reset state
   */
  const handleCloseForm = () => {
    // Hide form
    setShowForm(false);

    // Reset form state
    setTitle('');
    setContent('');
    setEditingPostId(null);
    setIsEditing(false);
  };

  /**
   * FORM SUBMIT HANDLER
   *
   * Purpose: Handle both create and edit operations
   *
   * How it works:
   * 1. Validate input
   * 2. Check if creating or editing
   * 3. Call appropriate API function
   * 4. Refresh posts list
   * 5. Close form and show success message
   *
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent page reload
    e.preventDefault();

    // Validate title
    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }

    // Validate content
    if (content.trim().length === 0) {
      setError('Content is required');
      return;
    }

    // Set loading state
    setFormLoading(true);

    try {
      if (isEditing && editingPostId !== null) {
        /**
         * EDIT MODE
         * Update existing post
         */
        await postService.updatePost(editingPostId, {
          title: title.trim(),
          content: content.trim(),
        });

        // Show success message
        setSuccess('Post updated successfully!');
      } else {
        /**
         * CREATE MODE
         * Create new post
         */
        await postService.createPost({
          title: title.trim(),
          content: content.trim(),
        });

        // Show success message
        setSuccess('Post created successfully!');
      }

      // Refresh posts list to show changes
      await fetchPosts();

      // Close form
      handleCloseForm();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Failed to save post');
    } finally {
      // Stop loading
      setFormLoading(false);
    }
  };

  /**
   * DELETE POST HANDLER
   *
   * Purpose: Delete a post
   *
   * How it works:
   * 1. Show confirmation dialog
   * 2. If confirmed, call API to delete
   * 3. Refresh posts list
   * 4. Show success message
   *
   * @param postId - ID of post to delete
   * @param postTitle - Title (for confirmation message)
   */
  const handleDelete = async (postId: number, postTitle: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`
    );

    // If cancelled, stop here
    if (!confirmed) {
      return;
    }

    try {
      // Call API to delete post
      await postService.deletePost(postId);

      // Remove post from local state
      // Immediate UI update without refetching
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      // Show success message
      setSuccess('Post deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Failed to delete post');
    }
  };

  /**
   * CHECK IF USER CAN EDIT/DELETE POST
   *
   * Purpose: Determine if current user owns the post
   *
   * Users can only edit/delete their own posts
   *
   * @param post - The post to check
   * @returns true if user can edit/delete, false otherwise
   */
  const canModifyPost = (post: Post): boolean => {
    // User must be logged in
    if (!user) return false;

    // Post must have an author
    if (!post.author) return false;

    // Check if current user is the author
    return user.id === post.author.id;
  };

  /**
   * FORMAT DATE
   *
   * Purpose: Convert ISO date string to readable format
   *
   * Example: "2024-01-15T10:30:00.000Z" → "January 15, 2024"
   *
   * @param dateString - ISO date string from Strapi
   * @returns Formatted date string
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
   * LOADING STATE
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER POSTS PAGE
   */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
          <p className="text-gray-600 mt-2">
            Share your thoughts with the community
          </p>
        </div>

        {/* Create Post Button */}
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
        >
          Create Post
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/*
        CREATE/EDIT FORM MODAL
        Shown when showForm is true
      */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal Card */}
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Title Input */}
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

              {/* Content Textarea */}
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

              {/* Form Buttons */}
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
                  {formLoading
                    ? 'Saving...'
                    : isEditing
                    ? 'Update Post'
                    : 'Create Post'}
                </button>
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

      {/*
        POSTS LIST
        Display all posts in cards
      */}
      <div className="space-y-6">
        {/* Check if there are any posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">No posts yet</p>
            <p className="mt-2">Be the first to create a post!</p>
          </div>
        ) : (
          // Map through posts and create a card for each
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              {/* Post Header - Title and Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {/* Author information */}
                    By{' '}
                    <span className="font-semibold">
                      {post.author?.username || 'Unknown'}
                    </span>
                    {' • '}
                    {formatDate(post.createdAt)}
                    {/* Show "edited" if post was updated */}
                    {post.updatedAt !== post.createdAt && (
                      <span className="ml-2 text-gray-400">(edited)</span>
                    )}
                  </div>
                </div>

                {/*
                  Action Buttons (Edit/Delete)
                  Only shown if user can modify this post
                */}
                {canModifyPost(post) && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Post Content */}
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
 * LEARNING NOTES
 *
 * Modal Pattern:
 * - Fixed position with overlay (dark background)
 * - Centered content card
 * - Prevents interaction with background
 * - Can be closed with button or pressing outside (if implemented)
 *
 * Single Form for Create and Edit:
 * - Same form used for both operations
 * - isEditing flag determines behavior
 * - Reduces code duplication
 * - Consistent UI experience
 *
 * Optimistic UI Updates:
 * - After delete, immediately update local state
 * - Don't wait for refetch
 * - Faster user experience
 * - Reduces API calls
 *
 * Authorization:
 * - Check user ownership before showing edit/delete buttons
 * - Server should also verify (don't trust client-side only)
 * - Strapi policies handle server-side authorization
 *
 * Date Formatting:
 * - Use JavaScript Date object
 * - toLocaleDateString for readable format
 * - Can be customized with locales and options
 */
