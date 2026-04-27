// src/pages/ResultPage.jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

function CircularScore({ score, total }) {
  const pct = total > 0 ? score / total : 0;
  const radius = 80;
  const circ = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(pct), 300);
    return () => clearTimeout(timer);
  }, [pct]);

  const strokeDash = progress * circ;
  const color = pct >= 0.8 ? '#22c55e' : pct >= 0.5 ? '#a855f7' : '#ef4444';
  const grade = pct >= 0.8 ? 'Excellent!' : pct >= 0.6 ? 'Good Job!' : pct >= 0.4 ? 'Keep Practicing' : 'Try Again';

  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="200" className="rotate-[-90deg]">
        {/* Background ring */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />
        {/* Progress ring */}
        <motion.circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - strokeDash }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <div className="font-display font-extrabold text-4xl" style={{ color }}>
            {score}/{total}
          </div>
          <div className="font-body text-sm text-white/40 mt-1">
            {Math.round(pct * 100)}%
          </div>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 font-display font-bold text-xl"
        style={{ color }}
      >
        {grade}
      </motion.p>
    </div>
  );
}

const messages = {
  high: ["🎉 Incredible! You're a quiz master!", "⭐ Outstanding performance!", "🔥 On fire! Perfect score territory!"],
  mid: ["👍 Well done! Almost there!", "💪 Great effort! Keep pushing!", "✨ Solid performance!"],
  low: ["📚 Keep learning, you'll get there!", "🔄 Practice makes perfect!", "💡 Great attempt, try again!"],
};

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const confettiFired = useRef(false);

  const { score = 0, total = 0, quizTitle = 'Quiz', quizId } = state || {};
  const pct = total > 0 ? score / total : 0;

  const tier = pct >= 0.7 ? 'high' : pct >= 0.4 ? 'mid' : 'low';
  const message = messages[tier][Math.floor(Math.random() * 3)];

  useEffect(() => {
    if (!confettiFired.current && pct >= 0.7) {
      confettiFired.current = true;
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#a855f7', '#ec4899', '#3b82f6', '#06b6d4', '#f59e0b'],
        });
        setTimeout(() => {
          confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#a855f7', '#ec4899'] });
          confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3b82f6', '#06b6d4'] });
        }, 400);
      }, 600);
    }
  }, [pct]);

  const stats = [
    { label: 'Correct', value: score, color: '#22c55e' },
    { label: 'Incorrect', value: total - score, color: '#ef4444' },
    { label: 'Accuracy', value: `${Math.round(pct * 100)}%`, color: '#a855f7' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-6 pt-28 pb-20 flex flex-col items-center"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4"
            style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
            <span className="text-xs text-purple-300 font-body">✦ Quiz Complete</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-2">
            Your <span className="gradient-text glow-text">Results</span>
          </h1>
          <p className="text-white/40 font-body text-sm">{quizTitle}</p>
        </motion.div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.1) 0%, transparent 60%)' }} />

          <CircularScore score={score} total={total} />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="font-body text-white/50 mt-4 text-sm"
          >
            {message}
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass rounded-2xl p-4 text-center"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="font-display font-bold text-2xl mb-1" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs font-body text-white/30">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          {quizId && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="btn-primary w-full py-4 rounded-2xl font-display font-bold text-white text-base"
            >
              Play Again ↺
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quizzes')}
            className="btn-neon w-full py-4 rounded-2xl font-display font-semibold text-white/80 text-base"
          >
            Back to Quizzes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create')}
            className="py-3 rounded-2xl font-body text-white/30 hover:text-white/50 text-sm transition-colors"
          >
            Create Your Own Quiz →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}