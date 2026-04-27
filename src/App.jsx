// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import AmbientOrbs from '@/components/AmbientOrbs';
import PageLoader from '@/components/PageLoader';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import QuizCreate from '@/pages/QuizCreate';
import QuizList from '@/pages/QuizList';
import QuizPlayer from '@/pages/QuizPlayer';
import ResultPage from '@/pages/ResultPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><QuizCreate /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizPlayer /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <Router>
      <CustomCursor />
      <AmbientOrbs />
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}