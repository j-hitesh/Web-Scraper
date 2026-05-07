const StoryCard = ({ story, canBookmark, onToggleBookmark }) => {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-slate-950/40">
      <div className="flex items-start justify-between gap-3">
        <a
          href={story.url}
          target="_blank"
          rel="noreferrer"
          className="text-base font-semibold text-cyan-300 hover:text-cyan-200"
        >
          {story.title}
        </a>

        {canBookmark ? (
          <button
            type="button"
            onClick={() => onToggleBookmark(story.id)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              story.isBookmarked
                ? 'bg-amber-300 text-slate-900 hover:bg-amber-200'
                : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
            }`}
          >
            {story.isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
        <span>{story.points} points</span>
        <span>by {story.author || 'unknown'}</span>
        <span>{story.postedAt || 'N/A'}</span>
      </div>
    </article>
  );
};

export default StoryCard;
