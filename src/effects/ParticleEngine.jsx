import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 220;

// Red-white-gold palette
const COLORS = [
  new THREE.Color('#cc0001'),
  new THREE.Color('#cc0001'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#c9a84c'),
  new THREE.Color('#f5d78e'),
];

/**
 * ParticleEngine — a standalone Three.js WebGL canvas for floating red/white/gold
 * merah-putih particles. Sits above the frame background but below the UI.
 */
export default function ParticleEngine({ active = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Minimal Three.js setup (no R3F)
    const renderer = new THREE.WebGLRenderer({
      canvas: mount,
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    // Geometry
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);
    const speeds    = new Float32Array(PARTICLE_COUNT);
    const sizes     = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.3 + Math.random() * 0.8;
      sizes[i]  = 2 + Math.random() * 4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const posArr = geo.attributes.position.array;
    let rafId;
    let t = 0;

    function animate() {
      rafId = requestAnimationFrame(animate);
      t += 0.004;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3 + 1] += speeds[i] * 0.008;  // drift up
        posArr[i * 3]     += Math.sin(t + i) * 0.003; // gentle sway
        if (posArr[i * 3 + 1] > 8) {
          posArr[i * 3 + 1] = -8;
          posArr[i * 3]     = (Math.random() - 0.5) * 22;
        }
      }
      geo.attributes.position.needsUpdate = true;

      // Gentle camera drift
      camera.position.x = Math.sin(t * 0.2) * 0.6;
      camera.position.y = Math.cos(t * 0.15) * 0.3;

      renderer.render(scene, camera);
    }

    if (active) animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [active]);

  return (
    <canvas
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  );
}
