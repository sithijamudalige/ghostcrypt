"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminResults() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data } = await supabase
      .from('quiz_results')
      .select('*, profiles(full_name, email), quizzes(title)')
      .order('created_at', { ascending: false });
    if (data) setResults(data);
  };

  return (
    <section className="content-section" style={{ margin: 0, gridColumn: '1 / -1' }}>
      <h2>Live Quiz Results</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Quiz</th>
              <th style={{ padding: '1rem' }}>Score</th>
              <th style={{ padding: '1rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                  <div>{r.profiles?.full_name || 'Anonymous'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.profiles?.email || 'N/A'}</div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--accent)' }}>{r.quizzes?.title || 'Unknown Quiz'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    background: r.score >= (r.total_questions / 2) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: r.score >= (r.total_questions / 2) ? '#10b981' : '#ef4444'
                  }}>
                    {r.score} / {r.total_questions}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '1rem', textAlign: 'center' }}>No results yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
