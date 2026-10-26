const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data: quiz } = await supabase.from('quizzes').select('*').limit(1).single();
  console.log('Quiz structure:', quiz);
  const { data: questions } = await supabase.from('questions').select('*').eq('quiz_id', quiz.id);
  console.log('Questions count:', questions.length);
  if (questions.length > 0) {
    console.log('Sample question structure:', questions[0]);
  }
}
check();
