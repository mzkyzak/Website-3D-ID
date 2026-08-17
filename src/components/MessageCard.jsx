import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MessageCard({ msg, isNew }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isNew && ref.current) {
      gsap.fromTo(ref.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.3)' }
      );
    }
  }, [isNew]);

  // Determine a color based on the message ID if color is not provided
  const generateColor = (id) => {
    const colors = ['#cc0001', '#c9a84c', '#059669', '#0284c7', '#7c3aed', '#db2777'];
    if (!id) return colors[0];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const cardColor = msg.color || generateColor(msg.id);

  // Format the date if it exists
  const formattedDate = msg.createdAt?.seconds
    ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Baru saja';

  return (
    <div ref={ref} style={{ ...styles.card, borderLeftColor: cardColor, opacity: isNew ? 0 : 1 }}>
      {/* Card Header with Avatar and User Info */}
      <div style={styles.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {msg.photoURL ? (
            <img
              src={msg.photoURL}
              alt={msg.name}
              referrerPolicy="no-referrer"
              style={styles.avatarImg}
            />
          ) : (
            <div style={{ ...styles.avatarFallback, background: cardColor }}>
              {(msg.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={styles.cardName}>{msg.name}</span>
              {msg.email && (
                <span style={styles.verifiedBadge} title={`Akun Google Terverifikasi: ${msg.email}`}>
                  ✓ Google
                </span>
              )}
            </div>
            {msg.email && (
              <span style={styles.cardEmail} title={msg.email}>
                ✉ {msg.email}
              </span>
            )}
          </div>
        </div>

        {/* Education & Status Tags */}
        <div style={styles.cardMetaGroup}>
          <span style={styles.cardMeta}>{msg.education || 'Umum'}</span>
          <span style={styles.cardMetaSep}>•</span>
          <span style={styles.cardMeta}>{msg.status || 'Warga'}</span>
        </div>
      </div>
      
      {/* Region and Date */}
      <div style={styles.cardSubHeader}>
        <span style={styles.cardRegion}>📍 {msg.region}</span>
        <span style={styles.cardDate}>{formattedDate}</span>
      </div>

      {/* Content: Impression & Message */}
      <div style={styles.contentGroup}>
        {msg.impression && (
          <div style={styles.impressionBox}>
            <span style={styles.contentLabel}>KESAN:</span>
            <p style={styles.cardText}>{msg.impression}</p>
          </div>
        )}
        {msg.message && (
          <div style={styles.messageBox}>
            <span style={styles.contentLabel}>PESAN:</span>
            <p style={styles.cardTextHighlight}>{msg.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(6,5,10,0.72)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderLeft: '3px solid',
    borderRadius: 6,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 8,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },
  cardName: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  verifiedBadge: {
    background: 'rgba(52,168,83,0.18)',
    border: '1px solid rgba(52,168,83,0.5)',
    color: '#4ade80',
    fontSize: 9,
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: 99,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.04em',
  },
  cardEmail: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.02em',
  },
  cardMetaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 8px',
    borderRadius: 4,
  },
  cardMeta: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(201,168,76,0.9)',
    textTransform: 'uppercase',
  },
  cardMetaSep: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
  },
  cardSubHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: 8,
  },
  cardRegion: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  cardDate: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  contentGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 2,
  },
  impressionBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  messageBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    background: 'rgba(255,255,255,0.02)',
    padding: '8px',
    borderRadius: 4,
    borderLeft: '2px solid rgba(204,0,1,0.5)',
  },
  contentLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 9,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.1em',
  },
  cardText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.5,
    margin: 0,
  },
  cardTextHighlight: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
};
