const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data: labs } = await supabase.from('articles').select('title, content').eq('is_lab', true);
  for (const lab of labs) {
    console.log('=== LAB: ' + lab.title + ' ===');
    console.log(lab.content);
    console.log('\n');
  }
}
check();
