import { useState, useEffect } from 'react';

interface SessionStatus {
  authenticated: boolean;
  lockdown: boolean | null;
}

export default function AdminPanel() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [lockdown, setLockdown] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toggling, setToggling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/session', {
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          const data: SessionStatus = await res.json();
          if (data.authenticated) {
            setAuthenticated(true);
            setLockdown(data.lockdown ?? true);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      setAuthenticated(true);
      setPassword('');
      
      // Fetch fresh session state
      const sessionRes = await fetch('/api/admin/session');
      if (sessionRes.ok) {
        const sessionData: SessionStatus = await sessionRes.json();
        setLockdown(sessionData.lockdown ?? true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLockdown = async () => {
    if (toggling) return;
    setToggling(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !lockdown }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          setError('Session expired. Please log in again.');
          return;
        }
        setError(data.error || 'Failed to toggle lockdown state');
        return;
      }

      setLockdown(data.lockdown);
      setSuccessMessage(data.message || `Lockdown protocol set to ${data.lockdown ? 'ON' : 'OFF'}`);
    } catch {
      setError('Network error updating lockdown status.');
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setAuthenticated(false);
      setSuccessMessage(null);
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-4">
        <div className="text-sm md:text-base tracking-widest uppercase animate-pulse border-2 border-white px-6 py-3">
          VERIFYING_AUTH_STATE...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col justify-between p-4 md:p-12 selection:bg-white selection:text-black">
      {/* Top Header */}
      <header className="border-b-4 border-white pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold uppercase tracking-tighter">
            SEANNKAI // CONTROL_PANEL
          </h1>
          <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
            System Administration & Security Protocols
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border border-zinc-700 px-3 py-1"
          >
            ← Site Root
          </a>
          {authenticated && (
            <button
              onClick={handleLogout}
              className="text-xs uppercase tracking-widest bg-zinc-900 hover:bg-white hover:text-black text-white transition-colors border border-white px-3 py-1 cursor-pointer"
            >
              [ Log Out ]
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto my-8">
        {/* Error Notification */}
        {error && (
          <div className="w-full bg-red-950/80 border-2 border-red-500 text-red-200 px-4 py-3 text-xs md:text-sm uppercase tracking-wider mb-6 flex justify-between items-center">
            <span>&gt; ERROR: {error}</span>
            <button onClick={() => setError(null)} className="font-bold text-base px-2 hover:text-white">
              ×
            </button>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="w-full bg-zinc-900 border-2 border-white text-white px-4 py-3 text-xs md:text-sm uppercase tracking-wider mb-6 flex justify-between items-center">
            <span>&gt; SUCCESS: {successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="font-bold text-base px-2 hover:text-zinc-400">
              ×
            </button>
          </div>
        )}

        {!authenticated ? (
          /* Login Form */
          <div className="w-full border-4 border-white bg-black p-6 md:p-10 shadow-[8px_8px_0px_white]">
            <div className="border-b-2 border-zinc-800 pb-4 mb-6">
              <div className="text-xs text-zinc-400 uppercase tracking-widest">ACCESS_RESTRICTED</div>
              <h2 className="text-2xl font-bold uppercase tracking-tight mt-1">Authentication Required</h2>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-bold"
                >
                  Password Entry
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  disabled={submitting}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 focus:border-white focus:outline-none text-white px-4 py-3 text-sm md:text-base font-mono transition-colors disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !password.trim()}
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 px-6 text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[4px_4px_0px_#555]"
              >
                {submitting ? 'AUTHENTICATING...' : 'ACCESS_PANEL →'}
              </button>
            </form>

            <div className="mt-6 text-[10px] text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-4">
              [ Protected via rate-limited cryptographic verification ]
            </div>
          </div>
        ) : (
          /* Authenticated Controls Container - Structured modularly for future sections */
          <div className="w-full flex flex-col gap-8">
            {/* Section: Anti-Scraper Lockdown Module */}
            <div className="w-full border-4 border-white bg-black p-6 md:p-10 shadow-[8px_8px_0px_white]">
              <div className="flex justify-between items-start border-b-2 border-zinc-800 pb-4 mb-6">
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-widest">SECURITY PROTOCOL [01]</div>
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mt-1">
                    Anti-Scraper Lockdown
                  </h2>
                </div>
                <div
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 ${
                    lockdown
                      ? 'bg-red-950 border-red-500 text-red-300'
                      : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  }`}
                >
                  {lockdown ? '● ACTIVE' : '○ DISABLED'}
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-300 mb-8 leading-relaxed">
                {lockdown
                  ? 'Active: All AI bots, web scrapers, curl/python crawlers, and automated indexing engines are blocked at the edge. Meta tags enforce strict noindex / nosnippet across the entire portfolio.'
                  : 'Disabled: Anti-scraper blocking is suspended. Crawlers and search engine indexing are allowed to access the site normally.'}
              </p>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handleToggleLockdown}
                  disabled={toggling}
                  className={`w-full py-4 px-6 font-bold uppercase tracking-widest text-sm transition-all cursor-pointer border-2 ${
                    lockdown
                      ? 'bg-black text-red-400 border-red-500 hover:bg-red-950/40 hover:border-red-400'
                      : 'bg-white text-black border-white hover:bg-zinc-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_#333]`}
                >
                  {toggling
                    ? 'UPDATING_STATE...'
                    : lockdown
                    ? 'DISABLE LOCKDOWN PROTOCOL (TURN OFF)'
                    : 'ACTIVATE LOCKDOWN PROTOCOL (TURN ON)'}
                </button>
              </div>

              <div className="mt-8 border-t border-zinc-800 pt-4 flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
                <span>Persistence: Redis / KV Store</span>
                <span>Runtime: Vercel Edge</span>
              </div>
            </div>

            {/* Placeholder / Extension Slot for future modular panel features */}
            <div className="border-2 border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-600 uppercase tracking-widest">
              [ Modular Architecture: Future panel modules can be mounted here ]
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-zinc-800 pt-4 text-center text-[10px] text-zinc-500 uppercase tracking-widest">
        foliobyseann security management system // session expires in 24h
      </footer>
    </div>
  );
}
