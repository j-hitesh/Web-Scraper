import React, { useState, useEffect } from "react";
import { postsAPI, bookmarksAPI } from "../services/apiService";

const PostsList = ({ refreshTrigger, onBookmarkToggle }) => {
  const [posts, setPosts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const normalizeBookmarks = (items) => {
    return items.map((item) => item.post || item);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [postsResponse, bookmarksResponse] = await Promise.all([
        postsAPI.getPosts(),
        bookmarksAPI.getBookmarks(),
      ]);

      setPosts(postsResponse.data);
      const bookmarkPosts = normalizeBookmarks(bookmarksResponse.data);
      setBookmarkedIds(new Set(bookmarkPosts.map((post) => post._id)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (postId) => {
    setBookmarkLoadingId(postId);
    setError(null);

    try {
      if (bookmarkedIds.has(postId)) {
        await bookmarksAPI.removeBookmark(postId);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await bookmarksAPI.addBookmark(postId);
        setBookmarkedIds((prev) => new Set(prev).add(postId));
      }
      onBookmarkToggle?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bookmark");
    } finally {
      setBookmarkLoadingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Loading posts...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
        <p className="text-lg">No posts yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
      {posts.map((post) => {
        const isBookmarked = bookmarkedIds.has(post._id);
        return (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-blue-600 hover:text-blue-800 break-all"
              >
                {post.title}
              </a>
              <button
                onClick={() => toggleBookmark(post._id)}
                disabled={bookmarkLoadingId === post._id}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${isBookmarked ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} disabled:opacity-50`}
              >
                {bookmarkLoadingId === post._id
                  ? "Updating..."
                  : isBookmarked
                    ? "Bookmarked"
                    : "Bookmark"}
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-3">{post.url}</p>

            <div className="flex justify-between items-center text-gray-500 text-sm flex-wrap gap-4">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">
                    {post.points}
                  </span>{" "}
                  points
                </p>
                <p>
                  by{" "}
                  <span className="font-semibold text-gray-700">
                    {post.author}
                  </span>
                </p>
              </div>
              <p>{formatDate(post.postedAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsList;
