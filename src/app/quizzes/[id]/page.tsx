"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function TakeQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuizAndAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (id) {
        const { data: quizData } = await supabase.from('quizzes').select('*').eq('id', id).single();
        const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', id);
        
        setQuiz(quizData);
        if (qs) setQuestions(qs);
      }
      setLoading(false);
    };
    fetchQuizAndAuth();
  }, [id]);

  const handleSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);

    if (user) {
      await supabase.from('quiz_results').insert([{
        user_id: user.id,
        quiz_id: id,
        score: calculatedScore
      }]);
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;
  if (!quiz) return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Quiz not found</div>;

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <Link href="/quizzes" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Quizzes
        </Link>
        
        <h1>{quiz.title}</h1>
        <p className="subtitle">{quiz.description}</p>
        
        {!user && (
          <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            💡 Tip: You can test your knowledge right now! To record your permanent score on your personal dashboard, <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>log in here</Link>.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          {questions.map((q, index) => (
            <div key={q.id} className="content-section" style={{ background: 'rgba(0,0,0,0.4)', marginTop: 0 }}>
              <h3>{index + 1}. {q.question_text}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {(q.options as string[]).map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: submitted ? 'default' : 'pointer' }}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      value={opt} 
                      onChange={() => handleSelect(q.id, opt)}
                      disabled={submitted}
                      checked={answers[q.id] === opt}
                    />
                    <span style={{ 
                      color: submitted && opt === q.correct_answer ? '#34A853' : 
                             submitted && answers[q.id] === opt && opt !== q.correct_answer ? '#EA4335' : 'inherit'
                    }}>
                      {opt} {submitted && opt === q.correct_answer && " (Correct)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button onClick={submitQuiz} className="primary" style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1.2rem' }}>
            Submit Answers
          </button>
        ) : (
          <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(52, 168, 83, 0.2)', border: '1px solid #34A853', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ color: '#34A853', margin: 0 }}>Quiz Complete!</h2>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>You scored <strong>{score}</strong> out of {questions.length}</p>
          </div>
        )}
      </main>
    </>
  );
}
