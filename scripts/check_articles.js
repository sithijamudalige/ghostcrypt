const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data: articles, error } = await supabase.from('articles').select('*');
  if (error) {
    console.error('Supabase error:', error);
    return;
  }
  console.log('Total articles in DB:', articles.length);
  for (const a of articles) {
    const wc = a.content ? a.content.split(/\s+/).length : 0;
    console.log(`[${a.status}] [is_lab: ${a.is_lab}] (${wc} words) ${a.title} (ID: ${a.id})`);
  }
}
check();
