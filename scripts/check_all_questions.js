const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data: qs } = await supabase.from('questions').select('*');
  for (const q of qs) {
    console.log('Q:', q.question_text);
    console.log('Options:', q.options);
    console.log('Answer:', q.correct_answer);
    console.log('---');
  }
}
check();
