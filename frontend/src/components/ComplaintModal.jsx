import React, { useEffect, useState } from 'react';
import { useUpdateStatus } from '../hooks/useComplaints';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';

const STATUS_STYLE = {
  'New':         { background: '#FFF3DC', color: '#7A4F00' },
  'In Progress': { background: '#E6EEFA', color: '#1A3A6B' },
  'Resolved':    { background: '#E8F3E8', color: '#2D6A2D' },
};

export default function ComplaintModal({ complaint, onClose, onUpdated }) {
  const { isAuthority }            = useAuth();
  const { updateStatus, updating } = useUpdateStatus();
  const [local, setLocal]          = useState(complaint);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleStatus = async (status) => {
    await updateStatus(local._id, status, () => {
      setLocal(prev => ({ ...prev, status }));
      onUpdated?.();
    });
  };

  const stat = STATUS_STYLE[local.status] || STATUS_STYLE['New'];
  const CAT_ICONS = { pothole: '🛣️', garbage: '🗑️', streetlight: '💡', IllegalParking: '🚗', General: '📌' };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '88vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#F7F6F2', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6960' }}>✕</button>

        {/* Image */}
        {local.imageUrl ? (
          <img src={local.imageUrl} alt="complaint" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginBottom: '1.25rem' }} />
        ) : (
          <div style={{ width: '100%', height: 140, borderRadius: 10, background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, marginBottom: '1.25rem', border: '1px solid #E2DED6' }}>
            {CAT_ICONS[local.category] || '📌'}
          </div>
        )}

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span style={{ ...stat, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{local.status}</span>
          {local.category && <span style={{ background: '#F0F0F0', color: '#444', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{CAT_ICONS[local.category]} {local.category}</span>}
          {local.priority && <span style={{ background: local.priority === 'High' ? '#FDEAEA' : '#FFF3DC', color: local.priority === 'High' ? '#8B1A1A' : '#7A4F00', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{local.priority} Priority</span>}
          {local.department && <span style={{ background: '#E6EEFA', color: '#1A3A6B', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>🏛 {local.department}</span>}
        </div>

        {/* Location heading */}
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 19, fontWeight: 600, marginBottom: '1rem' }}>
          📍 {local.address}
        </h2>

        {/* Detail rows */}
        {[
          ['City',       local.city],
          ['State',      local.state],
          ['Reported by', local.user?.email || '—'],
          ['Date',       new Date(local.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
          ['Complaint ID', `#${local._id}`],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ display: 'flex', gap: '1rem', marginBottom: '.6rem' }}>
            <span style={{ fontSize: 13, color: '#6B6960', width: 110, flexShrink: 0 }}>{lbl}</span>
            <span style={{ fontSize: 13, fontWeight: 500, wordBreak: 'break-all' }}>{val}</span>
          </div>
        ))}

        {/* Authority status update */}
        {isAuthority && (
          <>
            <div style={{ height: 1, background: '#E2DED6', margin: '1.25rem 0' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: '#6B6960', marginBottom: '.5rem' }}>Update Status</div>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {['New', 'In Progress', 'Resolved'].map(s => (
                <Button key={s} size="sm" variant={local.status === s ? 'primary' : 'outline'}
                  onClick={() => handleStatus(s)} disabled={updating || local.status === s}>
                  {s}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
