'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FixLabs() {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const fixArticles = async () => {
      setLog(prev => [...prev, "Fetching all articles..."]);
      const { data: articles, error } = await supabase.from('articles').select('*');
      
      if (error) {
        setLog(prev => [...prev, "Error fetching articles: " + error.message]);
        return;
      }

      setLog(prev => [...prev, `Found ${articles.length} articles. Scanning for old lab buttons...`]);
      let updatedCount = 0;

      for (const article of articles) {
        if (article.content && article.content.includes('class="lab-download-btn"') && !article.content.includes('Direct Link:')) {
          setLog(prev => [...prev, `Fixing article: ${article.title}`]);
          
          // Use regex to find the exact anchor tag and extract the href and text
          const regex = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/;
          const match = article.content.match(regex);
          
          if (match) {
            const publicUrl = match[1];
            const text = match[2];
            
            const newHtml = `<div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--accent); margin: 15px 0;">\n  <a href="${publicUrl}" target="_blank" class="lab-download-btn" style="margin-top:0;">${text}</a>\n  <p style="margin: 10px 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">Direct Link: <code style="user-select: all; background: #000; padding: 4px; border-radius: 4px;">${publicUrl}</code></p>\n</div>`;
            
            const newContent = article.content.replace(regex, newHtml);
            
            const { error: updateError } = await supabase
              .from('articles')
              .update({ content: newContent })
              .eq('id', article.id);
              
            if (updateError) {
              setLog(prev => [...prev, `Failed to update ${article.title}: ${updateError.message}`]);
            } else {
              setLog(prev => [...prev, `Successfully updated ${article.title}`]);
              updatedCount++;
            }
          }
        }
      }

      setLog(prev => [...prev, `Done! Fixed ${updatedCount} articles.`]);
    };
    
    fixArticles();
  }, []);

  return (
    <div style={{ padding: '4rem', color: 'white' }}>
      <h1>Auto-Fixing Old Labs...</h1>
      <div style={{ background: '#000', padding: '2rem', marginTop: '2rem', fontFamily: 'monospace' }}>
        {log.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}
