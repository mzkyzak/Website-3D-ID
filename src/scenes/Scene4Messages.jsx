import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { animateSceneIn } from '../utils/gsapAnimations';
import { fireMessageSent } from '../effects/Fireworks';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../firebase/authService';
import { checkUserHasPosted } from '../firebase/messagesService';

const EDUCATIONS = [
  'Belum Sekolah', 'SD', 'SMP', 'SMA', 'SMK', 'MA', 'Kuliah', 'Lainnya'
];

const STATUSES = [
  'Pelajar', 'Mahasiswa', 'Bekerja', 'Wiraswasta', 'Guru', 'Dosen', 'PNS', 'Tidak Bekerja', 'Lainnya'
];

/* ── 3D Card ── */
function Card3D({ children, style, delay = 0, rotX = 5, rotY = -5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 18, rotateY: -12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotateX: rotX, rotateY: rotY, scale: 1 }}
      whileHover={{ rotateX: 0, rotateY: 0, scale: 1.02, y: -3, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 65, damping: 18, delay }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1200,
        boxShadow: '-4px 6px 0px rgba(204,0,1,0.15), -8px 12px 0px rgba(204,0,1,0.06)',
        background: 'linear-gradient(145deg, rgba(6,5,10,0.88), rgba(10,5,15,0.95))',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid rgba(204,0,1,0.4)',
        borderRight: '2px solid rgba(204,0,1,0.25)',
        borderRadius: 12,
        padding: 'clamp(14px, 2vw, 20px)',
        ...style,
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Message Bubble 3D ── */
function MessageBubble3D({ msg, index }) {
  const rotX = (index % 3 - 1) * 4;
  const rotY = (index % 2 === 0 ? 1 : -1) * 5;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 15, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotateX: rotX, rotateY: rotY, scale: 1 }}
      whileHover={{ rotateX: 0, rotateY: 0, scale: 1.03, y: -2, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: index * 0.05 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 800,
        background: 'linear-gradient(145deg, rgba(15,12,25,0.9), rgba(8,5,15,0.95))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '3px solid rgba(204,0,1,0.4)',
        borderRadius: 8,
        padding: '12px 14px',
        boxShadow: `-3px 4px 0px rgba(204,0,1,${0.08 + (index % 3) * 0.04})`,
      }}
    >
      <div style={{ transform: 'translateZ(10px)' }}>
        {/* User header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          {msg.photoURL ? (
            <img src={msg.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(204,0,1,0.3)' }} />
          ) : (
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#cc0001', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>
              {(msg.name || 'A').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {msg.name || msg.googleName}
              {msg.email && <span style={{ color: '#4ade80', fontSize: 7, marginLeft: 4 }}>✓</span>}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>
              {msg.region}{msg.education ? ` · ${msg.education}` : ''}{msg.status ? ` · ${msg.status}` : ''}
            </div>
          </div>
        </div>
        {/* Kesan */}
        {msg.impression && (
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(255,38,38,0.8)', fontStyle: 'italic', marginBottom: 4, lineHeight: 1.4 }}>
            "{msg.impression}"
          </div>
        )}
        {/* Pesan */}
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
          {msg.message}
        </div>
      </div>
    </motion.div>
  );
}

