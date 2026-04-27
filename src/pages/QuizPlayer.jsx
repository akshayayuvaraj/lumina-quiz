// src/pages/QuizPlayer.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

export default function QuizPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [dir, setDir] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const snap = await getDoc(doc(db, 'quizzes', id));
        if (snap.exists()) {
          setQuiz({ id: snap.id, ...snap.data() });
        } else {
          setError('Quiz not found');
        }
      } catch (e) {
        setError('Failed to load quiz. Check Firebase config.');
        console.error(e);
      }
      setLoading(false);
    }
    fetchQuiz();
  }, [id]);

  function handleSelect(optIdx) {
    if (selected !== null) return;
    setSelected(optIdx);
  }

  function handleNext() {
    const q = quiz.questions[current];
    const newAnswers = [...answers, { selected, correct: q.correct }];
    setAnswers(newAnswers);

    if (current < quiz.questions.length - 1) {
      setDir(1);
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      const score = newAnswers.filter((a) => a.selected === a.correct).length;
      navigate('/result', {
        state: { score, total: quiz.questions.length, quizTitle: quiz.title, quizId: id }
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div className="glass rounded-3xl p-10" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">{error}</h2>
          <p className="text-white/40 font-body mb-6">Make sure Firebase is configured correctly</p>
          <button onClick={() => navigate('/quizzes')} className="btn-neon px-6 py-3 rounded-xl font-body text-white">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[current];
  const progress = ((current) / quiz.questions.length) * 100;
  const optLabels = ['A', 'B', 'C', 'D'];
  const optColors = [
    'rgba(168,85,247,0.7)', 'rgba(236,72,153,0.7)',
    'rgba(59,130,246,0.7)', 'rgba(6,182,212,0.7)',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-6 pt-28 pb-20 flex flex-col items-center"
    >
      <div className="w-full max-w-2xl">
        {/* Quiz title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-sm font-body text-white/40">{quiz.title}</span>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/30">
              Question {current + 1} / {quiz.questions.length}
            </span>
            <span className="text-xs font-mono text-purple-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full progress-glow"
              style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
              initial={{ width: 0 }}
              animate={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Question */}
            <div
              className="glass rounded-3xl p-8 mb-6 relative overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(168,85,247,0.3)' }}>
                  Q{current + 1}
                </div>
                <p className="font-display font-semibold text-xl text-white leading-relaxed">
                  {question.text}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, oi) => {
                const isSelected = selected === oi;
                const isCorrect = selected !== null && oi === question.correct;
                const isWrong = selected === oi && oi !== question.correct;

                return (
                  <motion.button
                    key={oi}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: oi * 0.06 }}
                    whileHover={selected === null ? { x: 6, scale: 1.01 } : {}}
                    whileTap={selected === null ? { scale: 0.99 } : {}}
                    onClick={() => handleSelect(oi)}
                    disabled={selected !== null}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                    style={{
                      background: isCorrect
                        ? 'rgba(34,197,94,0.15)'
                        : isWrong
                        ? 'rgba(239,68,68,0.15)'
                        : isSelected
                        ? 'rgba(168,85,247,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      border: isCorrect
                        ? '1px solid rgba(34,197,94,0.5)'
                        : isWrong
                        ? '1px solid rgba(239,68,68,0.5)'
                        : isSelected
                        ? '1px solid rgba(168,85,247,0.5)'
                        : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: isCorrect
                        ? '0 0 20px rgba(34,197,94,0.2)'
                        : isWrong
                        ? '0 0 20px rgba(239,68,68,0.2)'
                        : isSelected
                        ? '0 0 20px rgba(168,85,247,0.15)'
                        : 'none',
                    }}
                  >
                    {/* Label */}
                    <div
                      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-display font-bold transition-all"
                      style={{
                        background: isCorrect
                          ? 'rgba(34,197,94,0.3)'
                          : isWrong
                          ? 'rgba(239,68,68,0.3)'
                          : isSelected
                          ? optColors[oi]
                          : 'rgba(255,255,255,0.07)',
                      }}
                    >
                      {isCorrect ? '✓' : isWrong ? '✕' : optLabels[oi]}
                    </div>
                    <span className="font-body text-base text-white/80">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="btn-primary w-full py-4 rounded-2xl font-display font-bold text-white text-lg"
              >
                {current < quiz.questions.length - 1 ? 'Next Question →' : 'See Results ✦'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}