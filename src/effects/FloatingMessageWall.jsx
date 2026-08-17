import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A single floating 3D message bubble card.
 * Uses drei's <Html> to render React DOM inside 3D space.
 */
function FloatingBubble({ msg, position, delay, index }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Each bubble has a unique floating motion pattern
  const seed = useMemo(() => ({
    floatSpeed: 0.15 + Math.random() * 0.2,
    floatAmplitude: 0.15 + Math.random() * 0.12,
    swaySpeed: 0.1 + Math.random() * 0.15,
    swayAmplitude: 0.08 + Math.random() * 0.06,
    rotSpeed: 0.03 + Math.random() * 0.04,
    phase: Math.random() * Math.PI * 2,
  }), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + seed.phase;

    // Gentle floating Y oscillation
    groupRef.current.position.y = position[1] + Math.sin(t * seed.floatSpeed) * seed.floatAmplitude;
    // Gentle X sway
    groupRef.current.position.x = position[0] + Math.sin(t * seed.swaySpeed + 1.5) * seed.swayAmplitude;
    // Very subtle Z drift
    groupRef.current.position.z = position[2] + Math.sin(t * 0.08) * 0.04;

    // Subtle rotation tilt
    groupRef.current.rotation.y = Math.sin(t * seed.rotSpeed) * 0.04;
    groupRef.current.rotation.x = Math.cos(t * seed.rotSpeed * 0.7) * 0.02;

    // Scale on hover
    const targetScale = hovered ? 1.08 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
  });

  // Color assignments based on index
  const colors = ['#cc0001', '#c9a84c', '#059669', '#0284c7', '#7c3aed', '#db2777'];
  const accentColor = msg.color || colors[index % colors.length];

  // Format date
  const formattedDate = msg.createdAt?.seconds
    ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : 'Baru saja';

  return (
    <group ref={groupRef} position={position}>
      <Html
        transform
        distanceFactor={5}
        style={{ pointerEvents: 'auto' }}
        center
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: 260,
            padding: '14px 16px',
            background: 'rgba(6,5,10,0.88)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${hovered ? accentColor : 'rgba(255,255,255,0.1)'}`,
            borderLeft: `3px solid ${accentColor}`,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            cursor: 'default',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: hovered
              ? `0 8px 32px ${accentColor}40, 0 0 60px ${accentColor}15`
              : '0 4px 24px rgba(0,0,0,0.5)',
            userSelect: 'none',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
              {msg.photoURL ? (
                <img
                  src={msg.photoURL}
                  alt={msg.name}
                  referrerPolicy="no-referrer"
                  style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${accentColor}50`, flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', background: accentColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {(msg.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: '#fff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {msg.name}
                  {msg.email && (
                    <span style={{
                      background: 'rgba(52,168,83,0.2)', border: '1px solid rgba(52,168,83,0.4)',
                      color: '#4ade80', fontSize: 8, fontWeight: 700, padding: '0px 5px',
                      borderRadius: 99, marginLeft: 4, verticalAlign: 'middle',
                    }}>✓</span>
                  )}
                </span>
                {msg.email && (
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{msg.email}</span>
                )}
              </div>
            </div>
            <div style={{
              display: 'flex', gap: 4, flexDirection: 'column', alignItems: 'flex-end',
            }}>
              <span style={{
                fontSize: 9, color: accentColor, fontWeight: 600,
                background: `${accentColor}15`, padding: '1px 6px', borderRadius: 3,
              }}>
                {msg.education || 'Umum'}
              </span>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{msg.status || ''}</span>
            </div>
          </div>

          {/* Region + Date */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6,
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>📍 {msg.region}</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{formattedDate}</span>
          </div>

          {/* Kesan */}
          {msg.impression && (
            <div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>KESAN:</span>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, margin: '2px 0 0' }}>
                {msg.impression}
              </p>
            </div>
          )}

          {/* Pesan */}
          {msg.message && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: 4,
              borderLeft: `2px solid ${accentColor}80`,
            }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>PESAN:</span>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, margin: '2px 0 0', fontStyle: 'italic' }}>
                {msg.message}
              </p>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/**
 * Camera auto-orbit around the message cloud
 */
function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.05;
    const radius = 6;
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = 1.5 + Math.sin(t * 0.3) * 0.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Generate non-overlapping positions for message bubbles
 * arranged in a 3D spiral/sphere distribution.
 */
function generatePositions(count) {
  const positions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2; // -1 to 1
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    
    const spread = 3.2;
    const x = Math.cos(theta) * radius * spread;
    const z = Math.sin(theta) * radius * spread;
    
    positions.push([x, y * 2.0, z]);
  }
  return positions;
}

/**
 * FloatingMessageWall — React Three Fiber canvas showing
 * all messages as floating glassmorphic cards in 3D space.
 */
export default function FloatingMessageWall({ messages }) {
  const positions = useMemo(() => generatePositions(messages.length), [messages.length]);
  
  // Only show the first 30 messages in 3D to keep performance
  const visibleMessages = messages.slice(0, 30);

  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 50 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      frameloop="always"
    >
      {/* Ambient + soft directional light */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#f5d78e" />
      <pointLight position={[-3, 2, -2]} intensity={0.15} color="#cc0001" />

      <CameraRig />

      {visibleMessages.map((msg, i) => (
        <FloatingBubble
          key={msg.id || i}
          msg={msg}
          position={positions[i] || [0, 0, 0]}
          delay={i * 0.12}
          index={i}
        />
      ))}
    </Canvas>
  );
}
