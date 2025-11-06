// src/pages/Posts.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../api/services/postService";
import { FlatPost } from "../types/post.types";

// ============================================
// POSTS PAGE COMPONENT
// ============================================
// Purpose: View all posts, create new posts, delete posts
// Full CRUD demonstration
const Posts = () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  const [posts, setPosts] = useState<FlatPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingPost, setEditingPost] = useState<FlatPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleEditPost = (post: FlatPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setShowForm(true); // Reuse the same form
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPost) return;

    try {
      setCreating(true);

      const updated = await postService.update(editingPost.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });

      // Update in list
      setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));

      // Reset form
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
      setShowForm(false);

      alert("Post updated successfully!");
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update post");
    } finally {
      setCreating(false);
    }
  };

  // Form fields state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // LOAD POSTS ON MOUNT
  // ==========================================
  useEffect(() => {
    loadPosts();
  }, []);

  // ==========================================
  // LOAD POSTS FUNCTION
  // ==========================================
  // Purpose: Fetch all posts with author data
  const loadPosts = async () => {
    try {
      setLoading(true);

      // Fetch all posts with author populated
      // postService.getAll() calls:
      // GET /api/posts?populate=author
      const data = await postService.getAll();

      // Update state
      setPosts(data);

      console.log("✅ Loaded posts from Strapi:", data.length);
    } catch (error) {
      console.error("❌ Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CREATE POST HANDLER
  // ==========================================
  // Purpose: Handle form submission to create new post
  const handleCreatePost = async (e: React.FormEvent) => {
    // Prevent form default behavior
    e.preventDefault();

    // Validate inputs
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setCreating(true);

      // Create post via API
      // postService.create() calls:
      // POST /api/posts
      // Body: { data: { title, content, author: currentUserId } }
      const newPost = await postService.create({
        title: title.trim(),
        content: content.trim(),
      });

      console.log("✅ Post created:", newPost);

      // Add new post to beginning of list
      // Spread operator [...] creates new array
      // [newPost, ...posts] = new post first, then old posts
      setPosts([newPost, ...posts]);

      // Reset form
      setTitle("");
      setContent("");
      setShowForm(false);

      alert("Post created successfully!");
    } catch (error) {
      console.error("❌ Failed to create post:", error);
      alert("Failed to create post. Make sure you have permission.");
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // DELETE POST HANDLER
  // ==========================================
  // Purpose: Delete post by ID
  // Note: User can only delete their own posts (Strapi checks)
  const handleDeletePost = async (id: number) => {
    // Confirm before deleting
    // window.confirm() shows browser confirmation dialog
    // Returns true if OK clicked, false if Cancel
    if (!confirm("Are you sure you want to delete this post?")) {
      return; // Exit if user cancels
    }

    try {
      // Delete via API
      // postService.delete() calls: DELETE /api/posts/:id
      await postService.delete(id);

      console.log("✅ Post deleted:", id);

      // Remove from local list
      // .filter() creates new array without deleted post
      // Keep all posts where post.id !== id
      setPosts(posts.filter((post) => post.id !== id));

      alert("Post deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete post:", error);
      alert("Failed to delete post. You can only delete your own posts.");
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="card text-center">
          <div className="spinner" style={{ margin: "0 auto" }}></div>
          <p className="mt-2">Loading posts from Strapi...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div className="card">
        {/* ---------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------- */}
        <div className="flex justify-between items-center mb-4">
          <h1>All Posts ({posts.length})</h1>

          <div className="flex gap-2">
            {/* Toggle form button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className={`btn ${showForm ? "btn-secondary" : "btn-success"}`}
            >
              {showForm ? "Cancel" : "+ Create Post"}
            </button>

            {/* Back button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-secondary"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* ---------------------------------------- */}
        {/* CREATE FORM (Conditional) */}
        {/* ---------------------------------------- */}
        {showForm && (
          <form
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            className="card mb-3"
          >
            <h3 className="mb-2">
              {editingPost ? "Edit Post" : "Create New Post"}
            </h3>

            <div className="mb-2">
              <label>
                Title:
                <input
                  type="text"
                  value={editingPost ? editTitle : title}
                  onChange={(e) =>
                    editingPost
                      ? setEditTitle(e.target.value)
                      : setTitle(e.target.value)
                  }
                  required
                  className="w-full"
                />
              </label>
            </div>

            <div className="mb-2">
              <label>
                Content:
                <textarea
                  value={editingPost ? editContent : content}
                  onChange={(e) =>
                    editingPost
                      ? setEditContent(e.target.value)
                      : setContent(e.target.value)
                  }
                  required
                  rows={5}
                  className="w-full"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="btn btn-primary"
              >
                {creating
                  ? "Saving..."
                  : editingPost
                  ? "Update Post"
                  : "Create Post"}
              </button>

              {editingPost && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setEditTitle("");
                    setEditContent("");
                  }}
                  className="btn btn-secondary"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        {/* ---------------------------------------- */}
        {/* POSTS LIST OR EMPTY STATE */}
        {/* ---------------------------------------- */}
        {posts.length === 0 ? (
          // Empty state
          <div className="card text-center" style={{ padding: "40px" }}>
            <h3>No posts yet</h3>
            <p className="text-secondary">Be the first to create a post!</p>
          </div>
        ) : (
          // Posts list
          <div className="flex flex-col gap-2">
            {posts.map((post) => (
              <div key={post.id} className="card">
                <div className="flex justify-between items-start">
                  {/* Post content */}
                  <div style={{ flex: 1 }}>
                    <h3 className="mb-1">{post.title}</h3>

                    {/* Render HTML content */}
                    <div
                      className="text-secondary mb-2"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Post metadata */}
                    <div className="text-sm text-light">
                      <p>
                        <strong>Author:</strong>{" "}
                        {post.author?.username || "Unknown"}
                      </p>
                      <p>
                        <strong>Posted:</strong>{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
