import React, { useState, useCallback, useRef } from 'react';
import FramePlayer from './background/FramePlayer';
import CinematicOverlay from './background/CinematicOverlay';
import ParticleEngine from './effects/ParticleEngine';
import ConfettiBlast from './effects/ConfettiBlast';
import Scene1Intro from './scenes/Scene1Intro';
import Scene2Portal from './scenes/Scene2Portal';
import Scene3Flag from './scenes/Scene3Flag';
import Scene4Messages from './scenes/Scene4Messages';
import gsap from 'gsap';

/**
 * App — 5-Layer Cinematic Engine
 *
 * Layer 1: CSS Gradient Overlay (CinematicOverlay)
 * Layer 2: HTML Canvas 205-frame player (FramePlayer)
 * Layer 3: Three.js particles (ParticleEngine)
 * Layer 4: GSAP transitions (managed in each scene)
 * Layer 5: React scene UI (Scene1–4)
 */
export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const sceneRef = useRef(null);

  // Fade out old scene → change scene state → new scene fades in (handled in each scene's mount)
  const goToScene = useCallback((nextScene) => {
    if (sceneRef.current) {
      gsap.to(sceneRef.current, {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentScene(nextScene);
          gsap.to(sceneRef.current, {
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
          });
        },
      });
    } else {
      setCurrentScene(nextScene);
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'clip',
      background: '#06050a',
    }}>
      {/* ── Layer 2: 308-frame cinematic canvas ── */}
      <FramePlayer currentScene={currentScene} />

      {/* ── Layer 1: Cinematic color grade & vignette ── */}
      <CinematicOverlay currentScene={currentScene} />

      {/* ── Layer 3: Three.js merah-putih particles ── */}
      <ParticleEngine active={true} />

      {/* ── Layer 6: Continuous Confetti Blast ── */}
      <ConfettiBlast />

      {/* ── Layers 4+5: GSAP + React scene UI ── */}
      <div
        ref={sceneRef}
        style={{ position: 'absolute', inset: 0, zIndex: 10 }}
      >
        {currentScene === 1 && (
          <Scene1Intro onNext={() => goToScene(2)} />
        )}

        {currentScene === 2 && (
          <Scene2Portal onComplete={() => goToScene(3)} />
        )}

        {currentScene === 3 && (
          <Scene3Flag onNext={() => goToScene(4)} />
        )}

        {currentScene === 4 && (
          <Scene4Messages onRestart={() => goToScene(1)} />
        )}
      </div>

      {/* Scene indicator dots (bottom center) */}
      <SceneDots current={currentScene} onGo={goToScene} />

      {/* Permanent Watermark (bottom right) */}
      <Watermark />
    </div>
  );
}

function Watermark() {
  return (
    <>
      <div className="watermark-box">
        <div style={{
          fontSize: 7.5,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase',
          marginBottom: 2,
          fontWeight: 600,
        }}>
          CREATED AND DESIGNED BY
        </div>
        <div style={{
          fontFamily: "'Cinzel', 'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: '0.22em',
          background: 'linear-gradient(90deg, #ff1a1a 0%, #c9a84c 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 12px rgba(204,0,1,0.3)',
        }}>
          MZKYZAK
        </div>
        <div style={{
          fontSize: 7.5,
          letterSpacing: '0.2em',
          color: 'rgba(201,168,76,0.7)',
          marginTop: 1,
          fontWeight: 600,
        }}>
          RI81MZKYZAK • 2026
        </div>
      </div>

      <style>{`
        .watermark-box {
          position: fixed;
          bottom: 16px;
          right: 20px;
          z-index: 9999;
          pointer-events: none;
          text-align: right;
          font-family: 'Inter', sans-serif;
          opacity: 0.45;
          backdrop-filter: blur(10px);
          background: rgba(6,5,10,0.55);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 6px 12px;
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .watermark-box {
            right: auto;
            left: 14px;
            bottom: 14px;
            text-align: left;
            opacity: 0.55;
            padding: 5px 10px;
          }
        }
      `}</style>
    </>
  );
}

function SceneDots({ current, onGo }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 22,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 10,
      zIndex: 50,
    }}>
      {[1, 2, 3, 4].map((s) => (
        <button
          key={s}
          onClick={() => onGo(s)}
          title={`Scene ${s}`}
          style={{
            width: current === s ? 24 : 8,
            height: 8,
            borderRadius: 99,
            background: current === s ? '#cc0001' : 'rgba(255,255,255,0.3)',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
      ))}
    </div>
  );
}