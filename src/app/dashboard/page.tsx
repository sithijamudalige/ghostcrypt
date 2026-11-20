"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import rehypeRaw from 'rehype-raw';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('publisher');
  const [loading, setLoading] = useState(true);
  const [userArticles, setUserArticles] = useState<any[]>([]);

  // Article State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [labName, setLabName] = useState('');
  const [isLabPost, setIsLabPost] = useState(false);
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

      const { data: myArticles } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });
      if (myArticles) setUserArticles(myArticles);

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
    if (!title) return alert("Title is required");
    if (!isLabPost && !content) return alert("Article content is required");
    if (isLabPost && !content) return alert("Please attach a Lab file first!");
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
      author_id: user.id,
      is_lab: isLabPost
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

  const getSafeStorageKey = (originalName: string) => {
    const lastDot = originalName.lastIndexOf('.');
    const base = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
    const ext = lastDot !== -1 ? originalName.substring(lastDot + 1) : '';

    const cleanBase = base
      .replace(/[—–]/g, '-')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const prefix = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${cleanBase || 'upload'}.${cleanExt}`;
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishing(true);
    setMessage("Uploading image to secure storage...");
    
    const fileName = getSafeStorageKey(file.name);
    
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

  const uploadLabFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishing(true);
    setMessage("Uploading lab file...");
    
    const fileName = getSafeStorageKey(file.name);
    
    const { error } = await supabase.storage
      .from('labs')
      .upload(fileName, file);
      
    if (error) {
      setMessage("Error uploading lab: " + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('labs').getPublicUrl(fileName);
      const displayName = labName.trim() !== '' ? labName : file.name;
      setContent(prev => prev + `\n\n<div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--accent); margin: 15px 0;">\n  <a href="${publicUrl}" target="_blank" class="lab-download-btn" style="margin-top:0;">⬇️ Download Lab: ${displayName}</a>\n  <p style="margin: 10px 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">Direct Link: <code style="user-select: all; background: #000; padding: 4px; border-radius: 4px;">${publicUrl}</code></p>\n</div>\n\n`);
      setMessage("Lab file uploaded and injected into article!");
    }
    setIsPublishing(false);
  };

  const uploadPDFFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishing(true);
    setMessage("Uploading PDF guide...");
    
    const fileName = getSafeStorageKey(file.name);
    
    const { error } = await supabase.storage
      .from('labs')
      .upload(fileName, file);
      
    if (error) {
      setMessage("Error uploading PDF: " + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('labs').getPublicUrl(fileName);
      const displayName = labName.trim() !== '' ? labName : file.name;
      setContent(prev => prev + `\n\n<div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--accent); margin: 15px 0;">\n  <a href="${publicUrl}" target="_blank" class="lab-download-btn" style="margin-top:0;">📄 Download Config PDF: ${displayName}</a>\n</div>\n\n`);
      setMessage("PDF uploaded and injected into article!");
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
          <h2>Publish New Content</h2>
          <form onSubmit={publishArticle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            
            {role === 'admin' && (
              <div className="input-group" style={{ marginBottom: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <label style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '1rem' }}>Content Type</label>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input type="radio" checked={!isLabPost} onChange={() => setIsLabPost(false)} style={{ width: '20px', height: '20px' }} /> 
                    Standard Article
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input type="radio" checked={isLabPost} onChange={() => setIsLabPost(true)} style={{ width: '20px', height: '20px' }} /> 
                    Hands-On Lab
                  </label>
                </div>
              </div>
            )}

            <div className="input-group">
              <label>{isLabPost ? 'Lab Title' : 'Article Title'}</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. How to use AES Encryption" />
            </div>
            <div className="input-group">
              <label>YouTube Video URL or ID (Optional)</label>
              <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" />
            </div>
            <div className={role === 'admin' ? "responsive-grid-2-end" : ""}>
              <div className="input-group">
                <label>Insert Image</label>
                <input type="file" accept="image/*" onChange={uploadImage} disabled={isPublishing} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '100%' }} />
              </div>
              {role === 'admin' && (
                <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Attach Files (.pkt, .ipynb, .pdf)</label>
                  <input type="text" placeholder="Custom File Name (Optional)" value={labName} onChange={e => setLabName(e.target.value)} style={{ width: '100%' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="file" accept=".pkt,.ipynb" onChange={uploadLabFile} disabled={isPublishing} title="Upload Lab File" style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '100%' }} />
                    <input type="file" accept=".pdf" onChange={uploadPDFFile} disabled={isPublishing} title="Upload PDF Guide" style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '100%' }} />
                  </div>
                </div>
              )}
            </div>
            
              <div className="input-group" data-color-mode="dark">
                <label>Content (Editor is active for all posts)</label>
                <MDEditor 
                  value={content} 
                  onChange={val => setContent(val || '')} 
                  style={{ minHeight: '400px', backgroundColor: 'rgba(0,0,0,0.5)' }} 
                  previewOptions={{
                    rehypePlugins: [[rehypeRaw]],
                    components: {
                      style: ({node, ...props}: any) => <style dangerouslySetInnerHTML={{ __html: props.children }} />,
                      head: () => <></>,
                      title: () => <></>,
                      meta: () => <></>
                    }
                  }}
                />
              </div>
            {message && <p style={{ color: message.includes('Error') ? 'var(--error)' : 'var(--accent)' }}>{message}</p>}
            <button type="submit" className="primary" disabled={isPublishing}>
              {isPublishing ? 'Publishing...' : 'Publish Article'}
            </button>
          </form>
        </section>

        <section style={{ marginBottom: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          <h2>My Submissions</h2>
          <p className="subtitle" style={{ textAlign: 'left', marginBottom: '1rem' }}>Track the status of your published and pending content.</p>
          {userArticles.length === 0 ? (
            <p>You haven't submitted anything yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem' }}>Title</th>
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userArticles.map(art => (
                    <tr key={art.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{art.title}</td>
                      <td style={{ padding: '1rem' }}>{art.is_lab ? 'Lab' : 'Article'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.85rem',
                          background: art.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : art.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                          color: art.status === 'published' ? '#10b981' : art.status === 'rejected' ? '#ef4444' : '#eab308'
                        }}>
                          {art.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {new Date(art.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
