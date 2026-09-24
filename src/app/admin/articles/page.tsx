"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import rehypeRaw from "rehype-raw";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function AdminArticles() {
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleYoutube, setArticleYoutube] = useState("");
  const [labName, setLabName] = useState("");
  const [isLabPost, setIsLabPost] = useState(false);
  const [isPublishingArticle, setIsPublishingArticle] = useState(false);
  const [articleMessage, setArticleMessage] = useState("");

  useEffect(() => {
    fetchAllArticles();
  }, []);

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
    setIsLabPost(article.is_lab || false);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const uploadArticleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishingArticle(true);
    setArticleMessage("Uploading image...");
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('article_images').upload(fileName, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('article_images').getPublicUrl(fileName);
      setArticleContent(prev => prev + `\n\n<img src="${publicUrl}" alt="Embedded Image" />\n\n`);
      setArticleMessage("Image uploaded!");
    } else {
      setArticleMessage("Error: " + error.message);
    }
    setIsPublishingArticle(false);
  };

  const uploadLabFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPublishingArticle(true);
    setArticleMessage("Uploading lab file...");
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${file.name}`;
    const { error } = await supabase.storage.from('labs').upload(fileName, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('labs').getPublicUrl(fileName);
      const displayName = labName.trim() !== '' ? labName : file.name;
      setArticleContent(prev => prev + `\n\n<div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--accent); margin: 15px 0;">\n  <a href="${publicUrl}" target="_blank" class="lab-download-btn" style="margin-top:0;">⬇️ Download Lab: ${displayName}</a>\n  <p style="margin: 10px 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">Direct Link: <code style="user-select: all; background: #000; padding: 4px; border-radius: 4px;">${publicUrl}</code></p>\n</div>\n\n`);
      setArticleMessage("Lab file uploaded!");
    } else {
      setArticleMessage("Error: " + error.message);
    }
    setIsPublishingArticle(false);
  };

  const publishAdminArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle) return alert("Title required");
    setIsPublishingArticle(true);
    
    let finalYoutubeId = articleYoutube;
    if (articleYoutube.includes('v=')) finalYoutubeId = articleYoutube.split('v=')[1].split('&')[0];
    else if (articleYoutube.includes('youtu.be/')) finalYoutubeId = articleYoutube.split('youtu.be/')[1].split('?')[0];

    let error;
    if (editingArticleId) {
      const { error: updateError } = await supabase.from('articles').update({
        title: articleTitle,
        content: articleContent,
        youtube_id: finalYoutubeId,
        is_lab: isLabPost,
        status: 'published'
      }).eq('id', editingArticleId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('articles').insert([{
        title: articleTitle,
        content: articleContent,
        youtube_id: finalYoutubeId,
        is_lab: isLabPost,
        status: 'published'
      }]);
      error = insertError;
    }

    setIsPublishingArticle(false);
    if (error) {
      setArticleMessage("Error: " + error.message);
    } else {
      setArticleMessage(editingArticleId ? "Article updated!" : "Article published!");
      setArticleTitle("");
      setArticleContent("");
      setArticleYoutube("");
      setEditingArticleId(null);
      fetchAllArticles();
    }
  };

  return (
    <>
      <section className="content-section" style={{ margin: 0, gridColumn: '1 / -1', marginBottom: '2rem' }}>
        <h2>Article Management (Review, Edit, Delete)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Author Email</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allArticles.map(art => (
                <tr key={art.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{art.title}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{art.profiles?.email || 'Admin/Unknown'}</td>
                  <td style={{ padding: '1rem' }}>{art.is_lab ? 'Lab' : 'Article'}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={art.status || 'pending'} 
                      onChange={(e) => updateArticleStatus(art.id, e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: art.status === 'published' ? '#10b981' : art.status === 'rejected' ? '#ef4444' : '#eab308', border: '1px solid var(--glass-border)' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => editArticle(art)} className="copy-btn" style={{ margin: 0, borderColor: 'var(--accent)', color: 'var(--accent)' }}>Edit</button>
                    <button onClick={() => deleteArticle(art.id)} className="copy-btn" style={{ margin: 0, borderColor: 'var(--error)', color: 'var(--error)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section" style={{ margin: 0, width: '100%', maxWidth: 'none' }}>
        <h2>{editingArticleId ? "Edit Article" : "Publish New Content as Admin"}</h2>
        {editingArticleId && (
          <button onClick={() => { setEditingArticleId(null); setArticleTitle(""); setArticleContent(""); setArticleYoutube(""); }} className="copy-btn" style={{ marginBottom: '1rem' }}>Cancel Editing</button>
        )}
        <form onSubmit={publishAdminArticle}>
          <div className="input-group" style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
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
          <div className="input-group">
            <label>{isLabPost ? 'Lab Title' : 'Article Title'}</label>
            <input type="text" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>YouTube Embed Link (Optional)</label>
            <input type="text" value={articleYoutube} onChange={e => setArticleYoutube(e.target.value)} />
          </div>
          <div className="responsive-grid-2-end">
            <div className="input-group">
              <label>Insert Image</label>
              <input type="file" accept="image/*" onChange={uploadArticleImage} disabled={isPublishingArticle} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '100%' }} />
            </div>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Attach Lab File (.pkt, .ipynb)</label>
              <input type="text" placeholder="Custom Lab Name (Optional)" value={labName} onChange={e => setLabName(e.target.value)} style={{ width: '100%' }} />
              <input type="file" accept=".pkt,.ipynb" onChange={uploadLabFile} disabled={isPublishingArticle} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '100%' }} />
            </div>
          </div>
          {!isLabPost && (
            <div className="input-group" data-color-mode="dark">
              <label>Article Content</label>
              <MDEditor 
                value={articleContent} 
                onChange={val => setArticleContent(val || '')} 
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
          )}
          {articleMessage && <p style={{ color: articleMessage.includes('Error') ? 'var(--error)' : 'var(--accent)' }}>{articleMessage}</p>}
          <button type="submit" className="primary" disabled={isPublishingArticle}>{editingArticleId ? "Update Content" : "Publish Content"}</button>
        </form>
      </section>
    </>
  );
}
