import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Networking & CCNA Practice Quizzes | NETCAD',
  description: 'Test your knowledge on Inter-VLAN Routing, 802.1Q trunking, and EtherChannel with interactive CCNA practice quizzes.',
};

export default async function QuizzesIndex() {
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: true });

  const quizList = quizzes || [];

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem', maxWidth: '850px' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>NETCAD Networking Quizzes</h1>
        <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          Assess your comprehension of enterprise switching, routing protocols, and CCNA concepts.
        </p>
        
        {quizList.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>No quizzes available at the moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {quizList.map(quiz => (
              <div key={quiz.id} className="content-section" style={{ background: 'rgba(0,0,0,0.4)', marginTop: 0, padding: '2rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.8rem' }}>{quiz.title}</h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {quiz.description}
                </p>
                <Link href={`/quizzes/${quiz.id}`} className="primary" style={{ textDecoration: 'none', display: 'inline-block', background: 'var(--accent)', color: '#000', fontWeight: 'bold', padding: '10px 20px', borderRadius: '6px' }}>
                  Take Practice Quiz &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
