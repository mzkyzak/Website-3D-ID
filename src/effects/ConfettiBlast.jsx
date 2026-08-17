import { useEffect, useRef } from 'react';

/**
 * ConfettiBlast
 * ─────────────
 * Pure canvas, RAF-driven, 30 FPS cap.
 * Continuous bursts of Indonesian-colored confetti + sparkle.
 * Max ~160 particles — no GC pressure, pre-allocated pool.
 */

const COLORS = [
  '#cc0001', '#ff1a1a', '#e60000',   // Merah
  '#ffffff', '#f0f0f0', '#ffe5e5',   // Putih
  '#c9a84c', '#f5c842', '#e8b800',   // Emas
  '#ff6b6b', '#ffd700', '#ff4444',   // Accent
];

const MAX_PARTICLES = 160;
const TARGET_FPS    = 30;
const INTERVAL_MS   = 1000 / TARGET_FPS;

function randBetween(a, b) { return a + Math.random() * (b - a); }
function randColor()       { return COLORS[Math.floor(Math.random() * COLORS.length)]; }

function createParticle(cw, ch) {
  // Spawn from random edge: top, left, right, or bottom-corners
  const edge = Math.random();
  let x, y, vx, vy;

  if (edge < 0.5) {
    // Top edge
    x  = randBetween(0, cw);
    y  = randBetween(-20, -5);
    vx = randBetween(-3, 3);
    vy = randBetween(2.5, 6);
  } else if (edge < 0.7) {
    // Left edge blast
    x  = randBetween(-20, 0);
    y  = randBetween(0, ch * 0.5);
    vx = randBetween(3, 7);
    vy = randBetween(-3, 4);
  } else {
    // Right edge blast
    x  = randBetween(cw, cw + 20);
    y  = randBetween(0, ch * 0.5);
    vx = randBetween(-7, -3);
    vy = randBetween(-3, 4);
  }

  const shape = Math.random() < 0.55 ? 'rect' : (Math.random() < 0.5 ? 'circle' : 'star');
  const size  = shape === 'circle' ? randBetween(3, 7)
               : shape === 'star'  ? randBetween(4, 9)
               : randBetween(5, 12);

  return {
    alive: true,
    x, y, vx, vy,
    color: randColor(),
    shape,
    w: size,
    h: shape === 'rect' ? randBetween(3, 7) : size,
    rot:   randBetween(0, Math.PI * 2),
    rotV:  randBetween(-0.18, 0.18),
    life:  1.0,
    decay: randBetween(0.007, 0.018),
    gravity: 0.12,
    drag:    0.992,
    glowColor: null,
    isGlow: Math.random() < 0.25,  // 25% are glowing
  };
}

function drawStar(ctx, x, y, r) {
  const pts = 5;
  const inner = r * 0.45;
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2;
    const dist  = i % 2 === 0 ? r : inner;
    if (i === 0) ctx.moveTo(x + dist * Math.cos(angle), y + dist * Math.sin(angle));
    else         ctx.lineTo(x + dist * Math.cos(angle), y + dist * Math.sin(angle));
  }
  ctx.closePath();
}

export default function ConfettiBlast() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool
    const pool = [];
    let rafId;
    let lastTime = 0;
    let spawnCooldown = 0;

    function spawnBurst(count = 8) {
      const cw = canvas.width;
      const ch = canvas.height;
      let spawned = 0;
      // Reuse dead slots first
      for (let i = 0; i < pool.length && spawned < count; i++) {
        if (!pool[i].alive) {
          Object.assign(pool[i], createParticle(cw, ch));
          spawned++;
        }
      }
      // Extend pool if needed
      while (spawned < count && pool.length < MAX_PARTICLES) {
        pool.push(createParticle(cw, ch));
        spawned++;
      }
    }

    function tick(timestamp) {
      rafId = requestAnimationFrame(tick);

      const elapsed = timestamp - lastTime;
      if (elapsed < INTERVAL_MS) return;
      lastTime = timestamp - (elapsed % INTERVAL_MS);

      const cw = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      // Spawn continuously
      spawnCooldown -= elapsed;
      if (spawnCooldown <= 0) {
        spawnBurst(Math.floor(randBetween(4, 10)));
        spawnCooldown = randBetween(80, 200); // every 80-200ms
      }

      // Update & draw
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.alive) continue;

        // Physics
        p.vy  += p.gravity;
        p.vx  *= p.drag;
        p.vy  *= p.drag;
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > ch + 40) {
          p.alive = false;
          continue;
        }

        const alpha = Math.min(1, p.life * 1.4);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        // Glow effect
        if (p.isGlow) {
          ctx.shadowColor  = p.color;
          ctx.shadowBlur   = 10;
        }

        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.w / 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,   // Below watermark (9999) but above everything else
      }}
    />
  );
}
