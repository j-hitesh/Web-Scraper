import { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({
  mode,
  title,
  submitText,
  onSubmit,
  loading,
  error,
  switchText,
  switchTo,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Hacker News Feed</p>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        {error ? (
          <p className="mb-4 rounded-lg border border-rose-800 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-400"
              placeholder="At least 6 characters"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : submitText}
          </button>
        </form>

        <Link
          to={switchTo}
          className="mt-4 text-sm text-cyan-300 hover:text-cyan-200"
          aria-label={`Switch to ${mode === 'login' ? 'register' : 'login'} page`}
        >
          {switchText}
        </Link>
      </section>
    </main>
  );
};

export default AuthForm;
