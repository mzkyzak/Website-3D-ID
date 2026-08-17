import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 311;

function padNum(n) {
  return String(n).padStart(3, '0');
}

// Scene frame ranges for main frames (Scenes 1-3)
const SCENE_RANGES = {
  1: { start: 1, end: 80 },
  2: { start: 81, end: 160 },
  3: { start: 161, end: 311 },
};

export default function FramePlayer({ currentScene }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mainImagesRef = useRef([]);      // Scenes 1-3 images (/frames/)
  const rafRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const frameIndexRef = useRef(0);       // 0-indexed within scene range
  const targetSceneRef = useRef(currentScene);
  const activeSceneRef = useRef(currentScene);

  // Parallax offsets for mouse / touch
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const [allLoaded, setAllLoaded] = useState(false);

  // ── Preload all frames ────────────────────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = TOTAL_FRAMES;

    const onDone = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad * 0.9) {
        // Hapus setAllLoaded dari sini agar animasi loading screen 4 detik bisa selesai dengan sempurna
      }
    };

    // Preload Main Frames (Scenes 1-3)
    const mainImgs = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${padNum(i)}.png`;
      img.onload = onDone;
      img.onerror = onDone;
      mainImgs.push(img);
    }
    mainImagesRef.current = mainImgs;

    // Guarantee max 4s loading screen (Sesuai durasi 4 detik yang diminta)
    const maxTimeout = setTimeout(() => {
      setAllLoaded(true);
    }, 4000);

    return () => clearTimeout(maxTimeout);
  }, []);

  // ── Update target scene ───────────────────────────────────────────────────
  useEffect(() => {
    targetSceneRef.current = currentScene;
    activeSceneRef.current = currentScene;
    if (currentScene < 4) {
      const range = SCENE_RANGES[currentScene] || SCENE_RANGES[1];
      frameIndexRef.current = range.start - 1;
    }
  }, [currentScene]);

  // ── Mouse & Touch Gesture Parallax Handlers ────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = normX * 25; // max 25px offset
      mouseRef.current.targetY = normY * 15;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const normX = (touch.clientX / window.innerWidth - 0.5) * 2;
        const normY = (touch.clientY / window.innerHeight - 0.5) * 2;
        mouseRef.current.targetX = normX * 30;
        mouseRef.current.targetY = normY * 20;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // ── Canvas resize handler ─────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ── Main render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!allLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    function drawSource(source) {
      if (!source) return;

      const isVideo = source instanceof HTMLVideoElement;
      if (isVideo) {
        if (source.readyState < 2) return;
      } else if (!source.complete || source.naturalWidth === 0) {
        return;
      }

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = isVideo ? (source.videoWidth || 1280) : (source.naturalWidth || 1280);
      const ih = isVideo ? (source.videoHeight || 720) : (source.naturalHeight || 720);

      // Smooth lerp parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const scale = Math.max(cw / iw, ch / ih) * 1.05; // slight zoom for parallax margin
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2 + mouseRef.current.x;
      const dy = (ch - dh) / 2 + mouseRef.current.y;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(source, dx, dy, dw, dh);
    }

    function tick(timestamp) {
      rafRef.current = requestAnimationFrame(tick);

      const scene = activeSceneRef.current;

      // Scene 4: draw hidden video onto the same canvas (single stable layer)
      if (scene === 4) {
        drawSource(video);
        return;
      }

      const fps = 30;
      const intervalMs = 1000 / fps;

      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < intervalMs) return;
      lastFrameTimeRef.current = timestamp - (elapsed % intervalMs);

      // Scenes 1-3 play /frames/ images
      const { start, end } = SCENE_RANGES[scene] || SCENE_RANGES[1];
      const startIdx = start - 1;
      const endIdx = end - 1;

      const img = mainImagesRef.current[frameIndexRef.current];
      drawSource(img);

      frameIndexRef.current += 1;
      if (frameIndexRef.current > endIdx) {
        frameIndexRef.current = startIdx;
      } else if (frameIndexRef.current < startIdx) {
        frameIndexRef.current = startIdx;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [allLoaded]);

  // Start/pause video based on scene
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allLoaded) return;

    if (currentScene === 4) {
      video.currentTime = 0;
      video.play().catch(() => { });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [currentScene, allLoaded]);

  return (
    <>
      {/* Hidden decode source — rendered onto canvas for scene 4 */}
      <video
        ref={videoRef}
        src="/scene4.mp4"
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />

      {/* Single canvas layer for all scenes (frames 1-3 + video 4) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 0,
        }}
      />

      {/* Loading overlay - Desain Profesional Kemerdekaan */}
      {!allLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          background: 'radial-gradient(circle at center, #2e0505 0%, #0a0202 70%, #000000 100%)', // Merah marun gelap ke hitam
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          overflow: 'hidden'
        }}>

          {/* Efek Cahaya Latar */}
          <div style={{
            position: 'absolute',
            width: '150vw',
            height: '50vh',
            background: 'linear-gradient(90deg, transparent, rgba(255,0,0,0.1), transparent)',
            animation: 'sweep 4s ease-in-out infinite',
            zIndex: 1
          }}></div>

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Angka HUT RI ke-81 Emas */}
            <div style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: 'clamp(80px, 15vw, 150px)',
              fontWeight: 900,
              lineHeight: 1,
              background: 'linear-gradient(to bottom, #FFDF00, #D4AF37, #996515)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))',
              animation: 'float 3s ease-in-out infinite',
              marginBottom: '10px'
            }}>
              🦅81
            </div>

            {/* Teks Utama */}
            <div style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: 'clamp(18px, 3vw, 28px)',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: '#ffffff',
              textAlign: 'center',
              textTransform: 'uppercase',
              textShadow: '0 0 15px rgba(255, 255, 255, 0.4)'
            }}>
              Dirgahayu Republik Indonesia
            </div>

            {/* Sub Teks */}
            <div style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'Inter', sans-serif",
              marginTop: '15px',
              textTransform: 'uppercase'
            }}>
              Memuat sabar...
            </div>
          </div>

          {/* Progress Bar 4 Detik (Merah Putih) */}
          <div style={{
            position: 'absolute',
            bottom: '15%',
            width: '250px',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
            borderRadius: '2px',
            zIndex: 2
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #CE1126 50%, #FFFFFF 50%)', // Warna Bendera Merah Putih
              transformOrigin: 'left',
              animation: 'loadProgress 4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}></div>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes sweep {
              0% { transform: translateX(-100%) skewX(-15deg); }
              100% { transform: translateX(100%) skewX(-15deg); }
            }
            @keyframes loadProgress {
              0% { transform: scaleX(0); }
              100% { transform: scaleX(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}