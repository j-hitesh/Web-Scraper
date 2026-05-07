import { useCallback, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import AuthForm from "./components/AuthForm";
import StoryList from "./components/StoryList";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { scrapeAPI, storiesAPI } from "./services/apiService";

const DEFAULT_LIMIT = 10;

const navLinkClassName = ({ isActive }) =>
  `rounded-md px-3 py-1 text-sm ${
    isActive
      ? "bg-slate-800 text-slate-100"
      : "text-slate-200 hover:bg-slate-800"
  }`;

const Header = ({ isAuthenticated, user, onLogout, onRunScrape, scraping }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-left text-lg font-bold text-slate-100">
          HN Stories
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={navLinkClassName}>
            Stories
          </NavLink>

          {isAuthenticated ? (
            <NavLink to="/bookmarks" className={navLinkClassName}>
              Bookmarks
            </NavLink>
          ) : null}

          <button
            type="button"
            onClick={onRunScrape}
            disabled={scraping}
            className="rounded-md bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {scraping ? "Scraping..." : "Run Scrape"}
          </button>

          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-slate-400 sm:inline">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

const HomePage = ({ isAuthenticated, refreshSignal }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadStories = useCallback(async (currentPage) => {
    setLoading(true);
    setError("");
    try {
      const response = await storiesAPI.getStories(currentPage, DEFAULT_LIMIT);
      setStories(response.data.stories || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories(page);
  }, [loadStories, page, refreshSignal]);

  const handleToggleBookmark = async (storyId) => {
    try {
      await storiesAPI.toggleBookmark(storyId);
      await loadStories(page);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to toggle bookmark");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <StoryList
        title="Top Stories"
        stories={stories}
        loading={loading}
        error={error}
        emptyMessage="No stories available. Run scraper to fetch data."
        canBookmark={isAuthenticated}
        onToggleBookmark={handleToggleBookmark}
      />

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
          className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-slate-400">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

const BookmarksPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await storiesAPI.getBookmarks();
      setStories(response.data || []);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleToggleBookmark = async (storyId) => {
    try {
      await storiesAPI.toggleBookmark(storyId);
      await loadBookmarks();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to toggle bookmark");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <StoryList
        title="Your Bookmarks"
        stories={stories}
        loading={loading}
        error={error}
        emptyMessage="No bookmarked stories yet."
        canBookmark
        onToggleBookmark={handleToggleBookmark}
      />
    </section>
  );
};

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestOnlyRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = ({
  isAuthenticated,
  user,
  onLogout,
  onRunScrape,
  scraping,
  children,
}) => {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
        onRunScrape={onRunScrape}
        scraping={scraping}
      />
      {children}
    </main>
  );
};

function AppContent() {
  const { register, login, logout, loading, error, isAuthenticated, user } =
    useAuth();
  const navigate = useNavigate();
  const [scraping, setScraping] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleRunScrape = async () => {
    setScraping(true);
    try {
      await scrapeAPI.runScrape();
      setRefreshSignal((prev) => prev + 1);
      navigate("/");
    } finally {
      setScraping(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnlyRoute isAuthenticated={isAuthenticated}>
            <AuthForm
              mode="login"
              title="Login"
              submitText="Login"
              loading={loading}
              error={error}
              onSubmit={async (email, password) => {
                await login(email, password);
                navigate("/");
              }}
              switchText="Need an account? Register"
              switchTo="/register"
            />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnlyRoute isAuthenticated={isAuthenticated}>
            <AuthForm
              mode="register"
              title="Create Account"
              submitText="Register"
              loading={loading}
              error={error}
              onSubmit={async (email, password) => {
                await register(email, password);
                navigate("/");
              }}
              switchText="Already registered? Login"
              switchTo="/login"
            />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
              onRunScrape={handleRunScrape}
              scraping={scraping}
            >
              <HomePage
                isAuthenticated={isAuthenticated}
                refreshSignal={refreshSignal}
              />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
              onRunScrape={handleRunScrape}
              scraping={scraping}
            >
              <BookmarksPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
