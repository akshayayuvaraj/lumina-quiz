// src/components/AmbientOrbs.jsx
export default function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="orb w-96 h-96 bg-purple-600" style={{ top: '10%', left: '10%', animationDelay: '0s' }} />
      <div className="orb w-80 h-80 bg-pink-600" style={{ top: '60%', right: '10%', animationDelay: '2s' }} />
      <div className="orb w-64 h-64 bg-blue-600" style={{ bottom: '20%', left: '30%', animationDelay: '4s' }} />
      <div className="orb w-48 h-48 bg-cyan-500" style={{ top: '30%', right: '30%', animationDelay: '1s', opacity: 0.08 }} />
    </div>
  );
}