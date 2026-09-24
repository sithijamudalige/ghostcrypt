"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('publisher');
  const [loading, setLoading] = useState(true);

  // Article State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState('');

  // Quiz State (For Admin)
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (data) setRole(data.role);
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const publishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required");
    setIsPublishing(true);
    
    // Extract video ID if they pasted a full URL
    let finalYoutubeId = youtubeId;
    if (youtubeId.includes('v=')) {
      finalYoutubeId = youtubeId.split('v=')[1].split('&')[0];
    } else if (youtubeId.includes('youtu.be/')) {
      finalYoutubeId = youtubeId.split('youtu.be/')[1].split('?')[0];
    }

    const { error } = await supabase.from('articles').insert([{
      title,
      content,
      youtube_id: finalYoutubeId,
      author_id: user.id
    }]);

    setIsPublishing(false);
    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Article published successfully!");
      setTitle('');
      setContent('');
      setYoutubeId('');
    }
  };

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle) return alert("Title required");
    const { data, error } = await supabase.from('quizzes').insert([{ title: quizTitle, description: quizDesc }]).select().single();
    if (error) {
      alert("Error creating quiz");
    } else {
      alert("Quiz created! You can now add questions to it from the database.");
      setQuizTitle('');
      setQuizDesc('');
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel" style={{ maxWidth: '800px', width: '95%', margin: '4rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome, {user.email}</p>
          </div>
          <button onClick={handleLogout} className="copy-btn" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>Logout</button>
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Publish New Article</h2>
          <form onSubmit={publishArticle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div className="input-group">
              <label>Article Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. How to use AES Encryption" />
            </div>
            <div className="input-group">
              <label>YouTube Video URL or ID (Optional)</label>
              <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" />
            </div>
            <div className="input-group">
              <label>Article Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} required rows={10} placeholder="Write your article here..."></textarea>
            </div>
            {message && <p style={{ color: message.includes('Error') ? 'var(--error)' : 'var(--accent)' }}>{message}</p>}
            <button type="submit" className="primary" disabled={isPublishing}>
              {isPublishing ? 'Publishing...' : 'Publish Article'}
            </button>
          </form>
        </section>

        {role === 'admin' && (
          <section style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <h2 style={{ color: 'var(--accent)' }}>Admin: Create MCQ Quiz</h2>
            <form onSubmit={createQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label>Quiz Title</label>
                <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <input type="text" value={quizDesc} onChange={e => setQuizDesc(e.target.value)} />
              </div>
              <button type="submit" className="primary">Create Quiz Shell</button>
            </form>
          </section>
        )}
      </main>
    </>
  );
}