export default function Scene4Messages({ onRestart }) {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const { messages, loading, addMessage } = useMessages();
  const { user, loadingAuth } = useAuth();

  const [hasPosted, setHasPosted] = useState(false);
  const [checkingPost, setCheckingPost] = useState(true);
  const [authError, setAuthError] = useState('');

  // Mouse & Touch 3D Tilt
  const [tilt, setTilt] = useState({ rotX: 3, rotY: -4 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -10;
      const ry = (e.clientX / window.innerWidth - 0.5) * 12;
      setTilt({ rotX: rx, rotY: ry });
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        const rx = (t.clientY / window.innerHeight - 0.5) * -12;
        const ry = (t.clientX / window.innerWidth - 0.5) * 14;
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

  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [education, setEducation] = useState('');
  const [status, setStatus] = useState('');
  const [impression, setImpression] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GSAP + Confetti
  useEffect(() => {
    animateSceneIn(containerRef.current);

    const interval = setInterval(() => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.85 }, colors: ['#cc0001', '#ffffff', '#ff2626'], zIndex: 5, disableForReducedMotion: true });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.85 }, colors: ['#cc0001', '#ffffff', '#ff2626'], zIndex: 5, disableForReducedMotion: true });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Check post status
  useEffect(() => {
    const check = async () => {
      if (user) {
        setCheckingPost(true);
        setAuthError('');
        const posted = await checkUserHasPosted(user.uid);
        setHasPosted(posted);
        if (!posted) setName(user.displayName || '');
        setCheckingPost(false);
      } else {
        setCheckingPost(false);
      }
    };
    check();
  }, [user]);

  const handleLogin = async () => {
    setAuthError('');
    try { await signInWithGoogle(); }
    catch (error) { setAuthError(error.message || "Gagal login."); }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setHasPosted(false); setAuthError('');
      setName(''); setRegion(''); setEducation('');
      setStatus(''); setImpression(''); setMessage('');
    } catch (e) { alert("Gagal logout."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !region.trim() || !user) return;
    setIsSubmitting(true);
    try {
      await addMessage({
        uid: user.uid,
        name: name.trim(),
        googleName: user.displayName || name.trim(),
        email: user.email || '',
        photoURL: user.photoURL || '',
        region: region.trim(),
        education: education || 'Lainnya',
        status: status || 'Lainnya',
        impression: impression.trim(),
        message: message.trim(),
      });
      setHasPosted(true);
      fireMessageSent();
      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      alert("Gagal mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0, zIndex: 10,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '3vh 16px 12vh',
      }}
    >
      {/* Meteor Shower */}
      <div className="meteor-shower">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="meteor" style={{
            left: `${Math.random() * 120}%`,
            top: `${Math.random() * -50}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      {/* ── Hero 3D Tilt ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: tilt.rotX * 0.5, rotateY: tilt.rotY * 0.5 }}
        transition={{ duration: 1, delay: 0.2, type: 'spring', stiffness: 70, damping: 20 }}
        style={{ textAlign: 'center', marginBottom: 20, perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        <div style={{ ...st.badge, transform: 'translateZ(15px)' }}>SCENE 4 — RUANG ASPIRASI</div>
        <h2 style={{ ...st.heroTitle, transform: 'translateZ(30px)' }}>PESAN UNTUK INDONESIA</h2>
        <p style={{ ...st.heroSub, transform: 'translateZ(20px)' }}>
          Tuliskan harapan dan ucapanmu di hari kemerdekaan ke-81 🇮🇩
          <br />
          <span style={{ color: 'rgba(255,38,38,0.8)' }}>{messages.length} suara telah tercatat</span>
        </p>
      </motion.div>

      {/* ── Main Layout ── */}
      <div style={st.layout}>
        {/* LEFT: Form Card 3D */}
        <div style={st.formCol}>
          {loadingAuth || (user && checkingPost) ? (
            <Card3D delay={0.3} rotX={4} rotY={6}>
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 28 }}>⏳</div>
                <div style={st.authTitle}>Memeriksa Akun Google Bro...</div>
              </div>
            </Card3D>
          ) : !user ? (
            <Card3D delay={0.3} rotX={4} rotY={6}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 28 }}>Indonesia Raya</div>
                <div style={st.authTitle}>Masuk dengan Akun Google dulu</div>
                <div style={st.authSub}>
                  Nama & email terverifikasi otomatis dari Google (1 akun = 1 pesan).
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>Email sudah terkait, gw tidak akan menyimpan email kamu kok :)</p>
                </div>
                {authError && <div style={st.errorAlert}>⚠️ {authError}</div>}
                <button style={st.googleBtn} onClick={handleLogin}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Masuk dengan Google
                </button>
              </div>
            </Card3D>
          ) : hasPosted ? (
            <Card3D delay={0.3} rotX={4} rotY={6}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <div style={{ fontSize: 32 }}>🎉</div>
                <div style={{ ...st.authTitle, color: '#ff2626' }}>Pesan lo Telah Tercatat!</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)' }}>
                  {user.photoURL && <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 22, height: 22, borderRadius: '50%' }} />}
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: '#fff' }}>{user.displayName}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
                  </div>
                </div>
                <div style={st.authSub}>Pesan sudah tampil di Papan Suara Rakyat!</div>
                <button style={st.logoutBtn} onClick={handleLogout}>Ganti Akun</button>
              </div>
            </Card3D>
          ) : (
            <Card3D delay={0.3} rotX={3} rotY={5}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* User Banner */}
                <div style={st.userBanner}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#cc0001', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>
                        {(user.displayName || 'U').charAt(0)}
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif" }}>
                        {user.displayName} <span style={{ color: '#4ade80', fontSize: 8 }}>✓ Google</span>
                      </span>
                      <br />
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>{user.email}</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleLogout} style={st.logoutLink}>Keluar</button>
                </div>

                <div style={st.formGrid}>
                  <div style={st.field}>
                    <label style={st.label}>Nama</label>
                    <input className="holo-input" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda..." maxLength={48} required />
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Asal Daerah</label>
                    <input className="holo-input" value={region} onChange={e => setRegion(e.target.value)} placeholder="Jakarta..." maxLength={60} required />
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Pendidikan</label>
                    <select className="holo-input" value={education} onChange={e => setEducation(e.target.value)} required>
                      <option value="">Pilih...</option>
                      {EDUCATIONS.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                    </select>
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Status</label>
                    <select className="holo-input" value={status} onChange={e => setStatus(e.target.value)} required>
                      <option value="">Pilih...</option>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={st.field}>
                  <label style={st.label}>Kesan</label>
                  <textarea
                    className="holo-input"
                    style={{ minHeight: 60, resize: 'vertical' }}
                    value={impression}
                    onChange={e => setImpression(e.target.value)}
                    placeholder="Kesan tentang Indonesia... (bebas sepanjang apapun)"
                  />
                </div>

                <div style={{ ...st.field, position: 'relative' }}>
                  <label style={st.label}>Pesan untuk Indonesia</label>
                  <textarea
                    className="holo-input"
                    style={{ minHeight: 80, resize: 'vertical' }}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tulis harapanmu untuk Indonesia... (bebas sepanjang apapun 🇮🇩)"
                    required
                  />
                </div>

                <button type="submit" style={st.submitBtn} disabled={isSubmitting}
                  onMouseEnter={e => { e.currentTarget.style.background = '#a80001'; e.currentTarget.style.boxShadow = '0 0 25px rgba(204,0,1,0.8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #ff1a1a, #cc0001)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(204,0,1,0.5)'; }}
                >
                  {isSubmitting ? 'Mengirim...' : '✨ Kirimkan ke Papan 3D'}
                </button>
              </form>
            </Card3D>
          )}

          {/* Restart */}
          <button
            onClick={onRestart}
            style={st.restartBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-6px) scale(1.06)";

              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(255,255,255,.3), 0 15px 45px rgba(255,0,0,.6)";

              e.currentTarget.style.border =
                "2px solid rgba(255,255,255,.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0) scale(1)";

              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(255,0,0,.35)";

              e.currentTarget.style.border =
                "2px solid rgba(255,255,255,.25)";
            }}
          >
            🇮🇩 Ulangi Perjalanan Kemerdekaan 🇮🇩
          </button>
        </div>

        {/* RIGHT: Message Wall 3D */}
        <div style={st.listCol}>
          <div style={st.listHeader}>
            <span style={st.listTitle}>kasih sebuah pesan donk?</span>
            <span style={st.listCount}>{messages.length} pesan</span>
          </div>
          <div ref={listRef} style={st.list}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.5)' }}>Memuat pesan...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.5)' }}>Belum ada pesan. Jadilah yang pertama!</div>
            ) : (
              messages.map((msg, i) => (
                <MessageBubble3D key={msg.id || i} msg={msg} index={i} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Closing ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        style={{ textAlign: 'center', marginTop: 30, maxWidth: 600 }}
      >
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 600, color: '#fff', letterSpacing: '0.08em', marginBottom: 6 }}>
          81 Tahun Indonesia Merdeka, yeay!
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(10px, 1.2vw, 12px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          Terima kasih atas telah kunjungin website RI81MZKYZAK. Terima kasih yang telah perjuangan kemerdekaan Indonesia.<br />
          Mari terus melangkah bersama. <span style={{ color: '#fd0000ff' }}>Dirgahayu Republik Indonesia ke 81 hebat.</span>
        </div>
      </motion.div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.28); }
        select option { background: #1a1520; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(204,0,1,0.35); border-radius: 99px; }

        .holo-input {
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom: 2px solid rgba(204,0,1,0.5);
          border-radius: 6px;
          padding: 8px 10px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          outline: none;
          width: 100%;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.6);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .holo-input:focus {
          background: rgba(204,0,1,0.05);
          border-color: rgba(255,38,38,0.5);
          border-bottom: 2px solid #ff2626;
          box-shadow: 0 0 15px rgba(204,0,1,0.4), inset 0 0 10px rgba(204,0,1,0.2);
          transform: translateZ(5px);
        }

        .meteor-shower {
          position: fixed; inset: 0; overflow: hidden;
          pointer-events: none; z-index: 0;
        }
        .meteor {
          position: absolute; width: 2px; height: 60px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.7), transparent);
          border-radius: 2px; transform: rotate(30deg);
          opacity: 0; animation: meteor-fall linear infinite;
        }
        @keyframes meteor-fall {
          0%   { opacity: 1; transform: translate(0, -50px) rotate(30deg); }
          100% { opacity: 0; transform: translate(-300px, 110vh) rotate(30deg); }
        }
      `}</style>
    </div>
  );
}

