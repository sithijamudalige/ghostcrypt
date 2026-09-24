"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setError("");
      fetchLogs();
    } else {
      setError("Invalid admin credentials.");
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <main className="glass-panel" style={{ maxWidth: '400px' }}>
          <h1>Admin Access</h1>
          <p className="subtitle">Restricted Area</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            {error && <p className="error-text" style={{ marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" className="primary">Login</button>
          </form>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <main className="glass-panel" style={{ maxWidth: '1000px', width: '95%' }}>
        <h1>Encryption Logs (Audit Only)</h1>
        <p className="subtitle">All intercepted user payloads (Passwords are not tracked)</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="copy-btn" onClick={fetchLogs}>
            Refresh Logs
          </button>
          <button className="copy-btn" onClick={() => setIsLoggedIn(false)} style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
            Logout
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : logs.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No logs found in database.json.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem' }}>Encrypted Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                          {log.encryptedData}
                        </div>
                        <button className="copy-btn" style={{ margin: 0, padding: '0.25rem 0.5rem' }} onClick={() => copyToClipboard(log.encryptedData)}>
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
