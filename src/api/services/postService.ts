/**
 * POST SERVICE
 *
 * Purpose: Handle all post-related CRUD operations
 *
 * What are posts?
 * - Content created by users (like blog posts, articles, status updates)
 * - Each post has a title, content, and is linked to a user (author)
 *
 * This service manages posts through the Strapi API
 */

import axiosInstance from '../axios';

/**
 * TypeScript INTERFACES
 *
 * Define the structure of post-related data
 */

// Interface for user data (simplified version)
interface User {
  id: number;
  username: string;
  email: string;
}

// Interface for a Post
// This matches what Strapi returns
interface Post {
  id: number;              // Unique post ID
  documentId?: string;     // Strapi's document ID (Strapi v4+)
  title: string;           // Post title
  content: string;         // Post content/body
  createdAt: string;       // When post was created (ISO date string)
  updatedAt: string;       // When post was last updated
  publishedAt?: string;    // When post was published (optional)
  author?: User;           // User who created the post
}

// Interface for creating a new post
interface CreatePostData {
  title: string;    // Post title
  content: string;  // Post content
}

// Interface for updating a post
interface UpdatePostData {
  title?: string;   // Optional: new title
  content?: string; // Optional: new content
}

// Interface for Strapi's API response format
// Strapi v4 wraps data in { data: ... } format
interface StrapiResponse<T> {
  data: T;         // The actual data
  meta?: any;      // Metadata (pagination, etc.)
}

/**
 * UTILITY FUNCTION: Convert plain text to Strapi rich text format
 *
 * Strapi's rich text editor expects content as an array of blocks
 * This function converts plain text string to that format
 *
 * @param text - Plain text content
 * @returns Rich text array format for Strapi
 */
const convertToRichText = (text: string): any[] => {
  // Split text by newlines to create separate paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

  // If no content, return empty paragraph
  if (paragraphs.length === 0) {
    return [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '' }]
      }
    ];
  }

  // Convert each paragraph to rich text format
  return paragraphs.map(paragraph => ({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: paragraph
      }
    ]
  }));
};

/**
 * POST SERVICE OBJECT
 *
 * Contains all functions for post management
 */
