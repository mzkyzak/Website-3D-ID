import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { animateSceneIn } from '../utils/gsapAnimations';
import { fireOpening } from '../effects/Fireworks';

/* ── Pure CSS 3D Flag ── */
function Flag3D({ side = 'left' }) {
  const isLeft = side === 'left';
  return (
    <div style={{
      position: 'absolute',
      [isLeft ? 'left' : 'right']: 'clamp(10px, 4vw, 60px)',
      bottom: 'clamp(40px, 10vh, 120px)',
      zIndex: 3,
      transform: `translateZ(30px) rotateY(${isLeft ? '15' : '-15'}deg)`,
      transformStyle: 'preserve-3d',
      pointerEvents: 'none',
    }}>
      {/* Tiang */}
      <div style={{
        width: 4,
        height: 'clamp(120px, 22vh, 220px)',
        background: 'linear-gradient(to bottom, #d4a843, #8b6914, #d4a843)',
        borderRadius: 2,
        boxShadow: '2px 0 10px rgba(0,0,0,0.5), -1px 0 5px rgba(212,168,67,0.3)',
        position: 'relative',
      }}>
        {/* Pucuk tiang (emas) */}
        <div style={{
          position: 'absolute', top: -8, left: -4,
          width: 12, height: 12, borderRadius: '50%',
          background: 'radial-gradient(circle, #ffd700, #b8860b)',
          boxShadow: '0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.4)',
        }} />
        {/* Bendera berkibar */}
        <div style={{
          position: 'absolute',
          top: 0,
          [isLeft ? 'left' : 'right']: 4,
          width: 'clamp(60px, 10vw, 120px)',
          overflow: 'hidden',
          animation: `flagWave3D ${3 + Math.random()}s ease-in-out infinite`,
          transformOrigin: isLeft ? 'left top' : 'right top',
          filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.6))',
        }}>
          {/* Merah */}
          <div style={{
            height: 'clamp(22px, 4vh, 40px)',
            background: 'linear-gradient(90deg, #ff0000, #cc0000, #ff1a1a, #cc0000)',
            borderTopLeftRadius: isLeft ? 0 : 3,
            borderTopRightRadius: isLeft ? 3 : 0,
          }} />
          {/* Putih */}
          <div style={{
            height: 'clamp(22px, 4vh, 40px)',
            background: 'linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff, #e8e8e8)',
            borderBottomLeftRadius: isLeft ? 0 : 3,
            borderBottomRightRadius: isLeft ? 3 : 0,
          }} />
        </div>
      </div>
    </div>
  );
}

/* ── Lens Flare / God Rays ── */
function GodRays() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden',
    }}>
      {/* Central top glow */}
      <div style={{
        position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
        width: 'clamp(300px, 60vw, 800px)', height: 'clamp(200px, 40vh, 500px)',
        background: 'radial-gradient(ellipse, rgba(255,0,0,0.15) 0%, rgba(255,215,0,0.08) 40%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'godRayPulse 4s ease-in-out infinite',
      }} />
      {/* Left ray */}
      <div style={{
        position: 'absolute', top: '10%', left: '-5%',
        width: '40%', height: '60%',
        background: 'linear-gradient(120deg, rgba(255,0,0,0.08) 0%, transparent 60%)',
        filter: 'blur(20px)',
        transform: 'rotate(-15deg)',
        animation: 'godRayPulse 5s ease-in-out infinite 1s',
      }} />
      {/* Right ray */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: '40%', height: '60%',
        background: 'linear-gradient(-120deg, rgba(255,215,0,0.06) 0%, transparent 60%)',
        filter: 'blur(20px)',
        transform: 'rotate(15deg)',
        animation: 'godRayPulse 6s ease-in-out infinite 2s',
      }} />
      {/* Lens flare spot */}
      <div style={{
        position: 'absolute', top: '20%', left: '52%',
        width: 60, height: 60, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,200,50,0.1) 40%, transparent 70%)',
        filter: 'blur(8px)',
        animation: 'lensFlare 3s ease-in-out infinite',
      }} />
    </div>
  );
}

