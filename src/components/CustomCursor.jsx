// src/components/CustomCursor.jsx
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    let animId;
    const animateRing = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`;
      }
      animId = requestAnimationFrame(animateRing);
    };
    animateRing();

    const handleMouseDown = () => {
      if (dotRef.current) dotRef.current.style.transform += ' scale(0.5)';
      if (ringRef.current) ringRef.current.style.transform += ' scale(1.5)';
    };
    const handleMouseUp = () => {};

    const handleHover = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '60px';
        ringRef.current.style.height = '60px';
        ringRef.current.style.borderColor = 'rgba(168,85,247,0.9)';
        ringRef.current.style.backgroundColor = 'rgba(168,85,247,0.1)';
      }
    };
    const handleHoverLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.borderColor = 'rgba(168,85,247,0.5)';
        ringRef.current.style.backgroundColor = 'transparent';
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    const interactives = document.querySelectorAll('a, button, input, textarea, [data-cursor]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleHoverLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" style={{ transition: 'width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s' }} />
    </>
  );
}