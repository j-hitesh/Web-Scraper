import React, { useState, useEffect } from "react";
import { bookmarksAPI } from "../services/apiService";

const normalizeBookmarks = (items) => {
  return items.map((item) => item.post || item);
};

const Bookmarks = ({ refreshTrigger }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, [refreshTrigger]);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await bookmarksAPI.getBookmarks();
      setBookmarks(normalizeBookmarks(response.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (postId) => {
    setRemovingId(postId);
    setError(null);

    try {
      await bookmarksAPI.removeBookmark(postId);
      setBookmarks((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove bookmark");
    } finally {
      setRemovingId(null);
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

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading bookmarks...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
        <p className="text-lg">
          No bookmarks yet. Add some stories to your bookmarks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Bookmarked Stories
      </h2>
      {bookmarks.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-2 gap-4 flex-wrap">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 break-all"
            >
              {post.title}
            </a>
            <button
              onClick={() => removeBookmark(post._id)}
              disabled={removingId === post._id}
              className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {removingId === post._id ? "Removing..." : "Remove Bookmark"}
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
      ))}
    </div>
  );
};

export default Bookmarks;
