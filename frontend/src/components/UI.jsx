import React from 'react';

// ── Severity Badge ────────────────────────────────────────────────────────────
const SEV_STYLES = {
  high:   { background: '#FDEAEA', color: '#8B1A1A' },
  medium: { background: '#FFF3DC', color: '#7A4F00' },
  low:    { background: '#E8F3E8', color: '#2D6A2D' },
};
export function SeverityBadge({ severity }) {
  const s = SEV_STYLES[severity] || SEV_STYLES.low;
  return (
    <span style={{ ...s, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, display: 'inline-block' }}>
      {severity?.charAt(0).toUpperCase() + severity?.slice(1)}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending:    { background: '#FFF3DC', color: '#7A4F00' },
  inprogress: { background: '#E6EEFA', color: '#1A3A6B' },
  completed:  { background: '#E8F3E8', color: '#2D6A2D' },
};
const STATUS_LABELS = { pending: 'Pending', inprogress: 'In Progress', completed: 'Completed' };
export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span style={{ ...s, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, display: 'inline-block' }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ── Category Badge ────────────────────────────────────────────────────────────
const CAT_STYLES = {
  Roads:       { background: '#F0EAFF', color: '#5A3A9A' },
  Garbage:     { background: '#FFF0E0', color: '#8A4A00' },
  Water:       { background: '#E0F0FF', color: '#1A4A8A' },
  Streetlights:{ background: '#FFFFF0', color: '#6A6A00' },
};
const CAT_ICONS = { Roads: '🛣️', Garbage: '🗑️', Water: '💧', Streetlights: '💡' };
export function CategoryBadge({ category }) {
  const s = CAT_STYLES[category] || { background: '#F0F0F0', color: '#444' };
  return (
    <span style={{ ...s, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {CAT_ICONS[category]} {category}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E2DED6',
        padding: '1.25rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color .15s, box-shadow .15s',
        ...style,
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = '#C5C0B5')}
      onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = '#E2DED6')}
    >
      {children}
    </div>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────
export function MetricCard({ label, value, icon, bg }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: '#6B6960', marginBottom: 4 }}>{label}</div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, fontWeight: 600, lineHeight: 1 }}>{value ?? '—'}</div>
        </div>
        <div style={{ background: bg || '#F0EEE8', borderRadius: 8, padding: 8, fontSize: 20 }}>{icon}</div>
      </div>
    </Card>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    borderRadius: 8, fontFamily: 'inherit', fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent', transition: 'all .15s',
    opacity: disabled ? 0.6 : 1,
    fontSize: size === 'sm' ? 13 : 14,
    padding: size === 'sm' ? '6px 14px' : '10px 20px',
  };
  const variants = {
    primary: { background: '#4A9E4A', color: '#fff', borderColor: '#4A9E4A' },
    outline: { background: 'transparent', color: '#1A1917', borderColor: '#E2DED6' },
    danger:  { background: '#FDEAEA', color: '#8B1A1A', borderColor: '#D94040' },
    ghost:   { background: 'transparent', color: '#6B6960', borderColor: 'transparent' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────
export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, #F0EEE8 25%, #E2DED6 50%, #F0EEE8 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style,
    }} />
  );
}

export function SkeletonCard() {
  return (
    <Card>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Skeleton width={64} height={64} borderRadius={8} />
        <div style={{ flex: 1 }}>
          <Skeleton height={14} style={{ marginBottom: 8 }} />
          <Skeleton height={12} width="80%" style={{ marginBottom: 8 }} />
          <Skeleton height={12} width="60%" />
        </div>
      </div>
    </Card>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title = 'Nothing here yet', subtitle = '' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#6B6960' }}>
      <div style={{ fontSize: 40, marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14, color: '#A8A49E' }}>{subtitle}</div>}
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
export function Timeline({ updates = [] }) {
  return (
    <div>
      {updates.map((u, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 12, paddingBottom: 16, position: 'relative' }}>
          {idx < updates.length - 1 && (
            <div style={{ position: 'absolute', left: 11, top: 24, width: 1, height: 'calc(100% - 12px)', background: '#E2DED6' }} />
          )}
          <div style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            background: u.done ? '#E8F3E8' : '#FFF3DC',
            border: `2px solid ${u.done ? '#4A9E4A' : '#E8A020'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, zIndex: 1,
          }}>
            {u.done ? '✓' : '·'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{u.text || u.message}</div>
            <div style={{ fontSize: 12, color: '#A8A49E', marginTop: 2 }}>
              {u.date || new Date(u.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Inject shimmer keyframes once ─────────────────────────────────────────────
if (!document.getElementById('cp-shimmer')) {
  const style = document.createElement('style');
  style.id = 'cp-shimmer';
  style.textContent = `@keyframes shimmer { to { background-position: -200% 0; } }`;
  document.head.appendChild(style);
}