const postService = {
  /**
   * GET ALL POSTS FUNCTION
   *
   * Purpose: Fetch all posts from the database
   *
   * How it works:
   * 1. Make GET request to /api/posts
   * 2. Include 'populate' parameter to get author information too
   * 3. Strapi returns array of posts with author data
   * 4. Return the posts
   *
   * What is 'populate'?
   * - Strapi feature to include related data
   * - Without it, we only get the author ID
   * - With it, we get full author information (username, email, etc.)
   *
   * When to use:
   * - Displaying list of all posts on home page
   * - Posts feed
   *
   * @returns Promise with array of posts
   */
  getAllPosts: async (): Promise<Post[]> => {
    try {
      // Make GET request with query parameters
      // populate=author tells Strapi to include author information
      const response = await axiosInstance.get<StrapiResponse<Post[]>>(
        '/api/posts?populate=author'
      );

      // Strapi v4 wraps data in { data: ... } format
      // Extract the actual posts array
      return response.data.data;
    } catch (error: any) {
      // Log error for debugging
      console.error('Error fetching posts:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch posts';

      throw new Error(errorMessage);
    }
  },

  /**
   * GET POST BY ID FUNCTION
   *
   * Purpose: Fetch a specific post by its ID
   *
   * How it works:
   * 1. Make GET request to /api/posts/:id
   * 2. Include author data with populate
   * 3. Strapi returns the specific post
   * 4. Return the post
   *
   * When to use:
   * - Viewing a single post page
   * - Getting post details before editing
   *
   * @param id - The ID of the post to fetch
   * @returns Promise with post data
   */
  getPostById: async (id: number): Promise<Post> => {
    try {
      // Make GET request with post ID in URL
      const response = await axiosInstance.get<StrapiResponse<Post>>(
        `/api/posts/${id}?populate=author`
      );

      // Extract the post from response
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching post:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch post';

      throw new Error(errorMessage);
    }
  },

  /**
   * GET POSTS BY USER FUNCTION
   *
   * Purpose: Fetch all posts created by a specific user
   *
   * How it works:
   * 1. Make GET request to /api/posts
   * 2. Add filter for specific author ID
   * 3. Strapi returns only posts by that user
   * 4. Return filtered posts
   *
   * What are filters?
   * - Query parameters that filter results
   * - Like saying "only show posts where author.id = 5"
   *
   * When to use:
   * - User profile page showing their posts
   * - "My posts" section
   *
   * @param userId - The ID of the user whose posts to fetch
   * @returns Promise with array of posts
   */
  getPostsByUser: async (userId: number): Promise<Post[]> => {
    try {
      // Make GET request with filter parameter
      // filters[author][id][$eq] means "where author.id equals userId"
      // $eq is Strapi's "equals" operator
      const response = await axiosInstance.get<StrapiResponse<Post[]>>(
        `/api/posts?filters[author][id][$eq]=${userId}&populate=author`
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user posts:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to fetch user posts';

      throw new Error(errorMessage);
    }
  },

  /**
   * CREATE POST FUNCTION
   *
   * Purpose: Create a new post
   *
   * How it works:
   * 1. Make POST request to /api/posts with post data
   * 2. Strapi automatically links post to authenticated user
   * 3. Strapi creates post in database
   * 4. Returns the created post
   *
   * Important:
   * - User must be authenticated (token in header)
   * - Strapi determines author from the token
   * - We don't manually set the author
   *
   * When to use:
   * - User creating a new post
   * - "Create Post" form submission
   *
   * @param data - Object with title and content
   * @returns Promise with created post data
   */
  createPost: async (data: CreatePostData): Promise<Post> => {
    try {
      // Convert plain text content to Strapi rich text format
      // Strapi's rich text field expects an array of paragraph blocks
      const richTextContent = convertToRichText(data.content);

      // Prepare data with rich text content
      const postData = {
        title: data.title,
        content: richTextContent  // Send as rich text array
      };

      // Make POST request with post data
      // Strapi v4 expects data wrapped in { data: ... }
      const response = await axiosInstance.post<StrapiResponse<Post>>(
        '/api/posts?populate=author',
        { data: postData }  // Wrap data as required by Strapi v4
      );

      console.log('Post created successfully:', response.data);

      return response.data.data;
    } catch (error: any) {
      // Enhanced error logging for debugging
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);

      // Extract detailed error message from Strapi response
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        'Failed to create post';

      throw new Error(errorMessage);
    }
  },

  /**
   * UPDATE POST FUNCTION
   *
   * Purpose: Modify an existing post
   *
   * How it works:
   * 1. Make PUT request to /api/posts/:id with new data
   * 2. Strapi updates the post in database
   * 3. Returns updated post data
   *
   * Security:
   * - User can only update their own posts
   * - Strapi checks if authenticated user is the post author
   *
   * When to use:
   * - User editing their post
   * - Updating post content or title
   *
   * @param id - The ID of the post to update
   * @param data - Object with fields to update (title, content)
   * @returns Promise with updated post data
   */
  updatePost: async (id: number, data: UpdatePostData): Promise<Post> => {
    try {
      // Prepare update data with rich text conversion if content is being updated
      const updateData: any = {
        ...(data.title && { title: data.title })
      };

      // If content is being updated, convert it to rich text format
      if (data.content !== undefined) {
        updateData.content = convertToRichText(data.content);
      }

      // Make PUT request with post ID and new data
      // PUT is for updating existing resources
      const response = await axiosInstance.put<StrapiResponse<Post>>(
        `/api/posts/${id}?populate=author`,
        { data: updateData }  // Wrap data for Strapi v4
      );

      console.log('Post updated successfully:', response.data);

      return response.data.data;
    } catch (error: any) {
      console.error('Error updating post:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to update post';

      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE POST FUNCTION
   *
   * Purpose: Remove a post from the database
   *
   * How it works:
   * 1. Make DELETE request to /api/posts/:id
   * 2. Strapi removes post from database
   * 3. Returns success status
   *
   * Security:
   * - User can only delete their own posts
   * - Strapi verifies post ownership
   *
   * Important:
   * - This permanently deletes the post
   * - Cannot be undone
   *
   * When to use:
   * - User deleting their post
   * - "Delete" button click
   *
   * @param id - The ID of the post to delete
   * @returns Promise that resolves when deletion is complete
   */
  deletePost: async (id: number): Promise<void> => {
    try {
      // Make DELETE request with post ID
      await axiosInstance.delete(`/api/posts/${id}`);

      console.log('Post deleted successfully');

      // No return value needed
      // Success means post was deleted
    } catch (error: any) {
      console.error('Error deleting post:', error);

      const errorMessage =
        error.response?.data?.error?.message || 'Failed to delete post';

      throw new Error(errorMessage);
    }
  },
};

// Export the service for use in other files
export default postService;
