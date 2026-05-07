import StoryCard from './StoryCard';

const StoryList = ({ title, stories, loading, error, emptyMessage, canBookmark, onToggleBookmark }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-100">{title}</h2>

      {loading ? <p className="mt-4 text-slate-400">Loading stories...</p> : null}
      {error ? (
        <p className="mt-4 rounded-md border border-rose-700 bg-rose-950/30 px-3 py-2 text-rose-200">
          {error}
        </p>
      ) : null}
      {!loading && !error && stories.length === 0 ? (
        <p className="mt-4 text-slate-400">{emptyMessage}</p>
      ) : null}

      <div className="mt-4 space-y-3">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            canBookmark={canBookmark}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </section>
  );
};

export default StoryList;
