// src/api/services/postService.ts
import api from '../interceptors';
import { StrapiCollectionResponse } from '../../types/user.types';
import { Post, FlatPost } from '../../types/post.types';

// ============================================
// HELPER FUNCTION: FLATTEN STRAPI POST
// ============================================
// Purpose: Convert Strapi's nested structure to flat structure
// Why: Easier to work with in React components
// Input: Strapi post with nested data.attributes
// Output: Flat post with direct properties

/*
STRAPI STRUCTURE (nested):
{
  id: 1,
  attributes: {
    title: "Post Title",
    content: "Content...",
    author: {
      data: {
        id: 1,
        attributes: {
          username: "john",
          email: "john@example.com"
        }
      }
    }
  }
}

FLAT STRUCTURE (easier):
{
  id: 1,
  title: "Post Title",
  content: "Content...",
  author: {
    id: 1,
    username: "john",
    email: "john@example.com"
  }
}
*/

const flattenPost = (strapiPost: any): FlatPost => {
  return {
    // ID is at root level
    id: strapiPost.id,
    
    // All other fields in attributes
    title: strapiPost.attributes.title,
    content: strapiPost.attributes.content,
    createdAt: strapiPost.attributes.createdAt,
    updatedAt: strapiPost.attributes.updatedAt,
    publishedAt: strapiPost.attributes.publishedAt,
    
    // Flatten author if exists
    // Optional chaining (?.) prevents errors if author is null
    author: strapiPost.attributes.author?.data
      ? {
          id: strapiPost.attributes.author.data.id,
          // Spread operator (...) copies all properties
          ...strapiPost.attributes.author.data.attributes,
        }
      : undefined,
  };
};

// ============================================
// POST SERVICE
// ============================================
// Purpose: Handle all post-related API operations
// Why: CRUD operations for posts, centralized logic

