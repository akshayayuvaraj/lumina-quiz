// src/pages/QuizList.jsx
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function SkeletonCard() {
  return (
    <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="skeleton h-5 w-3/4 rounded-lg mb-3" />
      <div className="skeleton h-3 w-full rounded mb-2" />
      <div className="skeleton h-3 w-2/3 rounded mb-6" />
      <div className="flex gap-3">
        <div className="skeleton h-8 w-20 rounded-xl" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  );
}

function QuizCard({ quiz, delay }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;
    const ry = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }

  function handleMouseLeave() {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }

  const qCount = quiz.questions?.length || 0;
  const colors = ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500'];
  const color = colors[Math.abs(quiz.title?.charCodeAt(0) || 0) % 4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass rounded-3xl overflow-hidden cursor-default"
      style={{ border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.15s ease, box-shadow 0.3s ease' }}
      onMouseEnter={() => {
        if (cardRef.current) cardRef.current.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.15)';
      }}
    >
      {/* Color bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

      <div className="p-6">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="px-2.5 py-1 rounded-lg text-xs font-mono text-white/40"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {qCount} questions
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <span className="text-sm">📝</span>
          </div>
        </div>

        <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-2">
          {quiz.title}
        </h3>
        <p className="text-white/40 font-body text-sm leading-relaxed mb-5 line-clamp-2">
          {quiz.description || 'No description provided'}
        </p>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="btn-primary px-4 py-2 rounded-xl text-sm font-display font-semibold text-white flex-1"
          >
            Play Quiz →
          </motion.button>
          <button
            className="px-3 py-2 rounded-xl text-sm font-body text-white/40 hover:text-white/70 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuizList() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setQuizzes(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return unsub;
  }, [user.uid]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 pt-28 pb-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4"
              style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
              <span className="text-xs text-purple-300 font-body">✦ Your Library</span>
            </div>
            <h1 className="font-display font-bold text-4xl text-white mb-1">
              My <span className="gradient-text">Quizzes</span>
            </h1>
            <p className="text-white/40 font-body">
              {loading ? 'Loading...' : `${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''} created`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-6 py-3 rounded-2xl font-display font-bold text-white"
              >
                + New Quiz
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-16 text-center"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-6xl mb-6">✦</div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">No quizzes yet</h3>
            <p className="text-white/40 font-body mb-8">Create your first quiz and share knowledge with the world</p>
            <Link to="/create">
              <button className="btn-primary px-8 py-3 rounded-2xl font-display font-bold text-white">
                Create First Quiz
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, i) => (
              <QuizCard key={quiz.id} quiz={quiz} delay={i * 0.08} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}