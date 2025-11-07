/**
 * POSTS PAGE - FIXED VERSION
 *
 * Purpose: Manage posts (view, create, edit, delete)
 * This version handles Strapi v4 API format and both plain text and rich text content
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
  content: string | any; // Can be string or rich text array
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author?: User;
}

/**
 * UTILITY FUNCTION: Extract plain text from rich text content
 *
 * Strapi's rich text editor stores content as JSON array
 * This function converts it to plain text
 */
const extractTextFromRichText = (content: any): string => {
  // If content is already a string, return it
  if (typeof content === 'string') {
    return content;
  }

  // If content is null or undefined, return empty string
  if (!content) {
    return '';
  }

  // If content is an array (rich text format)
  if (Array.isArray(content)) {
    let text = '';

    // Loop through each block
    content.forEach((block: any) => {
      if (block.children && Array.isArray(block.children)) {
        // Loop through children and extract text
        block.children.forEach((child: any) => {
          if (child.text) {
            text += child.text + ' ';
          }
        });
      }
    });

    return text.trim();
  }

  // If we can't parse it, return empty string
  return '';
};

/**
 * POSTS COMPONENT
 */
const Posts: React.FC = () => {
  const { user } = useAuth();

  // State management
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create/Edit form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  /**
   * FETCH POSTS
   */
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      console.log('📦 Raw posts data:', data);

      // Content is already plain text from Strapi
      // No need to process, just use directly
      setPosts(data);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  /**
   * OPEN CREATE FORM
   */
  const handleCreateClick = () => {
    setTitle('');
    setContent('');
    setEditingPostId(null);
    setIsEditing(false);
    setShowForm(true);
  };

  /**
   * OPEN EDIT FORM
   */
  const handleEditClick = (post: Post) => {
    setTitle(post.title);
    setContent(post.content as string); // Content is already plain text
    setEditingPostId(post.id);
    setIsEditing(true);
    setShowForm(true);
  };

  /**
   * CLOSE FORM
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setTitle('');
    setContent('');
    setEditingPostId(null);
    setIsEditing(false);
  };

  /**
   * FORM SUBMIT
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }

    if (content.trim().length === 0) {
      setError('Content is required');
      return;
    }

    setFormLoading(true);

    try {
      if (isEditing && editingPostId !== null) {
        await postService.updatePost(editingPostId, {
          title: title.trim(),
          content: content.trim(),
        });
        setSuccess('Post updated successfully!');
      } else {
        // Create post with author ID
        await postService.createPost({
          title: title.trim(),
          content: content.trim(),
          author: user?.id, // Include author ID from authenticated user
        });
        setSuccess('Post created successfully!');
      }

      await fetchPosts();
      handleCloseForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('❌ Error saving post:', err);
      setError(err.message || 'Failed to save post');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * DELETE POST
   */
  const handleDelete = async (postId: number, postTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await postService.deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSuccess('Post deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
    }
  };

  /**
   * CHECK IF USER CAN MODIFY POST
   */
  const canModifyPost = (post: Post): boolean => {
    if (!user) return false;
    if (!post.author) return false;
    return user.id === post.author.id;
  };

  /**
   * FORMAT DATE
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
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* CREATE/EDIT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

            <form onSubmit={handleSubmit} className="p-6">
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

      {/* POSTS LIST */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">No posts yet</p>
            <p className="mt-2">Be the first to create a post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    By{' '}
                    <span className="font-semibold">
                      {post.author?.username || 'Unknown Author'}
                    </span>
                    {' • '}
                    {formatDate(post.createdAt)}
                    {post.updatedAt !== post.createdAt && (
                      <span className="ml-2 text-gray-400">(edited)</span>
                    )}
                  </div>
                </div>

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

export default Posts;