export const postService = {
  
  // ==========================================
  // GET ALL POSTS
  // ==========================================
  // Purpose: Fetch all posts with author information
  // Endpoint: GET /api/posts?populate=author
  // Returns: Promise<FlatPost[]> (flattened array)
  // Query parameter ?populate=author tells Strapi to include author relation
  getAll: async (): Promise<FlatPost[]> => {
    try {
      // ----------------------------------------
      // STRAPI POPULATE PARAMETER
      // ----------------------------------------
      // Purpose: Include related data in response
      // Without populate: author field is null
      // With populate=author: author data included
      // Syntax: ?populate=fieldName
      // Multiple: ?populate[0]=author&populate[1]=comments
      
      const response = await api.get<StrapiCollectionResponse<Post>>(
        '/posts?populate=author'
      );

      // ----------------------------------------
      // TRANSFORM STRAPI RESPONSE
      // ----------------------------------------
      // response.data.data is array of Strapi posts
      // .map() transforms each post
      // flattenPost() converts Strapi structure to flat structure
      return response.data.data.map(flattenPost);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  },

  // ==========================================
  // GET POSTS BY USER
  // ==========================================
  // Purpose: Fetch posts created by specific user
  // Endpoint: GET /api/posts?filters[author][id][$eq]=userId&populate=author
  // Parameters: userId (author ID to filter by)
  // Returns: Promise<FlatPost[]>
  getByUser: async (userId: number): Promise<FlatPost[]> => {
    try {
      // ----------------------------------------
      // STRAPI FILTERING
      // ----------------------------------------
      // Purpose: Filter results based on criteria
      // Syntax: filters[field][subfield][operator]=value
      // [author][id][$eq]=userId means:
      //   - Filter by author relation
      //   - Where author's id
      //   - Equals userId
      // $eq = equals operator (Strapi uses $ prefix for operators)
      
      // Other operators:
      // $ne = not equal
      // $gt = greater than
      // $lt = less than
      // $contains = contains text
      
      const response = await api.get<StrapiCollectionResponse<Post>>(
        `/posts?filters[author][id][$eq]=${userId}&populate=author`
      );

      return response.data.data.map(flattenPost);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      throw error;
    }
  },

  // ==========================================
  // GET SINGLE POST BY ID
  // ==========================================
  // Purpose: Fetch one specific post
  // Endpoint: GET /api/posts/:id?populate=author
  // Parameters: id (post ID)
  // Returns: Promise<FlatPost>
  getById: async (id: number): Promise<FlatPost> => {
    try {
      // Single item response structure is slightly different
      // Returns: { data: { id, attributes: {...} } }
      // Not an array, just one object
      const response = await api.get<{ data: any }>(
        `/posts/${id}?populate=author`
      );

      // Flatten single post
      return flattenPost(response.data.data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      throw error;
    }
  },

  // ==========================================
  // CREATE POST
  // ==========================================
  // Purpose: Create new post
  // Endpoint: POST /api/posts
  // Parameters: postData (title, content)
  // Returns: Promise<FlatPost> (created post)
  // Auth: Token required (user must be logged in)
  create: async (postData: Omit<Post, 'id'>): Promise<FlatPost> => {
    try {
      // ----------------------------------------
      // GET CURRENT USER
      // ----------------------------------------
      // Purpose: Set current user as post author
      // Get user from localStorage (saved during login)
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      // ----------------------------------------
      // STRAPI CREATE FORMAT
      // ----------------------------------------
      // Strapi requires data to be wrapped in { data: {...} }
      // This is Strapi v4 convention
      // Content must be nested inside "data" key
      
      const response = await api.post<{ data: any }>('/posts', {
        data: {
          title: postData.title,
          content: postData.content,
          author: user.id,  // Connect to current user by ID
        },
      });

      // Flatten and return created post
      return flattenPost(response.data.data);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  },

  // ==========================================
  // UPDATE POST
  // ==========================================
  // Purpose: Update existing post
  // Endpoint: PUT /api/posts/:id
  // Parameters:
  //   - id: post ID to update
  //   - postData: fields to update
  // Returns: Promise<FlatPost> (updated post)
  // Note: User can only update their own posts (Strapi checks ownership)
  update: async (id: number, postData: Partial<Post>): Promise<FlatPost> => {
    try {
      // PUT request updates entire resource
      // Data must be wrapped in { data: {...} }
      const response = await api.put<{ data: any }>(`/posts/${id}`, {
        data: postData,
      });

      return flattenPost(response.data.data);
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  },

  // ==========================================
  // DELETE POST
  // ==========================================
  // Purpose: Delete post
  // Endpoint: DELETE /api/posts/:id
  // Parameters: id (post ID to delete)
  // Returns: Promise<void> (nothing)
  // Note: User can only delete their own posts
  delete: async (id: number): Promise<void> => {
    try {
      // DELETE request removes resource
      // No response body typically
      await api.delete(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  },
};

// ============================================
// HOW TO USE POST SERVICE
// ============================================
/*
In a component:

import { postService } from './api/services/postService';

// Get all posts
const loadPosts = async () => {
  const posts = await postService.getAll();
  console.log('Posts:', posts);
  setPosts(posts);
};

// Get user's posts
const loadMyPosts = async () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const myPosts = await postService.getByUser(currentUser.id);
  console.log('My posts:', myPosts);
};

// Create post
const createPost = async () => {
  const newPost = await postService.create({
    title: 'My New Post',
    content: 'Post content here...'
  });
  console.log('Created:', newPost);
};

// Update post
const updatePost = async (postId: number) => {
  const updated = await postService.update(postId, {
    title: 'Updated Title'
  });
  console.log('Updated:', updated);
};

// Delete post
const deletePost = async (postId: number) => {
  await postService.delete(postId);
  console.log('Deleted post:', postId);
};
*/

// ============================================
// STRAPI RELATIONSHIPS EXPLAINED
// ============================================
/*
WHAT IS A RELATION?
===================
A relation connects two content types
Example: Post → Author (User)

In Strapi:
- Post has "author" field
- Type: Relation
- Target: User
- Cardinality: Many-to-One (many posts, one author)

HOW IT WORKS:
=============
1. Create Post in Strapi admin
2. Select author from dropdown
3. Strapi stores author ID in post
4. When you fetch post, you can populate author data

WITHOUT POPULATE:
{
  id: 1,
  title: "Post",
  author: null  // Just null
}

WITH POPULATE:
{
  id: 1,
  title: "Post",
  author: {
    data: {
      id: 1,
      attributes: {
        username: "john",
        email: "john@example.com"
      }
    }
  }
}

POPULATE OPTIONS:
=================
// Populate one field
?populate=author

// Populate multiple fields
?populate[0]=author&populate[1]=comments

// Populate nested relations
?populate[author][populate][0]=avatar

// Populate all fields (not recommended for performance)
?populate=*
*/