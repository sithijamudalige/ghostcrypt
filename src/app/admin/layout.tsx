"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("admin_logged_in") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "sithija" && password === "sithija123") {
      localStorage.setItem("admin_logged_in", "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
  };

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', marginTop: '10vh' }}>
        <div className="content-section" style={{ maxWidth: '400px', width: '100%', margin: 0 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Portal</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
            <button type="submit" className="primary">Login to Admin</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        
        {/* Left */}
        <div>
          <h2 style={{ margin: 0, color: 'var(--accent)' }}>Admin Portal</h2>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
          <Link href="/admin" style={{ color: pathname === '/admin' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Overview</Link>
          <Link href="/admin/articles" style={{ color: pathname === '/admin/articles' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Articles</Link>
          <Link href="/admin/quizzes" style={{ color: pathname === '/admin/quizzes' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Quizzes</Link>
          <Link href="/admin/results" style={{ color: pathname === '/admin/results' ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Results</Link>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleLogout} className="copy-btn" style={{ margin: 0, borderColor: 'var(--error)', color: 'var(--error)' }}>Logout Admin</button>
        </div>

      </div>

      {children}
    </div>
  );
}
