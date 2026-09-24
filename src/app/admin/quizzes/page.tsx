"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");

  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const { data } = await supabase.from('quizzes').select('*');
    if (data) setQuizzes(data);
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
    if (!selectedQuiz) return alert("Enter Quiz Title!");

    let quizId = selectedQuiz;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedQuiz);
    
    if (!isUUID) {
      const { data: qData, error: qErr } = await supabase.from('quizzes').select('id').ilike('title', selectedQuiz).single();
      if (qErr || !qData) {
        return alert("Could not find a Quiz with that title! Please make sure the title exactly matches.");
      }
      quizId = qData.id;
    }

    const options = [optA, optB, optC, optD];
    let correctText = optA;
    if (correctAnswer === "B") correctText = optB;
    if (correctAnswer === "C") correctText = optC;
    if (correctAnswer === "D") correctText = optD;

    const { error } = await supabase.from('questions').insert([{
      quiz_id: quizId,
      question_text: questionText,
      options: options,
      correct_answer: correctText
    }]);

    if (!error) {
      alert("Question added successfully!");
      setQuestionText("");
      setOptA(""); setOptB(""); setOptC(""); setOptD("");
    } else {
      alert("Database Error: " + error.message);
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz? This will also delete all its questions!")) return;
    await supabase.from('quizzes').delete().eq('id', id);
    fetchQuizzes();
  };
  
  const editQuiz = async (quiz: any) => {
    const newTitle = prompt("Enter new Quiz Title:", quiz.title);
    if (newTitle === null) return;
    const newDesc = prompt("Enter new Description:", quiz.description || "");
    if (newDesc === null) return;
    
    await supabase.from('quizzes').update({ title: newTitle, description: newDesc }).eq('id', quiz.id);
    fetchQuizzes();
  };

  const toggleQuestions = async (quizId: string) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null);
      setQuizQuestions([]);
    } else {
      setExpandedQuizId(quizId);
      fetchQuestions(quizId);
    }
  };

  const fetchQuestions = async (quizId: string) => {
    const { data } = await supabase.from('questions').select('*').eq('quiz_id', quizId).order('created_at', { ascending: true });
    if (data) setQuizQuestions(data);
  };

  const deleteQuestion = async (id: string, quizId: string) => {
    if (!confirm("Delete this question?")) return;
    await supabase.from('questions').delete().eq('id', id);
    fetchQuestions(quizId);
  };

  const saveEditedQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    
    const options = [editingQuestion.optA, editingQuestion.optB, editingQuestion.optC, editingQuestion.optD];
    let correctText = editingQuestion.optA;
    if (editingQuestion.correctAnswer === "B") correctText = editingQuestion.optB;
    if (editingQuestion.correctAnswer === "C") correctText = editingQuestion.optC;
    if (editingQuestion.correctAnswer === "D") correctText = editingQuestion.optD;

    const { error } = await supabase.from('questions').update({
      question_text: editingQuestion.question_text,
      options: options,
      correct_answer: correctText
    }).eq('id', editingQuestion.id);

    if (!error) {
      alert("Question updated!");
      setEditingQuestion(null);
      fetchQuestions(expandedQuizId!);
    } else {
      alert("Error: " + error.message);
    }
  };

  const startEditingQuestion = (q: any) => {
    let corrAns = "A";
    if (q.correct_answer === q.options[1]) corrAns = "B";
    if (q.correct_answer === q.options[2]) corrAns = "C";
    if (q.correct_answer === q.options[3]) corrAns = "D";
    
    setEditingQuestion({
      ...q,
      optA: q.options[0] || '',
      optB: q.options[1] || '',
      optC: q.options[2] || '',
      optD: q.options[3] || '',
      correctAnswer: corrAns
    });
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
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

        <section className="content-section" style={{ margin: 0 }}>
          <h2>2. Add Questions to Quiz</h2>
          <form onSubmit={addQuestion}>
            <div className="input-group">
              <label>Quiz Title</label>
              <input type="text" value={selectedQuiz} onChange={e => setSelectedQuiz(e.target.value)} required placeholder="Type the Quiz Title here" />
            </div>
            <div className="input-group">
              <label>Question Text</label>
              <input type="text" value={questionText} onChange={e => setQuestionText(e.target.value)} required />
            </div>
            <div className="responsive-grid-2-sm">
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

      <section className="content-section" style={{ margin: 0, gridColumn: '1 / -1' }}>
        <h2>3. Manage Quizzes</h2>
        {quizzes.length === 0 ? (
          <p>No quizzes created yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Quiz Title</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <React.Fragment key={quiz.id}>
                    <tr style={{ borderBottom: expandedQuizId === quiz.id ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{quiz.title}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{quiz.description}</td>
                      <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button onClick={() => toggleQuestions(quiz.id)} className="copy-btn" style={{ margin: 0, background: expandedQuizId === quiz.id ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                          {expandedQuizId === quiz.id ? 'Hide Questions' : 'View Questions'}
                        </button>
                        <button onClick={() => editQuiz(quiz)} className="copy-btn" style={{ margin: 0, borderColor: 'var(--accent)', color: 'var(--accent)' }}>Edit</button>
                        <button onClick={() => deleteQuiz(quiz.id)} className="copy-btn" style={{ margin: 0, borderColor: 'var(--error)', color: 'var(--error)' }}>Delete</button>
                      </td>
                    </tr>
                    
                    {/* Render Questions if Expanded */}
                    {expandedQuizId === quiz.id && (
                      <tr>
                        <td colSpan={3} style={{ padding: '0 1rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', marginTop: 0 }}>Questions ({quizQuestions.length})</h4>
                            {quizQuestions.map((q, idx) => (
                              <div key={q.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                                {editingQuestion?.id === q.id ? (
                                  <form onSubmit={saveEditedQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input type="text" value={editingQuestion.question_text} onChange={e => setEditingQuestion({...editingQuestion, question_text: e.target.value})} required style={{ background: '#000', color: 'white', padding: '0.5rem', border: '1px solid var(--accent)' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                      <input type="text" value={editingQuestion.optA} onChange={e => setEditingQuestion({...editingQuestion, optA: e.target.value})} required />
                                      <input type="text" value={editingQuestion.optB} onChange={e => setEditingQuestion({...editingQuestion, optB: e.target.value})} required />
                                      <input type="text" value={editingQuestion.optC} onChange={e => setEditingQuestion({...editingQuestion, optC: e.target.value})} required />
                                      <input type="text" value={editingQuestion.optD} onChange={e => setEditingQuestion({...editingQuestion, optD: e.target.value})} required />
                                    </div>
                                    <select value={editingQuestion.correctAnswer} onChange={e => setEditingQuestion({...editingQuestion, correctAnswer: e.target.value})} style={{ padding: '0.5rem', background: '#000', color: 'white' }}>
                                      <option value="A">Option A</option>
                                      <option value="B">Option B</option>
                                      <option value="C">Option C</option>
                                      <option value="D">Option D</option>
                                    </select>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                      <button type="submit" className="copy-btn" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Save</button>
                                      <button type="button" onClick={() => setEditingQuestion(null)} className="copy-btn">Cancel</button>
                                    </div>
                                  </form>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{idx + 1}. {q.question_text}</p>
                                      <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {q.options.map((opt: string, i: number) => (
                                          <li key={i} style={{ color: opt === q.correct_answer ? '#10b981' : 'inherit' }}>
                                            {opt} {opt === q.correct_answer && "(Correct)"}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button onClick={() => startEditingQuestion(q)} className="copy-btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>Edit</button>
                                      <button onClick={() => deleteQuestion(q.id, quiz.id)} className="copy-btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderColor: 'var(--error)', color: 'var(--error)' }}>Delete</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {quizQuestions.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No questions yet.</p>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
