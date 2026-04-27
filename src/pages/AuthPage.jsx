// src/pages/AuthPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/quizzes');
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'An error occurred');
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/quizzes');
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Google login failed');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6 pt-24"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 relative overflow-hidden"
          style={{ border: '1px solid rgba(168,85,247,0.2)' }}
        >
          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16"
            style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)' }} />

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(168,85,247,0.4)' }}>
              ✦
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Join Lumina'}
            </h1>
            <p className="text-white/40 font-body text-sm">
              {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-2xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-body font-medium text-sm transition-all ${
                  mode === m
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
                style={mode === m ? { background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.3))' } : {}}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full glass glass-hover rounded-2xl py-3 flex items-center justify-center gap-3 mb-6 font-body font-medium text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs font-body">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div className="relative">
                  <label className="block text-xs font-body text-white/40 mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-neon w-full px-4 py-3 rounded-xl font-body text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <label className="block text-xs font-body text-white/40 mb-2 ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-neon w-full px-4 py-3 rounded-xl font-body text-sm"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-body text-white/40 mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-neon w-full px-4 py-3 rounded-xl font-body text-sm"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl text-sm font-body text-red-300"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-3.5 rounded-xl font-display font-bold text-white text-base disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}