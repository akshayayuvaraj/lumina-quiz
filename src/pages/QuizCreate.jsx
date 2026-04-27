import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';

const emptyQuestion = () => ({
  id: Date.now() + Math.random(),
  text: '',
  options: ['', '', '', ''],
  correct: 0,
});

export default function QuizCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mode & AI States
  const [mode, setMode] = useState('manual'); // 'manual' or 'ai'
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Quiz States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // --- AI Logic (Using native fetch to avoid SDK errors) ---
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) { 
      setError('Please enter a topic for the AI.'); 
      return; 
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: "You are a quiz generator. Return a JSON object with a 'questions' array. Each question object must have 'text', 'options' (array of 4 strings), and 'correct' (integer 0-3 index). No conversational text." 
            },
            { role: "user", content: `Generate a 5-question quiz about: ${aiPrompt}` }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to contact Groq");
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      
      const formattedQuestions = content.questions.map(q => ({
        ...q,
        id: Date.now() + Math.random()
      }));

      setQuestions(formattedQuestions);
      setTitle(`${aiPrompt} Quiz`); 
      setMode('manual'); 

    } catch (err) {
      console.error("AI Error:", err);
      setError("AI generation failed. Check your API key and internet connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Manual Question Logic ---
  function addQuestion() { setQuestions((prev) => [...prev, emptyQuestion()]); }
  function removeQuestion(id) { setQuestions((prev) => prev.filter((q) => q.id !== id)); }
  function updateQuestion(id, field, value) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  }
  function updateOption(qId, idx, value) {
    setQuestions((prev) => prev.map((q) =>
      q.id === qId ? { ...q, options: q.options.map((o, i) => (i === idx ? value : o)) } : q
    ));
  }

  async function handleSave() {
    if (!title.trim()) { setError('Please add a quiz title'); return; }
    if (questions.some(q => !q.text.trim())) { setError('Please fill all question texts'); return; }
    
    setSaving(true);
    setError('');
    try {
      await addDoc(collection(db, 'quizzes'), {
        title, description, questions,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        plays: 0,
      });
      navigate('/quizzes');
    } catch (err) {
      setError('Failed to save quiz.');
      console.error(err);
    }
    setSaving(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen px-6 pt-28 pb-20">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4" style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
            <span className="text-xs text-purple-300 font-body">✦ Quiz Creator</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-2">
            Create a <span className="gradient-text">New Quiz</span>
          </h1>
          
          {/* Mode Selector */}
          <div className="flex gap-4 mt-6 justify-center sm:justify-start">
            <button 
              onClick={() => setMode('manual')}
              className={`px-6 py-2 rounded-xl font-display text-sm transition-all ${mode === 'manual' ? 'bg-purple-600 text-white shadow-lg' : 'glass text-white/40'}`}
            >
              Manual Mode
            </button>
            <button 
              onClick={() => setMode('ai')}
              className={`px-6 py-2 rounded-xl font-display text-sm transition-all ${mode === 'ai' ? 'bg-purple-600 text-white shadow-lg' : 'glass text-white/40'}`}
            >
              ✨ AI Generator
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'ai' ? (
            <motion.div 
              key="ai-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-8 rounded-3xl border border-purple-500/20"
            >
              <h2 className="text-xl font-display font-bold text-white mb-4">Generate with AI</h2>
              <p className="text-white/40 text-sm mb-6">Describe the topic, and our AI will craft the questions for you instantly.</p>
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. 5 hard questions about Quantum Physics..."
                className="input-neon w-full h-32 mb-6 px-4 py-3 rounded-xl resize-none"
              />
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                {isGenerating ? "Magic in progress..." : "Generate Quiz ✦"}
              </button>
            </motion.div>
          ) : (
            <motion.div key="manual-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass rounded-3xl p-6 mb-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="space-y-4">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title *" className="input-neon w-full px-4 py-3 rounded-xl" />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="input-neon w-full px-4 py-3 rounded-xl resize-none" />
                </div>
              </div>

              {questions.map((q, qi) => (
                <motion.div key={q.id} layout className="glass rounded-3xl p-6 mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-semibold text-white">Question {qi + 1}</span>
                    <button onClick={() => removeQuestion(q.id)} className="text-white/20 hover:text-red-400 px-2">✕</button>
                  </div>
                  <input value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} placeholder="Type your question..." className="input-neon w-full px-4 py-3 rounded-xl mb-4" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, oi) => (
                      <div 
                        key={oi} 
                        onClick={() => updateQuestion(q.id, 'correct', oi)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${q.correct === oi ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${q.correct === oi ? 'bg-purple-500 text-white' : 'border border-white/20 text-white/20'}`}>
                          {q.correct === oi ? '✓' : ['A','B','C','D'][oi]}
                        </div>
                        <input value={opt} onChange={(e) => updateOption(q.id, oi, e.target.value)} placeholder={`Option ${oi + 1}`} onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none text-sm text-white/80 w-full" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              <button onClick={addQuestion} className="w-full py-4 rounded-2xl font-display font-semibold text-purple-300 mb-6 transition-all border-2 border-dashed border-purple-500/30 hover:bg-purple-500/5">
                + Add Question
              </button>

              {error && <div className="p-4 rounded-xl mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20">{error}</div>}

              <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-4 rounded-2xl font-display font-bold text-white text-lg">
                {saving ? 'Publishing...' : 'Publish Quiz ✦'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}