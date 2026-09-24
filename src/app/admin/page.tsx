"use client";

import Link from "next/link";

export default function AdminOverview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      <div className="content-section" style={{ margin: 0 }}>
        <h2 style={{ color: 'var(--accent)' }}>Manage Articles</h2>
        <p style={{ marginBottom: '2rem' }}>Approve, edit, delete, or publish new articles and labs.</p>
        <Link href="/admin/articles" className="primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}>Go to Articles</Link>
      </div>

      <div className="content-section" style={{ margin: 0 }}>
        <h2 style={{ color: 'var(--accent)' }}>Manage Quizzes</h2>
        <p style={{ marginBottom: '2rem' }}>Create quizzes, add questions, and manage quiz content.</p>
        <Link href="/admin/quizzes" className="primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}>Go to Quizzes</Link>
      </div>

      <div className="content-section" style={{ margin: 0 }}>
        <h2 style={{ color: 'var(--accent)' }}>Live Results</h2>
        <p style={{ marginBottom: '2rem' }}>View live quiz results from students across the platform.</p>
        <Link href="/admin/results" className="primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}>Go to Results</Link>
      </div>
    </div>
  );
}
