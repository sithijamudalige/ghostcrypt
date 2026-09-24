"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

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
      setMessage("Article submitted successfully! It is now waiting for Admin approval.");
      setTitle('');
      setContent('');
      setYoutubeId('');
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishing(true);
    setMessage("Uploading image to secure storage...");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('article_images')
      .upload(fileName, file);
      
    if (error) {
      setMessage("Error uploading image: " + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('article_images').getPublicUrl(fileName);
      setContent(prev => prev + `\n\n![Embedded Image](${publicUrl})\n\n`);
      setMessage("Image uploaded and injected into your article!");
    }
    setIsPublishing(false);
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
              <label>Insert Image into Article (Uploads automatically)</label>
              <input type="file" accept="image/*" onChange={uploadImage} disabled={isPublishing} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
            </div>
            <div className="input-group" data-color-mode="dark">
              <label>Article Content (Use the toolbar to add tables and format text!)</label>
              <MDEditor 
                value={content} 
                onChange={val => setContent(val || '')} 
                style={{ minHeight: '400px', backgroundColor: 'rgba(0,0,0,0.5)' }} 
              />
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
