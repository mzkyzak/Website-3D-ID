import React from 'react';

/**
 * CinematicOverlay — CSS gradient overlays stacked above the canvas.
 * Provides vignette, color grading, and scene-specific toning.
 */
export default function CinematicOverlay({ currentScene }) {
  // Scene-specific color grade tints
  const gradients = {
    1: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,5,10,0.72) 100%)',
    2: 'radial-gradient(ellipse at center, rgba(140,0,10,0.18) 0%, rgba(6,5,10,0.88) 100%)',
    3: 'radial-gradient(ellipse at center, transparent 25%, rgba(6,5,10,0.65) 100%)',
    4: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,5,10,0.78) 100%)',
  };

  const topGrade = {
    1: 'linear-gradient(to bottom, rgba(6,5,10,0.55) 0%, transparent 35%)',
    2: 'linear-gradient(to bottom, rgba(100,0,10,0.4) 0%, transparent 40%)',
    3: 'linear-gradient(to bottom, rgba(6,5,10,0.45) 0%, transparent 30%)',
    4: 'linear-gradient(to bottom, rgba(6,5,10,0.55) 0%, transparent 35%)',
  };

  const bottomGrade = {
    1: 'linear-gradient(to top, rgba(6,5,10,0.85) 0%, transparent 55%)',
    2: 'linear-gradient(to top, rgba(6,5,10,0.92) 0%, transparent 50%)',
    3: 'linear-gradient(to top, rgba(6,5,10,0.75) 0%, transparent 50%)',
    4: 'linear-gradient(to top, rgba(6,5,10,0.88) 0%, transparent 50%)',
  };

  const base = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Vignette */}
      <div style={{
        ...base,
        zIndex: 1,
        background: gradients[currentScene] || gradients[1],
        transition: 'background 1.2s ease',
      }} />

      {/* Top gradient bar */}
      <div style={{
        ...base,
        zIndex: 2,
        background: topGrade[currentScene] || topGrade[1],
        transition: 'background 1.2s ease',
      }} />

      {/* Bottom gradient bar */}
      <div style={{
        ...base,
        zIndex: 2,
        background: bottomGrade[currentScene] || bottomGrade[1],
        transition: 'background 1.2s ease',
      }} />

      {/* Film grain texture (SVG feTurbulence) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </svg>
      <div style={{
        ...base,
        zIndex: 3,
        opacity: 0.035,
        filter: 'url(#grain)',
        background: '#888',
      }} />
    </>
  );
}
