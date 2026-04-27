// src/components/PageLoader.jsx
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#030712' }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 relative"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(168,85,247,0.5)' }}>
          <span className="text-4xl">✦</span>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent"
            style={{
              background: 'linear-gradient(#030712, #030712) padding-box, linear-gradient(135deg, #a855f7, #ec4899, #3b82f6) border-box',
              animation: 'spin 2s linear infinite'
            }} />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-display font-bold gradient-text mb-3"
      >
        Lumina Quiz
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/40 text-sm font-body mb-10"
      >
        Initializing AI experience...
      </motion.p>

      {/* Loading bar */}
      <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
            opacity: 0.4
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}