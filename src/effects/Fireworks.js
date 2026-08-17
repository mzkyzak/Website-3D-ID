import confetti from 'canvas-confetti';

/**
 * Trigger a burst of merah-putih-gold fireworks confetti.
 * Can be called imperatively at any time (on scene open, on message submit, etc.)
 */
export function fireOpening() {
  const burst = (origin) =>
    confetti({
      particleCount: 80,
      angle: origin.angle,
      spread: 65,
      startVelocity: 50,
      decay: 0.93,
      gravity: 0.9,
      origin: { x: origin.x, y: 0.75 },
      colors: ['#cc0001', '#ffffff', '#c9a84c', '#f5d78e', '#e8001a'],
      scalar: 1.1,
      zIndex: 1000,
    });

  // Left cannon
  burst({ x: 0.1, angle: 60 });
  setTimeout(() => burst({ x: 0.9, angle: 120 }), 200);
  setTimeout(() => burst({ x: 0.5, angle: 90 }), 400);
}

export function fireCelebration() {
  const end = Date.now() + 2200;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#cc0001', '#ffffff', '#c9a84c'],
      zIndex: 1000,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#cc0001', '#ffffff', '#c9a84c'],
      zIndex: 1000,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

export function fireMessageSent() {
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { x: 0.5, y: 0.55 },
    colors: ['#cc0001', '#ffffff', '#c9a84c', '#f5d78e'],
    scalar: 1.0,
    zIndex: 1000,
  });
}
