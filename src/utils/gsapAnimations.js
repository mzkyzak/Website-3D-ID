import gsap from 'gsap';

/**
 * Apple-style staggered text reveal — staggers children in from below
 */
export function animateSceneIn(containerEl, onComplete) {
  if (!containerEl) return;
  const children = containerEl.querySelectorAll('[data-anim]');
  return gsap.fromTo(
    children,
    { y: 48, opacity: 0, filter: 'blur(6px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.0,
      stagger: 0.18,
      ease: 'power3.out',
      onComplete,
    }
  );
}

/**
 * Fade out the scene container
 */
export function animateSceneOut(containerEl, onComplete) {
  if (!containerEl) return;
  return gsap.to(containerEl, {
    opacity: 0,
    y: -24,
    filter: 'blur(4px)',
    duration: 0.65,
    ease: 'power2.in',
    onComplete,
  });
}

/**
 * Animate a number counter from 0 → target
 */
export function counterUp(el, target, duration = 2.2) {
  if (!el) return;
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toString();
    },
  });
}

/**
 * Cinematic letter-by-letter reveal for hero text
 */
export function heroReveal(el, delay = 0) {
  if (!el) return;
  const text = el.textContent || '';
  el.innerHTML = '';
  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    el.appendChild(span);
    return span;
  });
  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.06,
    stagger: 0.04,
    ease: 'none',
    delay,
  });
}

/**
 * Pulsing glow ring animation (portal effect)
 */
export function pulseRing(el) {
  if (!el) return;
  return gsap.to(el, {
    scale: 1.08,
    opacity: 0.7,
    duration: 1.2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
}
