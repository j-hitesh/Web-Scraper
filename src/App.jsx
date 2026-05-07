import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import PostForm from "./components/PostForm";
import PostsList from "./components/PostsList";
import Bookmarks from "./components/Bookmarks";

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [activePage, setActivePage] = useState("feed");

  const handlePostCreated = () => {
    setRefreshPosts((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshPosts((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={() => {
          // App will re-render with new auth state
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">News Feed</h1>
            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setActivePage("feed")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${activePage === "feed" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Feed
            </button>
            <button
              onClick={() => setActivePage("bookmarks")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${activePage === "bookmarks" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Bookmarks
            </button>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {activePage === "feed" ? (
          <>
            <PostForm onPostCreated={handlePostCreated} />
            <PostsList
              refreshTrigger={refreshPosts}
              onBookmarkToggle={handleRefresh}
            />
          </>
        ) : (
          <Bookmarks refreshTrigger={refreshPosts} />
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
