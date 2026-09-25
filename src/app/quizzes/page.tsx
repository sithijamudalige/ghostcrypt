"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function QuizzesIndex() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setQuizzes(data);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1>NEDCAD Quizzes</h1>
        <p className="subtitle">Test your networking and data science knowledge</p>
        
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No quizzes available yet. Check back later!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {quizzes.map(quiz => (
              <div key={quiz.id} className="content-section" style={{ background: 'rgba(0,0,0,0.4)', marginTop: 0 }}>
                <h2>{quiz.title}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {quiz.description}
                </p>
                <Link href={`/quizzes/${quiz.id}`} className="primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Take Quiz &rarr;</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
