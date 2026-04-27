// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const links = user
    ? [
        { to: '/quizzes', label: 'My Quizzes' },
        { to: '/create', label: 'Create Quiz' },
      ]
    : [];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.4))', border: '1px solid rgba(168,85,247,0.4)' }}>
            ✦
          </div>
          <span className="font-display font-bold text-xl gradient-text">Lumina</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="relative font-body text-sm text-white/70 hover:text-white transition-colors group">
              {label}
              <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${location.pathname === to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-white/70 font-body">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-neon px-4 py-2 rounded-xl text-sm font-body font-medium text-white/80"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <button className="btn-primary px-5 py-2 rounded-xl text-sm font-body font-semibold text-white">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}