// src/pages/HomePage.jsx
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeScene from '@/components/ThreeScene';
import { useAuth } from '@/context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const features = [
  { icon: '🤖', title: 'AI-Powered', desc: 'Generate intelligent quizzes with advanced AI assistance' },
  { icon: '⚡', title: 'Lightning Fast', desc: 'Real-time quiz creation and deployment in seconds' },
  { icon: '🎯', title: 'Smart Analytics', desc: 'Deep insights into performance and learning patterns' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Enterprise-grade security for all your quiz data' },
];

export default function HomePage() {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 30);
      mouseY.set((clientY / innerHeight - 0.5) * 30);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-1">
          <Suspense fallback={null}>
            <ThreeScene />
          </Suspense>
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 z-2"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, #030712 100%)',
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            style={{ border: '1px solid rgba(168,85,247,0.3)' }}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm font-body text-white/60 font-medium">AI-Powered Quiz Platform</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">v2.0</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display font-extrabold leading-none mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">Create Smart</span>
            <br />
            <span className="gradient-text glow-text">Quizzes with AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="font-body text-white/50 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build, share, and analyze intelligent quizzes. Powered by cutting-edge AI to
            transform how you create and consume knowledge.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={user ? '/create' : '/auth'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-8 py-4 rounded-2xl text-lg font-display font-bold text-white"
              >
                Start Creating →
              </motion.button>
            </Link>
            <Link to={user ? '/quizzes' : '/auth'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-neon px-8 py-4 rounded-2xl text-lg font-display font-semibold text-white/80"
              >
                Explore Quizzes
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex items-center justify-center gap-8 mt-16"
          >
            {[['10K+', 'Quizzes Created'], ['98%', 'Satisfaction'], ['50ms', 'Avg. Load Time']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-2xl gradient-text">{num}</div>
                <div className="text-xs text-white/40 font-body mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-xs text-white/30 font-body">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="w-1 h-2 rounded-full bg-purple-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
              <span className="text-sm font-body text-blue-300">Why Lumina?</span>
            </div>
            <h2 className="font-display font-bold text-5xl text-white mb-4">
              Everything you need to
              <span className="gradient-text"> quiz smarter</span>
            </h2>
            <p className="text-white/40 font-body text-lg max-w-2xl mx-auto">
              A complete platform for knowledge assessment, designed with precision and powered by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass glass-hover rounded-3xl p-6 cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-white/40 font-body text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto glass rounded-3xl p-16 text-center relative overflow-hidden"
          style={{ border: '1px solid rgba(168,85,247,0.2)' }}
        >
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />

          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 relative">
            Ready to{' '}
            <span className="gradient-text glow-text">illuminate</span>
            {' '}knowledge?
          </h2>
          <p className="text-white/40 font-body text-lg mb-10 relative">
            Join thousands of educators and learners building smarter quizzes.
          </p>
          <Link to={user ? '/create' : '/auth'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-10 py-4 rounded-2xl text-lg font-display font-bold text-white relative"
            >
              Get Started Free →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-white/20 font-body text-sm">
          © 2025 Lumina Quiz. Built with ✦ and AI.
        </p>
      </footer>
    </motion.div>
  );
}