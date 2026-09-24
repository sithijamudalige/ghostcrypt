"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Quiz Creation State
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  
  // Question Creation State
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");

  // Article Creation State
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleYoutube, setArticleYoutube] = useState("");
  const [isPublishingArticle, setIsPublishingArticle] = useState(false);
  const [articleMessage, setArticleMessage] = useState("");
  
  // Article Management State
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Live Results State
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchQuizzes();
      fetchResults();
      fetchAllArticles();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  const fetchQuizzes = async () => {
    const { data } = await supabase.from('quizzes').select('*');
    if (data) setQuizzes(data);
  };

  const fetchResults = async () => {
    const { data } = await supabase
      .from('quiz_results')
      .select('*, profiles(full_name, email), quizzes(title)')
      .order('created_at', { ascending: false });
    if (data) setResults(data);
  };

  const fetchAllArticles = async () => {
    const { data } = await supabase.from('articles').select('*, profiles(email)').order('created_at', { ascending: false });
    if (data) setAllArticles(data);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    await supabase.from('articles').delete().eq('id', id);
    fetchAllArticles();
  };

  const updateArticleStatus = async (id: string, newStatus: string) => {
    await supabase.from('articles').update({ status: newStatus }).eq('id', id);
    fetchAllArticles();
  };

  const editArticle = (article: any) => {
    setEditingArticleId(article.id);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleYoutube(article.youtube_id || '');
    window.scrollTo(0, document.body.scrollHeight);
  };

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('quizzes').insert([{ title: quizTitle, description: quizDesc }]);
    if (!error) {
      alert("Quiz created!");
      setQuizTitle("");
      setQuizDesc("");
      fetchQuizzes();
    }
  };

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return alert("Select a quiz first!");

    const options = [optA, optB, optC, optD];
    let correctText = optA;
    if (correctAnswer === "B") correctText = optB;
    if (correctAnswer === "C") correctText = optC;
    if (correctAnswer === "D") correctText = optD;

    const { error } = await supabase.from('questions').insert([{
      quiz_id: selectedQuiz,
      question_text: questionText,
      options: options,
      correct_answer: correctText
    }]);

    if (!error) {
      alert("Question added!");
      setQuestionText("");
      setOptA(""); setOptB(""); setOptC(""); setOptD("");
    } else {
      alert("Error adding question");
    }
  };

  const uploadArticleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishingArticle(true);
    setArticleMessage("Uploading image to secure storage...");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('article_images')
      .upload(fileName, file);
      
    if (error) {
      setArticleMessage("Error uploading image: " + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('article_images').getPublicUrl(fileName);
      setArticleContent(prev => prev + `\n\n![Embedded Image](${publicUrl})\n\n`);
      setArticleMessage("Image uploaded and injected into your article!");
    }
    setIsPublishingArticle(false);
  };

  const publishAdminArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleContent) return alert("Title and content are required");
    setIsPublishingArticle(true);
    
    let finalYoutubeId = articleYoutube;
    if (articleYoutube.includes('v=')) {
      finalYoutubeId = articleYoutube.split('v=')[1].split('&')[0];
    } else if (articleYoutube.includes('youtu.be/')) {
      finalYoutubeId = articleYoutube.split('youtu.be/')[1].split('?')[0];
    }

    if (editingArticleId) {
      const { error } = await supabase.from('articles').update({
        title: articleTitle,
        content: articleContent,
        youtube_id: finalYoutubeId,
        status: 'published'
      }).eq('id', editingArticleId);

      setIsPublishingArticle(false);
      if (error) {
        setArticleMessage("Database Error: " + error.message);
      } else {
        setArticleMessage("Article updated successfully!");
        setEditingArticleId(null);
        setArticleTitle(''); setArticleContent(''); setArticleYoutube('');
        fetchAllArticles();
      }
    } else {
      const { error } = await supabase.from('articles').insert([{
        title: articleTitle,
        content: articleContent,
        youtube_id: finalYoutubeId,
        status: 'published' // Admin posts auto-publish
      }]);

      setIsPublishingArticle(false);
      if (error) {
        setArticleMessage("Database Error: " + error.message + " (Did you run the unlock SQL script?)");
      } else {
        setArticleMessage("Article published successfully as Admin!");
        setArticleTitle(''); setArticleContent(''); setArticleYoutube('');
        fetchAllArticles();
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="glass-panel" style={{ maxWidth: '400px', margin: '10vh auto' }}>
        <h1>Master Admin Access</h1>
        <p className="subtitle">NETCAD Restricted Area</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="error-text" style={{ marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
      </main>
    );
  }

  return (
    <main className="glass-panel" style={{ maxWidth: '1000px', width: '95%', margin: '4rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NETCAD Admin Control Center</h1>
        <button className="primary" onClick={() => setIsLoggedIn(false)} style={{ background: 'var(--error)' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Create Quiz Section */}
        <section className="content-section" style={{ margin: 0 }}>
          <h2>1. Create a New Quiz</h2>
          <form onSubmit={createQuiz}>
            <div className="input-group">
              <label>Quiz Title</label>
              <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <input type="text" value={quizDesc} onChange={e => setQuizDesc(e.target.value)} required />
            </div>
            <button type="submit" className="primary" style={{ marginTop: '1rem' }}>Create Quiz</button>
          </form>
        </section>

        {/* Add Questions Section */}
        <section className="content-section" style={{ margin: 0 }}>
          <h2>2. Add Questions to Quiz</h2>
          <form onSubmit={addQuestion}>
            <div className="input-group">
              <label>Select Quiz</label>
              <select value={selectedQuiz} onChange={e => setSelectedQuiz(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--glass-border)' }}>
                <option value="">-- Choose Quiz --</option>
                {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Question Text</label>
              <input type="text" value={questionText} onChange={e => setQuestionText(e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input type="text" placeholder="Option A" value={optA} onChange={e => setOptA(e.target.value)} required />
              <input type="text" placeholder="Option B" value={optB} onChange={e => setOptB(e.target.value)} required />
              <input type="text" placeholder="Option C" value={optC} onChange={e => setOptC(e.target.value)} required />
              <input type="text" placeholder="Option D" value={optD} onChange={e => setOptD(e.target.value)} required />
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label>Correct Answer</label>
              <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--glass-border)' }}>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <button type="submit" className="primary" style={{ marginTop: '1rem' }}>Add Question</button>
          </form>
        </section>
      </div>

      {/* Admin Article Publisher */}
      <section className="content-section" style={{ marginTop: '2rem', width: '100%', maxWidth: 'none' }}>
        <h2>Publish Article as Admin</h2>
        <form onSubmit={publishAdminArticle}>
          <div className="input-group">
            <label>Article Title</label>
            <input type="text" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>YouTube Embed Link (Optional)</label>
            <input type="text" value={articleYoutube} onChange={e => setArticleYoutube(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" />
          </div>
          <div className="input-group">
            <label>Insert Image into Article (Uploads automatically)</label>
            <input type="file" accept="image/*" onChange={uploadArticleImage} disabled={isPublishingArticle} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
          </div>
          <div className="input-group" data-color-mode="dark">
            <label>Article Content (Use the toolbar to add tables and format text!)</label>
            <MDEditor 
              value={articleContent} 
              onChange={val => setArticleContent(val || '')} 
              style={{ minHeight: '400px', backgroundColor: 'rgba(0,0,0,0.5)' }} 
            />
          </div>
          {articleMessage && <p style={{ color: articleMessage.includes('Error') ? 'var(--error)' : 'var(--accent)', marginBottom: '1rem' }}>{articleMessage}</p>}
          <button type="submit" className="primary" disabled={isPublishingArticle}>
            {isPublishingArticle ? 'Publishing...' : 'Publish Article'}
          </button>
        </form>
      </section>

      {/* Article Management Section */}
      <section className="content-section" style={{ marginTop: '2rem', width: '100%', maxWidth: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Article Management (Review, Edit, Delete)</h2>
          <button className="primary" onClick={fetchAllArticles}>Refresh Articles</button>
        </div>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Author</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allArticles.map((art) => (
              <tr key={art.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{art.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{art.profiles?.email || 'Admin'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    background: art.status === 'published' ? 'var(--success)' : art.status === 'rejected' ? 'var(--error)' : 'orange',
                    color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem'
                  }}>
                    {art.status?.toUpperCase() || 'PUBLISHED'}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {art.status === 'pending' && (
                    <>
                      <button className="primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => updateArticleStatus(art.id, 'published')}>Approve</button>
                      <button className="primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'var(--error)' }} onClick={() => updateArticleStatus(art.id, 'rejected')}>Reject</button>
                    </>
                  )}
                  <button className="copy-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', margin: 0 }} onClick={() => editArticle(art)}>Edit</button>
                  <button className="copy-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', margin: 0, color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => deleteArticle(art.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Live Results Section */}
      <section className="content-section" style={{ marginTop: '2rem', width: '100%', maxWidth: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Live Quiz Results</h2>
          <button className="primary" onClick={fetchResults}>Refresh Results</button>
        </div>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>User Email</th>
              <th style={{ padding: '1rem' }}>Quiz Taken</th>
              <th style={{ padding: '1rem' }}>Score</th>
              <th style={{ padding: '1rem' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{r.profiles?.email || 'Anonymous'}</td>
                <td style={{ padding: '1rem' }}>{r.quizzes?.title}</td>
                <td style={{ padding: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>{r.score}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
