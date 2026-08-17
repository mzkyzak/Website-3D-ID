import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { pulseRing } from '../utils/gsapAnimations';

export default function Scene2Portal({ onComplete }) {
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  const textRef = useRef(null);
  const timerRef = useRef(null);

  // Mouse & Touch 3D Tilt
  const [tilt, setTilt] = useState({ rotX: 4, rotY: -5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -14;
      const ry = (e.clientX / window.innerWidth - 0.5) * 16;
      setTilt({ rotX: rx, rotY: ry });
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        const rx = (t.clientY / window.innerHeight - 0.5) * -16;
        const ry = (t.clientX / window.innerWidth - 0.5) * 18;
        setTilt({ rotX: rx, rotY: ry });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    // Animate portal rings in
    gsap.fromTo(ringRef.current,
      { scale: 0, opacity: 0, rotate: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' }
    );
    gsap.fromTo(ring2Ref.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.55, duration: 1.1, delay: 0.15, ease: 'back.out(1.2)' }
    );
    gsap.fromTo(textRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power3.out' }
    );

    // Pulse the rings
    pulseRing(ringRef.current);

    // Spinning outer ring
    gsap.to(ring2Ref.current, {
      rotate: 360,
      duration: 8,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });

    // Auto-advance to Scene 3
    timerRef.current = setTimeout(() => {
      gsap.to([ringRef.current, ring2Ref.current, textRef.current], {
        scale: 2.5,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.in',
        stagger: 0.05,
        onComplete,
      });
    }, 2800);

    return () => clearTimeout(timerRef.current);
  }, [onComplete]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none',
      perspective: 1500, /* Enhanced perspective */
    }}>
      {/* 3D Tilt wrapper for entire portal */}
      <motion.div
        animate={{ rotateX: tilt.rotX, rotateY: tilt.rotY }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: 'min(500px, 90vw)',
          height: 'min(500px, 90vw)',
        }}
      >
        {/* Background Fog / Distortion ring */}
        <div style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,0,1,0.15) 0%, transparent 60%)',
          filter: 'blur(30px)',
          transform: 'translateZ(-80px)',
        }} />

        {/* Outer decorative spin ring */}
        <div ref={ring2Ref} style={{
          position: 'absolute',
          width: 'min(420px, 75vw)',
          height: 'min(420px, 75vw)',
          borderRadius: '50%',
          border: '2px dashed rgba(201,168,76,0.6)',
          boxShadow: '0 0 30px rgba(201,168,76,0.2)',
          transform: 'translateZ(-20px)',
        }} />

        {/* Inner energy ring with intense glow */}
        <div style={{
          position: 'absolute',
          width: 'min(340px, 62vw)',
          height: 'min(340px, 62vw)',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 40px rgba(204,0,1,0.5), inset 0 0 40px rgba(204,0,1,0.5)',
          transform: 'translateZ(-5px)',
          animation: 'pulseGlow 2s ease-in-out infinite alternate',
        }} />

        {/* Main portal ring */}
        <div ref={ringRef} style={{
          position: 'absolute',
          width: 'min(280px, 55vw)',
          height: 'min(280px, 55vw)',
          borderRadius: '50%',
          border: '4px solid rgba(204,0,1,0.9)',
          boxShadow: '0 0 80px rgba(204,0,1,0.8), inset 0 0 80px rgba(204,0,1,0.6)',
          background: 'radial-gradient(circle, rgba(204,0,1,0.15) 0%, rgba(0,0,0,0.4) 80%)',
          backdropFilter: 'blur(8px)', /* Glass/distortion effect */
          transform: 'translateZ(15px)',
        }} />

        {/* Center content */}
        <div ref={textRef} style={{ textAlign: 'center', zIndex: 2, transform: 'translateZ(60px)' }}>
          <div style={{
            fontSize: 'clamp(32px, 7vw, 64px)',
            marginBottom: 16,
            filter: 'drop-shadow(0 0 25px rgba(204,0,1,0.8))',
            animation: 'float 3s ease-in-out infinite',
          }}>🇮🇩</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(16px, 3.2vw, 32px)',
            fontWeight: 800,
            letterSpacing: '0.25em',
            color: '#fff',
            textShadow: '0 4px 30px rgba(204,0,1,0.9), 0 0 10px rgba(255,255,255,0.5)',
          }}>
            PORTAL MENUJU MONAS
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1.4vw, 13px)',
            letterSpacing: '0.3em',
            color: 'rgba(201,168,76,0.9)',
            marginTop: 12,
            textShadow: '0 0 10px rgba(201,168,76,0.5)',
          }}>
            Memasuki dimensi perayaan Indonesia...
          </div>
        </div>

        {/* Animated energy particles on ring border */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 2 === 0 ? 8 : 4,
            height: i % 2 === 0 ? 8 : 4,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#ffffff' : (i % 2 === 0 ? '#cc0001' : '#c9a84c'),
            boxShadow: `0 0 15px ${i % 2 === 0 ? '#cc0001' : '#c9a84c'}`,
            transform: `rotate(${i * 30}deg) translateY(-${Math.min(140, 27.5) + (i % 2 === 0 ? 0 : 20)}px) translateZ(${20 + (i % 3) * 10}px)`,
            top: '50%',
            left: '50%',
            marginTop: -4,
            marginLeft: -4,
            animation: `orbit ${3 + (i % 3)}s linear infinite`,
          }} />
        ))}
      </motion.div>
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.6; transform: translateZ(-5px) scale(0.98); }
          100% { opacity: 1; transform: translateZ(-5px) scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
