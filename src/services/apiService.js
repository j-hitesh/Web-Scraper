import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const storiesAPI = {
  getStories: (page, limit) => api.get("/stories", { params: { page, limit } }),
  createStory: (payload) => api.post("/stories", payload),
  getStoryById: (id) => api.get(`/stories/${id}`),
  toggleBookmark: (id) => api.post(`/stories/${id}/bookmark`),
  getBookmarks: () => api.get("/stories/bookmarks"),
};

export const scrapeAPI = {
  runScrape: () => api.post("/scrape"),
};

export default api;