const st = {
  badge: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(9px, 1.2vw, 11px)',
    letterSpacing: '0.35em',
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: 700,
  },
  heroTitle: {
    fontFamily: "'Cinzel', 'Montserrat', serif",
    fontSize: 'clamp(28px, 6vw, 48px)',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.12em',
    margin: '4px 0',
    textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 25px rgba(204,0,1,0.6)',
  },
  heroSub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(10px, 1.2vw, 12px)',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.5,
  },
  layout: {
    display: 'flex',
    gap: 16,
    width: '100%',
    maxWidth: 1020,
    flexWrap: 'wrap',
    justifyContent: 'center',
    perspective: 1500,
  },
  formCol: {
    flex: '1 1 340px',
    maxWidth: 440,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  listCol: {
    flex: '1 1 340px',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minHeight: 0,
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  listTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.06em',
  },
  listCount: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    color: 'rgba(255,38,38,0.8)',
    letterSpacing: '0.2em',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflowY: 'auto',
    maxHeight: '55vh',
    paddingRight: 4,
    perspective: 800,
  },
  authTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  authSub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
    maxWidth: 300,
  },
  errorAlert: {
    background: 'rgba(204,0,1,0.15)',
    border: '1px solid rgba(204,0,1,0.4)',
    borderRadius: 4,
    padding: '8px 10px',
    color: '#ff8a8a',
    fontSize: 10,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.4,
    textAlign: 'left',
    width: '100%',
  },
  googleBtn: {
    background: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '9px 20px',
    color: '#1f2937',
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 4,
    padding: '5px 12px',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    cursor: 'pointer',
    marginTop: 4,
  },
  userBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 5,
    padding: '6px 10px',
  },
  logoutLink: {
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
    fontSize: 9, fontFamily: "'Inter', sans-serif", cursor: 'pointer', textDecoration: 'underline',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 7,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    padding: '6px 8px',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    outline: 'none',
    width: '100%',
  },
  charCount: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    fontSize: 8,
    color: 'rgba(255,255,255,0.2)',
    fontFamily: "'Inter', sans-serif",
  },
  submitBtn: {
    background: 'linear-gradient(90deg, #ff1a1a, #cc0001)',
    border: '1px solid rgba(255,100,100,0.5)',
    borderRadius: 6,
    padding: '10px 0',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.12em',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: '0 6px 15px rgba(204,0,1,0.5)',
    marginTop: 8,
  },
  restartBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    padding: '8px 0',
    color: 'rgba(255,255,255,0.55)',
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    letterSpacing: '0.12em',
    cursor: 'pointer',
    opacity: 0.55,
    transition: 'opacity 0.25s',
    textAlign: 'center',
    width: '100%',
  },
};
