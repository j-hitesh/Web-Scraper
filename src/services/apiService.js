import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),

  signup: (email, password) =>
    api.post("/api/auth/signup", { email, password }),
};

// Post APIs
export const postsAPI = {
  createPost: (postData) => api.post("/api/posts", postData),

  getPosts: () => api.get("/api/posts"),

  getPost: (id) => api.get(`/api/posts/${id}`),

  updatePost: (id, postData) => api.put(`/api/posts/${id}`, postData),

  deletePost: (id) => api.delete(`/api/posts/${id}`),
};

// Bookmark APIs
export const bookmarksAPI = {
  getBookmarks: () => api.get("/api/bookmarks"),
  addBookmark: (postId) => api.post("/api/bookmarks", { postId }),
  removeBookmark: (postId) => api.delete(`/api/bookmarks/${postId}`),
};

export default api;
