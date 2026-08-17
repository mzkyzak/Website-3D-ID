import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { fireCelebration } from '../effects/Fireworks';
import {
  loadAudio,
  loadPartyAudio,
  playAudio,
  crossfadeToParty,
  toggleMute,
} from '../utils/audio';

/* ── Typewriter — NO cursor ▍ — clean professional ── */
function Typewriter({ text, delay = 0, speed = 28, style, replayKey = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setStarted(false);
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay, replayKey, text]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed]);

  return (
    <span style={{ display: 'inline', whiteSpace: 'pre-wrap', ...style }}>
      {displayed}
    </span>
  );
}

/* ── 3D Floating Card Component ── */
function FloatingCard3D({ children, style, tiltX = 0, tiltY = 0, zDepth = 60, delay = 0, hoverScale = 1.04, borderColor = 'rgba(204,0,1,0.5)', flat = false }) {
  return (
    <motion.div
      initial={flat ? { opacity: 0, y: 24 } : { opacity: 0, y: 60, rotateX: 20, scale: 0.88 }}
      animate={flat ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, rotateX: tiltX, rotateY: tiltY, scale: 1 }}
      whileHover={flat ? {} : {
        rotateX: 0, rotateY: 0, scale: hoverScale, y: -6,
        boxShadow: '0 20px 60px rgba(204,0,1,0.35), 0 0 40px rgba(255,255,255,0.08)',
        transition: { duration: 0.3 }
      }}
      transition={{ type: 'spring', stiffness: 55, damping: 16, delay }}
      style={{
        transformStyle: flat ? 'flat' : 'preserve-3d',
        perspective: flat ? undefined : 1200,
        transform: flat ? undefined : `translateZ(${zDepth}px)`,
        background: 'linear-gradient(145deg, rgba(8,4,14,0.92), rgba(15,8,22,0.96))',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `2px solid ${borderColor}`,
        borderRadius: 14,
        padding: 'clamp(18px, 3vw, 32px)',
        boxShadow: `0 12px 40px rgba(0,0,0,0.6), -4px 6px 0px ${borderColor}`,
        position: 'relative',
        zIndex: flat ? 1 : undefined,
        ...style,
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, transform: flat ? undefined : 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Chat-style Message Bubble ── */
function ChatBubble({ name, avatar, message, align = 'left', color = '#ff2626' }) {
  const isRight = align === 'right';
  const zVal = isRight ? 45 : 30;
  return (
    <motion.div
      variants={chatBubbleReveal}
      style={{
        display: 'flex',
        flexDirection: isRight ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 12,
        maxWidth: '85%',
        alignSelf: isRight ? 'flex-end' : 'flex-start',
        transformStyle: 'preserve-3d',
        transform: `translateZ(${zVal}px) rotateY(${isRight ? '-8' : '8'}deg)`,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, rgba(0,0,0,0.5))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, border: `2px solid ${color}`,
        boxShadow: `0 0 12px ${color}40`,
      }}>
        {avatar}
      </div>
      {/* Bubble */}
      <div style={{
        background: isRight
          ? 'linear-gradient(135deg, rgba(204,0,1,0.15), rgba(10,5,15,0.9))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(10,5,15,0.9))',
        border: `1px solid ${isRight ? 'rgba(204,0,1,0.3)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: isRight ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        padding: '12px 16px',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 4px 15px rgba(0,0,0,0.4)`,
      }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 800,
          letterSpacing: '0.15em', color: color, marginBottom: 4, textTransform: 'uppercase',
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 'clamp(12px, 1.5vw, 14px)',
          lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', fontWeight: 500,
        }}>
          {message}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Framer Motion Smooth Reveal Variants ── */
const smoothRevealLeft = {
  hidden: {
    opacity: 0,
    x: -300,
    scale: 0.85,
    filter: "blur(15px)"
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)"
  }
};

const smoothRevealRight = {
  hidden: {
    opacity: 0,
    x: 300,
    scale: 0.85,
    filter: "blur(15px)"
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)"
  }
};

const zoomReveal = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    filter: "blur(15px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)"
  }
};

const chatContainerReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.22
    }
  }
};

const chatBubbleReveal = {
  hidden: { opacity: 0, y: 35, scale: 0.88, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
};

const ctaBounce = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.45,
      duration: 1.2
    }
  }
};

export default function Scene3Flag({ onNext }) {
  const containerRef = useRef(null);
  const poleRef = useRef(null);
  const flagRef = useRef(null);
  const cloudLeftRef = useRef(null);
  const cloudRightRef = useRef(null);

  // Scroll-driven visibility refs for typewriter replay
  const titleViewRef = useRef(null);
  const prokViewRef = useRef(null);
  const insightViewRef = useRef(null);
  const titleInView = useInView(titleViewRef, { once: false, amount: 0.3 });
  const prokInView = useInView(prokViewRef, { once: false, amount: 0.2 });
  const insightInView = useInView(insightViewRef, { once: false, amount: 0.2 });

  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  // Mouse & Touch 3D Tilt
  const [tilt, setTilt] = useState({ rotX: 5, rotY: -6 });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -12;
      const ry = (e.clientX / window.innerWidth - 0.5) * 14;
      setTilt({ rotX: rx, rotY: ry });
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const rx = (touch.clientY / window.innerHeight - 0.5) * -14;
        const ry = (touch.clientX / window.innerWidth - 0.5) * 16;
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

  // Replay typewriter on scroll handled by useInView

  useEffect(() => {
    Promise.all([
      loadAudio('/audio/backsound.mp3'),
      loadPartyAudio('/audio/songs_pesta.mp3'),
    ]).then(([backOk, partyOk]) => {
      if (backOk || partyOk) {
        setAudioReady(true);
        if (backOk) playAudio(2.5);
      }
    });

    const tl = gsap.timeline({ delay: 0.2 });

    const hideClouds = () => {
      [cloudLeftRef, cloudRightRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.visibility = 'hidden';
          ref.current.style.opacity = '0';
          ref.current.style.pointerEvents = 'none';
        }
      });
    };

    // 0s: Clouds part open (skip on mobile — they block scroll content on Android)
    if (window.innerWidth <= 768) {
      hideClouds();
    } else {
      tl.fromTo(cloudLeftRef.current,
        { x: '0%' }, { x: '-110%', duration: 2.5, ease: 'power2.inOut' }, 0)
        .fromTo(cloudRightRef.current,
          { x: '0%' }, { x: '110%', duration: 2.5, ease: 'power2.inOut' }, 0)
        .call(hideClouds, [], 2.6);
    }

    // 1.5s: Flagpole rises → 3.0s: Flag unfurls → 4.5s: Fireworks + pesta song
    // (chained onto `tl` as its own statement so it runs regardless of the
    // mobile/desktop branch above — chaining directly off the if/else block
    // is a syntax error in JS)
    tl.fromTo(poleRef.current,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 2.2, ease: 'power3.out' }, 1.5)

      .fromTo(flagRef.current,
        { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
        { scaleX: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.6)' }, 3)

      .call(() => {
        fireCelebration();
        crossfadeToParty();
      }, [], 4.5);

    // Set show state to true immediately for remaining components
    setShowChat(true);

    return () => tl.kill();
  }, []);

  const handleToggleMute = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        overflowY: 'auto',
      }}
    >
      {/* ═══════════ STARS ═══════════ */}
      <div className="s3-stars" />

      {/* ═══════════ METEORS ═══════════ */}
      <div className="s3-meteor-field">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="s3-meteor" style={{
            left: `${(i * 6 + Math.random() * 4) % 100}%`,
            top: `${-50 + (i % 4) * -25}px`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${2 + (i % 5) * 0.4}s`,
          }} />
        ))}
      </div>

      {/* ═══════════ LENS FLARE ═══════════ */}
      <div className="s3-lens-flare" />
      <div className="s3-lens-flare-2" />

      {/* ═══════════ CLOUD OVERLAY (LAYER BELAKANG) ═══════════ */}
      <div ref={cloudLeftRef} className="s3-cloud" style={cloudStyle('left')} />
      <div ref={cloudRightRef} className="s3-cloud" style={cloudStyle('right')} />

      {/* ═══════════ MAIN CONTENT — 3D DEPTH LAYERS ═══════════ */}
      <div className="s3-main-content" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4vh 16px 16vh',
        minHeight: '100%',
        position: 'relative',
        zIndex: 20,
        perspective: isMobile ? undefined : 2000,
      }}>

        {/* ══════ LAYER DEPAN: Flagpole + 3D Waving Flag ══════ */}
        <div style={{ position: 'relative', height: 'clamp(240px, 42vh, 380px)', marginBottom: 24, perspective: 1000 }}>
          {/* Metallic Silver Pole */}
          <div ref={poleRef} style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: 7,
            height: '100%',
            background: 'linear-gradient(to bottom, #ffffff, #c0c0c0, #707070, #303030)',
            borderRadius: 4,
            boxShadow: '0 0 20px rgba(0,0,0,0.9), 2px 0 8px rgba(255,255,255,0.4)',
            opacity: 0,
            zIndex: 2,
          }}>
            {/* Top Finial */}
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              width: 18, height: 18,
              background: 'radial-gradient(circle, #ffffff, #d0d0d0, #909090)',
              borderRadius: '50%',
              boxShadow: '0 0 18px rgba(255,255,255,0.8)',
            }} />
          </div>

          {/* Bendera Merah Putih 3D Berkibar */}
          <div ref={flagRef} style={{
            position: 'absolute', top: 10, left: 'calc(50% + 7px)',
            width: 'clamp(160px, 28vw, 260px)',
            height: 'clamp(105px, 17vw, 168px)',
            opacity: 0, zIndex: 3,
            filter: 'drop-shadow(8px 8px 20px rgba(0,0,0,0.8))',
          }}>
            {/* MERAH */}
            <div className="flag-wave-3d" style={{
              width: '100%', height: '50%',
              background: 'linear-gradient(135deg, #cc0001 0%, #ff1a1a 40%, #b30000 75%, #800000 100%)',
              boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.35)',
              borderTop: '2px solid rgba(255,38,38,0.6)',
            }} />
            {/* PUTIH */}
            <div className="flag-wave-3d" style={{
              width: '100%', height: '50%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 40%, #e0e0e0 75%, #c0c0c0 100%)',
              boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.12)',
              borderBottom: '2px solid rgba(255,255,255,0.6)',
            }} />
          </div>
        </div>

        {/* ══════ LAYER TENGAH: 3D Title with Interactive Tilt ══════ */}
        <motion.div
          ref={titleViewRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={zoomReveal}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            animate={{ rotateX: tilt.rotX, rotateY: tilt.rotY }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            style={{
              textAlign: 'center',
              marginBottom: 28,
              perspective: 1200,
              transformStyle: 'preserve-3d',
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.25)',
              borderLeft: '3px solid #ff0000',
              borderRight: '3px solid #ff0000',
              borderRadius: 16,
              padding: 'clamp(14px, 3vw, 28px) clamp(20px, 4vw, 50px)',
              position: 'relative',
            }}
          >
            {/* Red bracket corners */}
            <div style={{ position: 'absolute', top: -1, left: -3, width: 10, height: 3, background: '#ff0000' }} />
            <div style={{ position: 'absolute', top: -1, right: -3, width: 10, height: 3, background: '#ff0000' }} />
            <div style={{ position: 'absolute', bottom: -1, left: -3, width: 10, height: 3, background: '#ff0000' }} />
            <div style={{ position: 'absolute', bottom: -1, right: -3, width: 10, height: 3, background: '#ff0000' }} />

            <div style={st.badge}>
              17 AGUSTUS 1945 • 2026
            </div>

            {/* DIRGAHAYU — typewriter replays on scroll via useInView */}
            <h1 style={st.heroTitle}>
              {titleInView ? <Typewriter text="DIRGAHAYU" delay={0} speed={60} replayKey={titleInView ? 1 : 0} /> : ''}
            </h1>

            <h2 style={st.heroSub}>
              {titleInView ? <Typewriter text="REPUBLIK INDONESIA" delay={0.5} speed={40} replayKey={titleInView ? 1 : 0} /> : ''}
            </h2>

            <div style={st.yearBadge}>
              <span style={st.yearNum}>81</span>
              <span style={st.yearText}>TAHUN INDONESIA MERDEKA</span>
            </div>

            <div style={st.themeLine}>
              {titleInView ? <Typewriter text={'"Indonesia Berdaulat, Adil, dan Makmur"'} delay={1.4} speed={25} replayKey={titleInView ? 1 : 0} /> : ''}
            </div>
          </motion.div>
        </motion.div>

        {/* ══════ KARTU 1: PROKLAMASI — LARGER, BOLDER, BOXED HEADER ══════ */}
        <motion.div
          ref={prokViewRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={smoothRevealLeft}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 800, marginBottom: 40, perspective: 2000 }}
        >
          <motion.div
            animate={{ rotateX: tilt.rotX * 0.5, rotateY: tilt.rotY * 0.5 }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            className="s3-prok-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              transformStyle: isMobile ? 'flat' : 'preserve-3d',
              animation: isMobile ? 'borderGlow 4s ease-in-out infinite' : 'proklamasiFloat 6s ease-in-out infinite, borderGlow 4s ease-in-out infinite',
              border: '3px solid rgba(204,0,1,0.8)',
              borderRadius: 24,
              background: 'linear-gradient(145deg, rgba(8,4,14,0.95), rgba(15,8,22,0.98))',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 50px rgba(204,0,1,0.6)',
            }}
          >
            {/* ── Shine Effect Overlay ── */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
              <div style={{
                position: 'absolute', top: 0, left: '-120%', width: '50%', height: '100%',
                transform: 'skewX(-25deg)',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                animation: 'shineEffect 5s linear infinite'
              }} />
            </div>

            {/* ── Boxed Header ── */}
            <div style={{
              background: 'linear-gradient(135deg, #ff0000 0%, #8b0000 100%)',
              padding: '18px 40px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
              transform: 'translateZ(80px)',
              borderBottom: '2px solid rgba(255,255,255,0.15)',
              boxShadow: '0 10px 30px rgba(204,0,1,0.4)',
            }}>
              <span style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>📜</span>
              <span style={{
                fontFamily: "'Cinzel', 'Montserrat', serif",
                fontSize: 'clamp(16px, 2.5vw, 24px)',
                fontWeight: 900, letterSpacing: '0.2em', color: '#fff',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                textTransform: 'uppercase',
              }}>
                PROKLAMASI KEMERDEKAAN
              </span>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: 'clamp(24px, 4vw, 40px)', textAlign: 'center' }}>
              <div style={st.prokText}>
                {prokInView && (
                  <Typewriter
                    text="Kami bangsa Indonesia dengan ini menyatakan kemerdekaan Indonesia. Hal-hal jang mengenai pemindahan kekoeasaan d.l.l., diselenggarakan dengan tjara saksama dan dalam tempo jang sesingkat-singkatnja."
                    delay={0.5} speed={18} replayKey={prokInView ? 1 : 0}
                  />
                )}
              </div>

              <div style={st.dividerGold} />

              <div style={st.prokSign}>
                Djakarta, hari 17, boelan 8, tahoen 05<br />
                <span style={{ color: '#ff2626', fontWeight: 900, fontSize: 'clamp(13px, 1.8vw, 16px)' }}>Atas nama bangsa Indonesia</span><br />
                <span style={st.prokSigner}>Soekarno — Hatta</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ══════ KARTU 2-4: BERDAULAT / ADIL / MAKMUR — staggered 3D ══════ */}
        <div style={{ width: '100%', maxWidth: 800, marginBottom: 32 }}>
          {/* Section Header Box */}
          <motion.div
            ref={insightViewRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={zoomReveal}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={st.sectionHeader}
          >
            <span style={{ fontSize: 20 }}>🏛️</span>
            <span>MAKNA TEMA HUT RI KE-81</span>
          </motion.div>
          <div className="s3-insight-grid" style={st.insightGrid}>
            {[
              { icon: '🏛️', title: 'BERDAULAT', text: 'Indonesia yang mampu menentukan arah masa depannya sendiri, berdiri tegak di antara bangsa-bangsa dunia.', tiltY: -8, color: '#ff2626', variants: smoothRevealLeft },
              { icon: '⚖️', title: 'ADIL', text: 'Pembangunan yang merata, keadilan yang dirasakan oleh seluruh rakyat dari Sabang sampai Merauke.', tiltY: 0, color: '#ffffff', variants: zoomReveal },
              { icon: '🌾', title: 'MAKMUR', text: 'Kesejahteraan yang nyata bagi seluruh rakyat Indonesia, dari kota hingga desa, dari gunung hingga lautan.', tiltY: 8, color: '#ff2626', variants: smoothRevealRight },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="s3-insight-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
                variants={isMobile ? zoomReveal : item.variants}
                transition={{ duration: isMobile ? 0.6 : 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                style={{ transformStyle: isMobile ? 'flat' : 'preserve-3d' }}
              >
                <FloatingCard3D
                  flat={isMobile}
                  tiltX={isMobile ? 0 : tilt.rotX * 0.4 + (i - 1) * 5}
                  tiltY={isMobile ? 0 : item.tiltY + tilt.rotY * 0.3}
                  zDepth={isMobile ? 0 : 50 + i * 15}
                  delay={0}
                  borderColor={i === 0 ? 'rgba(255, 0, 0, 0.6)' : 'rgba(255,255,255,0.25)'}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ ...st.insightTitle, color: item.color }}>{item.title}</div>
                  <div style={i === 0 ? st.dividerRed : st.dividerWhite} />
                  <div style={st.insightText}>
                    {isMobile
                      ? item.text
                      : (insightInView && <Typewriter text={item.text} delay={0.4 + i * 0.7} speed={15} replayKey={insightInView ? 1 : 0} />)}
                  </div>
                </FloatingCard3D>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════ CHAT: PESAN UNTUK INDONESIA — Chat Bubbles ══════ */}
        <div style={{ width: '100%', maxWidth: 700, marginBottom: 32 }}>
          {/* Section Header Box */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={zoomReveal}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={st.sectionHeader}
          >
            <span style={{ fontSize: 20 }}>💬</span>
            <span>PESAN UNTUK INDONESIA</span>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={chatContainerReveal}
            animate={{ rotateX: 6 + tilt.rotX * 0.6, rotateY: -12 + tilt.rotY * 0.6 }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            style={{
              background: 'linear-gradient(145deg, rgba(8,4,14,0.92), rgba(15,8,22,0.96))',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 'clamp(16px, 3vw, 28px)',
              display: 'flex', flexDirection: 'column', gap: 16,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              transformStyle: 'preserve-3d',
              perspective: 1200,
            }}
          >
            {showChat && (
              <>
                <ChatBubble
                  name="Bung Karno" avatar="🦅" align="left"
                  color="#ff2626"
                  message="Bangsa yang besar adalah bangsa yang mengenang jasa-jasa pahlawannya. Jangan pernah lupakan perjuangan mereka."
                />
                <ChatBubble
                  name="Bung Hatta" avatar="🎓" align="right"
                  color="#c9a84c"
                  message="Kemerdekaan hanyalah sebuah jembatan. Di seberangnya kita harus membangun masyarakat yang adil dan makmur."
                />
                <ChatBubble
                  name="Rakyat Indonesia" avatar="🇮🇩" align="left"
                  color="#ffffff"
                  message="81 tahun sudah kita merdeka. Semangat kemerdekaan harus terus menyala di hati setiap anak bangsa!"
                />
                <ChatBubble
                  name="By: Taufiq ikhsan muzaky" avatar="🧑‍💼" align="right"
                  color="#00d5ffff"
                  message="gw juga sudah sangat siap melanjutkan perjuangan. Indonesia maju, dan berkarakter,inovatif dan usaha Untuk masa depan saya✌️!"
                />
              </>
            )}

            {/* Divider line */}
            <div style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)', margin: '8px 0' }} />

            {/* Footer */}
            <div style={{
              textAlign: 'center', fontFamily: "'Inter', sans-serif",
              fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
            }}>
              ✨ Tulis pesanmu sendiri di halaman berikutnya
            </div>
          </motion.div>
        </div>

        {/* ── Controls & Next Scene CTA ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={ctaBounce}
          style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {audioReady && (
            <button style={st.controlBtn} onClick={handleToggleMute}>
              {muted ? '🔇' : '🎵'} &nbsp;
              <span style={{ fontSize: 10, letterSpacing: '0.2em' }}>
                {muted ? 'BISU' : 'MUSIK ON'}
              </span>
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(204,0,1,0.7)' }}
            whileTap={{ scale: 0.97 }}
            style={st.nextBtn}
            onClick={onNext}
          >
            TULIS PESAN UNTUK INDONESIA &nbsp;✍️
          </motion.button>
        </motion.div>
      </div>

      {/* ═══════════ GLOBAL SCENE 3 STYLES ═══════════ */}
      <style>{`
      @keyframes proklamasiCardEnter {
  0% {
    opacity: 0;
    transform:
      perspective(2000px)
      translateY(200px)
      translateZ(-400px)
      rotateX(45deg)
      rotateY(-25deg)
      scale(0.6);
  }

  60% {
    opacity: 1;

    transform:
      perspective(2000px)
      translateY(-20px)
      translateZ(80px)
      rotateX(-5deg)
      rotateY(5deg)
      scale(1.05);
  }

  100% {
    opacity: 1;

    transform:
      perspective(2000px)
      translateY(0)
      translateZ(0)
      rotateX(0)
      rotateY(0)
      scale(1);
  }
}

@keyframes proklamasiFloat {
  0%,
  100% {
    transform:
      perspective(2000px)
      translateY(0);
  }

  50% {
    transform:
      perspective(2000px)
      translateY(-15px);
  }
}

@keyframes borderGlow {
  0% {
    box-shadow:
      0 0 20px rgba(204, 0, 1, 0.5);
  }

  50% {
    box-shadow:
      0 0 50px rgba(204, 0, 1, 1),
      0 0 100px rgba(255, 255, 255, 0.4);
  }

  100% {
    box-shadow:
      0 0 20px rgba(204, 0, 1, 0.5);
  }
}

@keyframes shineEffect {
  0% {
    left: -120%;
  }

  100% {
    left: 120%;
  }
}
        @keyframes textGlow3D {
          0%, 100% { text-shadow: 0 4px 40px rgba(0,0,0,0.9), 0 0 35px rgba(204,0,1,0.6), 0 0 80px rgba(204,0,1,0.2); }
          50%       { text-shadow: 0 4px 50px rgba(0,0,0,0.9), 0 0 65px rgba(204,0,1,0.9), 0 0 30px rgba(255,255,255,0.3), 0 0 120px rgba(204,0,1,0.3); }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes flagWave3D {
          0%   { transform: perspective(600px) rotateY(0deg) skewY(0deg); }
          25%  { transform: perspective(600px) rotateY(7deg) skewY(-3deg); }
          50%  { transform: perspective(600px) rotateY(-5deg) skewY(2.5deg); }
          75%  { transform: perspective(600px) rotateY(8deg) skewY(-2deg); }
          100% { transform: perspective(600px) rotateY(0deg) skewY(0deg); }
        }
        .flag-wave-3d {
          animation: flagWave3D 3s ease-in-out infinite;
          transform-origin: left center;
        }

        .s3-stars {
          position: fixed; inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(1.5px 1.5px at 18px 28px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 95px 145px, rgba(221, 46, 46, 0.9), rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 235px 75px, #fff, rgba(0,0,0,0)),
            radial-gradient(2.5px 2.5px at 315px 215px, #ff6666, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 445px 115px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 550px 310px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 180px 400px, rgba(255,200,200,0.8), rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 600px 500px;
          opacity: 0.55;
          z-index: 1;
          animation: s3StarTwinkle 4s ease-in-out infinite alternate;
        }
        @keyframes s3StarTwinkle {
          0%   { opacity: 0.45; }
          100% { opacity: 0.65; }
        }

        .s3-meteor-field {
          position: fixed; inset: 0;
          pointer-events: none; overflow: hidden; z-index: 2;
        }
        .s3-meteor {
          position: absolute;
          width: 2px; height: 80px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(204,0,1,0.7), transparent);
          border-radius: 2px;
          transform: rotate(30deg);
          opacity: 0;
          animation: s3MeteorFall linear infinite;
        }
        @keyframes s3MeteorFall {
          0%   { opacity: 1; transform: translate(0, -80px) rotate(30deg); }
          100% { opacity: 0; transform: translate(-400px, 120vh) rotate(30deg); }
        }

        .s3-lens-flare {
          position: fixed;
          top: 10%; right: 15%;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(204,0,1,0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: s3Flare 6s ease-in-out infinite alternate;
        }
        .s3-lens-flare-2 {
          position: fixed;
          top: 30%; left: 10%;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: s3Flare 8s ease-in-out 2s infinite alternate;
        }
        @keyframes s3Flare {
          0%   { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.7; transform: scale(1.3); }
        }

        @media (max-width: 768px) {
          .s3-cloud {
            display: none !important;
          }
          .s3-main-content {
            padding: 2vh 12px 130px !important;
          }
          .s3-insight-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .s3-insight-item {
            transform: none !important;
            width: 100%;
          }
          .s3-prok-card {
            animation: borderGlow 4s ease-in-out infinite !important;
          }
        }
      `}</style>
    </div>
  );
}

function cloudStyle(side) {
  return {
    position: 'fixed',
    top: 0,
    [side]: 0,
    width: '58%',
    height: '100%',
    background: `radial-gradient(ellipse at ${side === 'left' ? 'right' : 'left'} center, rgba(255,255,255,0.1) 0%, rgba(6,5,10,0.95) 65%)`,
    zIndex: 3,
    pointerEvents: 'none',
  };
}

/* ═══════════ STYLES — RED/WHITE PROFESSIONAL ═══════════ */
const st = {
  badge: {
    fontFamily: "'Montserrat', 'Inter', sans-serif",
    fontSize: 'clamp(9.5px, 1.3vw, 13px)',
    letterSpacing: '0.4em',
    color: '#ffffffff',
    marginBottom: 10,
    fontWeight: 900,
    textTransform: 'uppercase',
    textShadow: '0 0 15px rgba(216, 36, 36, 0.6)',
    WebkitTextStroke: '0.8px #ffececff',
  },
  heroTitle: {
    fontFamily: "'Cinzel', 'Montserrat', serif",
    fontSize: 'clamp(28px, 6vw, 60px)',
    fontWeight: 900,
    color: '#ffffffff',
    letterSpacing: '0.12em',
    lineHeight: 1,
    textShadow: '0 3px 25px rgba(0,0,0,0.9), 0 0 30px rgba(204,0,1,0.6)',
    WebkitTextStroke: '1px rgba(255,255,255,0.3)',
    animation: 'textGlow3D 3s ease-in-out infinite',
    margin: 0,
    minHeight: 'clamp(28px, 6vw, 60px)',
  },
  heroSub: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: 'clamp(13px, 2.5vw, 22px)',
    fontWeight: 900,
    color: '#fffefeff',
    letterSpacing: '0.25em',
    margin: '6px 0 12px',
    minHeight: 'clamp(13px, 2.5vw, 22px)',
    textShadow: '0 2px 20px rgba(204,0,1,0.5), 0 0 10px rgba(0,0,0,0.8)',
    WebkitTextStroke: '0.5px rgba(255,255,255,0.2)',
  },
  yearBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 20px',
    borderRadius: 6,
    background: 'rgba(6,5,10,0.85)',
    border: '1.5px solid rgba(204,0,1,0.5)',
    fontFamily: "'Cinzel', 'Montserrat', serif",
    backdropFilter: 'blur(12px)',
    boxShadow: '0 0 20px rgba(204,0,1,0.2)',
  },
  yearNum: {
    color: '#ff0000ff',
    fontWeight: 900,
    fontSize: 'clamp(22px, 3.5vw, 36px)',
    fontFamily: "'Cinzel', sans-serif",
    textShadow: '0 0 15px rgba(204,0,1,0.5)',
  },
  yearText: {
    color: '#ffffff',
    fontSize: 'clamp(9px, 1.2vw, 11px)',
    letterSpacing: '0.2em',
    fontWeight: 800,
  },
  themeLine: {
    fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
    fontSize: 'clamp(12px, 1.8vw, 17px)',
    fontStyle: 'italic',
    color: '#ff2626',
    marginTop: 12,
    letterSpacing: '0.06em',
    minHeight: 22,
    textShadow: '0 2px 12px rgba(204,0,1,0.4), 0 0 8px rgba(0,0,0,0.7)',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    background: 'linear-gradient(135deg, rgba(204,0,1,0.2), rgba(10,5,15,0.9))',
    border: '1px solid rgba(204,0,1,0.4)',
    borderRadius: '12px 12px 0 0',
    padding: '12px 24px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 900, letterSpacing: '0.25em', color: '#fff',
    textTransform: 'uppercase',
    textShadow: '0 0 10px rgba(255,255,255,0.2)',
    marginBottom: 0,
  },
  dividerRed: {
    width: '100%',
    height: 2,
    background: 'linear-gradient(to right, transparent, #cc0001, transparent)',
    margin: '10px 0',
    boxShadow: '0 0 8px rgba(204,0,1,0.4)',
  },
  dividerWhite: {
    width: '100%',
    height: 1,
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
    margin: '10px 0',
  },
  dividerGold: {
    width: '60%',
    height: 2,
    background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
    margin: '20px auto',
    boxShadow: '0 0 10px rgba(201,168,76,0.4)',
  },
  prokText: {
    fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
    fontSize: 'clamp(13px, 1.8vw, 17px)',
    lineHeight: 1.9,
    color: '#ffffff',
    fontStyle: 'italic',
    fontWeight: 700,
    animation: 'floating 5s ease-in-out infinite',
    textShadow: '0 0 15px rgba(255,255,255,0.15), 0 3px 10px rgba(0,0,0,0.7)',
    minHeight: 60,
  },
  prokSign: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(12px, 1.5vw, 14px)',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 2.0,
    textAlign: 'center',
    fontWeight: 500,
  },
  prokSigner: {
    fontStyle: 'italic',
    color: '#ffffff',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 800,
    textShadow: '0 0 15px rgba(255,255,255,0.4)',
  },
  insightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginTop: 0,
    perspective: 1200,
  },
  insightTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(13px, 1.6vw, 16px)',
    fontWeight: 900,
    letterSpacing: '0.3em',
    marginBottom: 8,
    textShadow: '0 0 10px currentColor',
  },
  insightText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(12px, 1.3vw, 13px)',
    lineHeight: 1.7,
    color: '#ffffff',
    fontWeight: 500,
    minHeight: 40,
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },
  controlBtn: {
    background: 'rgba(204,0,1,0.22)',
    border: '2px solid rgba(204,0,1,0.5)',
    borderRadius: 6,
    padding: '12px 20px',
    color: '#ff2626',
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(10px)',
  },
  nextBtn: {
    background: 'linear-gradient(135deg, #ff1a1a 0%, #a00001 100%)',
    border: '2px solid rgba(255,38,38,0.8)',
    borderRadius: 6,
    padding: '14px 32px',
    color: '#fff',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(10px, 1.4vw, 13px)',
    fontWeight: 900,
    letterSpacing: '0.2em',
    cursor: 'pointer',
    boxShadow: '0 4px 25px rgba(204,0,1,0.5), 0 0 15px rgba(204,0,1,0.2)',
  },
};