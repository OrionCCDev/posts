/**
 * DIAGNOSTIC POSTS PAGE
 * This is a temporary version to help debug the issue
 */

import React, { useState, useEffect } from 'react';
import postService from '../api/services/postService';
import { useAuth } from '../contexts/AuthContext';

const Posts: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('🔍 Starting to fetch posts...');
      console.log('👤 Current user:', user);

      try {
        const data = await postService.getAllPosts();
        console.log('✅ Posts fetched successfully:', data);
        setPosts(data);
        setDebugInfo({ success: true, count: data.length, data });
        setError(null);
      } catch (err: any) {
        console.error('❌ Error fetching posts:', err);
        console.error('Error details:', err.response?.data);
        setError(err.message || 'Failed to load posts');
        setDebugInfo({
          success: false,
          error: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log('📊 Current state:', { loading, error, postsCount: posts.length });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Posts - Debug Mode</h1>

      {/* Debug Info Panel */}
      <div className="bg-gray-100 border border-gray-300 rounded p-4 mb-6">
        <h2 className="font-bold mb-2">🔍 Debug Information:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {/* User Info */}
      <div className="bg-blue-100 border border-blue-300 rounded p-4 mb-6">
        <h2 className="font-bold mb-2">👤 Current User:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Posts Count */}
      <div className="bg-green-100 border border-green-300 rounded p-4 mb-6">
        <p className="font-bold">Posts Found: {posts.length}</p>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-lg">No posts found</p>
            <p className="mt-2">
              This could mean:
              <br />
              1. No posts exist in Strapi yet
              <br />
              2. API permissions are not configured
              <br />
              3. The Posts collection doesn't exist in Strapi
            </p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={post.id || index} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {post.title || 'No Title'}
              </h2>
              <div className="text-sm text-gray-500 mb-4">
                By {post.author?.username || 'Unknown'}
              </div>
              <div className="text-gray-700 whitespace-pre-wrap">
                {post.content || 'No Content'}
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Show raw post data
                </summary>
                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(post, null, 2)}
                </pre>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