export default function Scene1Intro({ onNext }) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ rotX: 6, rotY: -8 });

  useEffect(() => {
    const timer = setTimeout(() => {
      animateSceneIn(containerRef.current);
      setTimeout(() => fireOpening(), 800);
    }, 300);

    const handleMouseMove = (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -16;
      const ry = (e.clientX / window.innerWidth - 0.5) * 18;
      setTilt({ rotX: rx, rotY: ry });
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        const rx = (t.clientY / window.innerHeight - 0.5) * -18;
        const ry = (t.clientX / window.innerWidth - 0.5) * 20;
        setTilt({ rotX: rx, rotY: ry });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        padding: '0 24px',
        textAlign: 'center',
        perspective: 1500,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      {/* ── God Rays & Light Effects ── */}
      <GodRays />

      {/* ── 3D CSS Flags (left & right) ── */}
      <Flag3D side="left" />
      <Flag3D side="right" />

      {/* ── Flag Bearer Hero Image ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 0.25, y: 0, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%) translateZ(-60px)',
          width: 'clamp(500px, 80vw, 1200px)',
          height: 'clamp(300px, 50vh, 600px)',
          backgroundImage: 'url(/flag_bearer_hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 85%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Left Flag Bearer Side Layer (3D Depth) ── */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -5 }}
        animate={{ opacity: 0.18, x: 0, rotate: -2 }}
        transition={{ duration: 2.2, delay: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '5vh',
          left: '5%',
          transform: 'translateZ(-100px)',
          width: 'clamp(180px, 20vw, 350px)',
          height: 'clamp(270px, 30vh, 520px)',
          backgroundImage: 'url(/flag_bearer_left.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Right Flag Bearer Side Layer (3D Depth) ── */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 5 }}
        animate={{ opacity: 0.18, x: 0, rotate: 2 }}
        transition={{ duration: 2.2, delay: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '5vh',
          right: '5%',
          transform: 'translateZ(-100px)',
          width: 'clamp(180px, 20vw, 350px)',
          height: 'clamp(270px, 30vh, 520px)',
          backgroundImage: 'url(/flag_bearer_right.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── 3D Hero Container ── */}
      <motion.div
        animate={{ rotateX: tilt.rotX, rotateY: tilt.rotY }}
        transition={{ type: 'spring', stiffness: 75, damping: 18 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          maxWidth: 900,
          zIndex: 5,
        }}
      >
        {/* Date badge 3D */}
        <div data-anim style={{ ...styles.badge, transform: 'translateZ(40px)' }}>
          <span style={styles.badgeDot} />
          17 AGUSTUS 1945 • 2026
          <span style={styles.badgeDot} />
        </div>

        {/* Main hero text 3D */}
        <div data-anim style={{ ...styles.heroGroup, transform: 'translateZ(200px)' }}>
          <h1 style={styles.heroSuper}>DIRGAHAYU</h1>
        </div>

        {/* REPUBLIK INDONESIA Glass Box */}
        <div data-anim style={{ ...styles.republikBox, transform: 'translateZ(140px)' }}>
          <div style={styles.boxCornerTopLeft} />
          <div style={styles.boxCornerTopRight} />
          <div style={styles.boxCornerBottomLeft} />
          <div style={styles.boxCornerBottomRight} />
          <h2 style={styles.heroMain}>REPUBLIK INDONESIA</h2>
        </div>

        {/* 81 counter block 3D */}
        <div data-anim style={{ ...styles.numberBlock, transform: 'translateZ(100px)' }}>
          <span style={styles.numberBig}>81</span>
          <div style={styles.numberLabel}>
            <span style={styles.numberTahun}>TAHUN</span>
            <span style={styles.numberSub}>INDONESIA MERDEKA</span>
          </div>
        </div>

        {/* Tagline 3D */}
        <p data-anim style={{ ...styles.tagline, transform: 'translateZ(60px)' }}>
          "Indonesia Berdaulat, Adil, dan Makmur"
        </p>
      </motion.div>

      {/* CTA — fixed outside 3D tilt so clicks always land */}
      <div style={styles.ctaWrap}>
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: 'easeOut' }}
          onClick={onNext}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,0,0,0.8)' }}
          whileTap={{ scale: 0.97 }}
          style={styles.cta}
        >
          MASUK KE PERAYAAN &nbsp; →
        </motion.button>
      </div>

      {/* ── Inline Keyframes ── */}
      <style>{`
        @keyframes flagWave3D {
          0%   { transform: perspective(600px) rotateY(0deg) skewY(0deg); }
          25%  { transform: perspective(600px) rotateY(8deg) skewY(-3deg); }
          50%  { transform: perspective(600px) rotateY(-5deg) skewY(2deg); }
          75%  { transform: perspective(600px) rotateY(7deg) skewY(-2deg); }
          100% { transform: perspective(600px) rotateY(0deg) skewY(0deg); }
        }
        @keyframes godRayPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.08); }
        }
        @keyframes lensFlare {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '7px 22px',
    background: 'rgba(6,5,10,0.75)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 99,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(9px, 1.2vw, 11px)',
    fontWeight: 700,
    letterSpacing: '0.3em',
    color: '#ffffff',
    marginBottom: 20,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#ff2626',
    boxShadow: '0 0 8px #ff2626',
  },
  heroGroup: {
    marginBottom: 16,
    opacity: 0,
  },
  heroSuper: {
    fontFamily: "'Cinzel', 'Montserrat', serif",
    fontSize: 'clamp(40px, 8vw, 90px)',
    fontWeight: 900,
    letterSpacing: '0.12em',
    color: '#ffffff',
    lineHeight: 1.0,
    textShadow: `
      0 2px 10px rgba(255,255,255,0.4),
      0 10px 40px rgba(255,0,0,0.4),
      0 20px 80px rgba(255,0,0,0.2)
    `,
    margin: 0,
  },
  republikBox: {
    position: 'relative',
    padding: '16px 40px',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(15px)',
    borderTop: '1px solid rgba(255,255,255,0.3)',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    borderLeft: '4px solid #ff0000',
    borderRight: '4px solid #ff0000',
    boxShadow: '0 10px 40px rgba(255,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.05)',
    marginBottom: 32,
    opacity: 0,
  },
  boxCornerTopLeft: { position: 'absolute', top: -1, left: -4, width: 12, height: 4, background: '#ff0000' },
  boxCornerBottomLeft: { position: 'absolute', bottom: -1, left: -4, width: 12, height: 4, background: '#ff0000' },
  boxCornerTopRight: { position: 'absolute', top: -1, right: -4, width: 12, height: 4, background: '#ff0000' },
  boxCornerBottomRight: { position: 'absolute', bottom: -1, right: -4, width: 12, height: 4, background: '#ff0000' },
  heroMain: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: 'clamp(18px, 3.5vw, 42px)',
    fontWeight: 900,
    letterSpacing: '0.35em',
    color: '#ffffff',
    lineHeight: 1.1,
    textTransform: 'uppercase',
    textShadow: '0 4px 35px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.2)',
    margin: 0,
  },
  numberBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginBottom: 28,
    opacity: 0,
  },
  numberBig: {
    fontFamily: "'Cinzel', sans-serif",
    fontSize: 'clamp(60px, 12vw, 130px)',
    fontWeight: 900,
    color: '#ff2626',
    lineHeight: 0.85,
    textShadow: '0 0 60px rgba(204,0,1,0.7), 0 4px 30px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.2)',
  },
  numberLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  numberTahun: {
    fontFamily: "'Cinzel', sans-serif",
    fontSize: 'clamp(24px, 4vw, 52px)',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.2em',
    lineHeight: 1.1,
    textShadow: '0 2px 15px rgba(0,0,0,0.8)',
  },
  numberSub: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(10px, 1.5vw, 14px)',
    letterSpacing: '0.3em',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: 800,
    textShadow: '0 0 10px rgba(255,255,255,0.3)',
  },
  tagline: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(14px, 2vw, 22px)',
    letterSpacing: '0.1em',
    color: '#ff2626',
    marginBottom: 24,
    fontStyle: 'italic',
    fontWeight: 700,
    opacity: 0,
    textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 0 10px rgba(255,0,0,0.4)',
  },
  ctaWrap: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 'clamp(52px, 7vh, 68px)',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px',
    zIndex: 120,
    pointerEvents: 'none',
  },
  cta: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(12px, 1.6vw, 15px)',
    fontWeight: 800,
    letterSpacing: '0.22em',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #ff1a1a 0%, #a00001 100%)',
    border: '2px solid rgba(255,100,100,0.7)',
    borderRadius: 10,
    padding: '18px 36px',
    minHeight: 52,
    minWidth: 'min(92vw, 360px)',
    cursor: 'pointer',
    boxShadow: '0 8px 40px rgba(204,0,1,0.6)',
    pointerEvents: 'auto',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  },
};
