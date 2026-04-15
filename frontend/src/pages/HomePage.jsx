import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../hooks/useComplaints';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintModal from '../components/ComplaintModal';
import { SkeletonCard, EmptyState } from '../components/UI';

const primaryBtn = { padding: '10px 20px', background: '#4A9E4A', color: '#fff', border: '1px solid #4A9E4A', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' };
const outlineBtn = { padding: '9px 18px', background: 'transparent', color: '#1A1917', border: '1px solid #E2DED6', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' };

export default function HomePage() {
  const { user, isAuthority } = useAuth();
  const navigate = useNavigate();
  const { complaints, loading, refetch } = useComplaints();
  const [selected, setSelected] = useState(null);

  const recent = complaints.slice(0, 5);
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const rate = complaints.length > 0 ? Math.round((resolved / complaints.length) * 100) : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2DED6', padding: '2.5rem 3rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 32, lineHeight: 1.2, marginBottom: '.5rem' }}>
            Report civic issues,<br /><span style={{ color: '#4A9E4A' }}>drive real change</span>
          </h1>
          <p style={{ fontSize: 15, color: '#6B6960', maxWidth: 420, lineHeight: 1.6 }}>
            Upload a photo of the issue — our ML model automatically classifies it as a pothole, garbage, streetlight fault, or illegal parking and routes it to the right department.
          </p>
          <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {!user ? (
              <button onClick={() => navigate('/login')} style={primaryBtn}>Get Started →</button>
            ) : isAuthority ? (
              <button onClick={() => navigate('/dashboard')} style={primaryBtn}>View Dashboard →</button>
            ) : (
              <>
                <button onClick={() => navigate('/report')} style={primaryBtn}>+ Report an Issue</button>
                <button onClick={() => navigate('/my-reports')} style={outlineBtn}>My Complaints</button>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexShrink: 0 }}>
          {[
            [complaints.length, 'Total Reports'],
            [resolved, 'Resolved'],
            [`${rate}%`, 'Resolution Rate'],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 26, fontWeight: 600, color: '#4A9E4A' }}>{num}</div>
              <div style={{ fontSize: 12, color: '#6B6960', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          ['🛣️', 'Pothole',          '#F0EAFF', '#5A3A9A'],
          ['🗑️', 'Garbage',          '#FFF0E0', '#8A4A00'],
          ['💡', 'Streetlight',      '#FFFFF0', '#6A6A00'],
          ['🚗', 'Illegal Parking',  '#FFE8E8', '#8A0000'],
        ].map(([icon, label, bg, color]) => (
          <div key={label} onClick={() => navigate(user ? '/report' : '/login')}
            style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DED6', padding: '1rem', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C5C0B5'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2DED6'}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
            <div style={{ fontSize: 12, color, marginTop: 2 }}>Report →</div>
          </div>
        ))}
      </div>

      {/* ML info */}
      <div style={{ background: 'linear-gradient(135deg,#E8F3E8,#E6EEFA)', borderRadius: 12, border: '1px solid #C5D8C5', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <span style={{ fontSize: 24 }}>✦</span>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>ML-Powered Auto-Classification</div>
          <div style={{ fontSize: 13, color: '#6B6960', lineHeight: 1.6 }}>
            Your photo is analysed by an <strong>SVM classification model</strong> that detects potholes, garbage, streetlight faults, and illegal parking — then automatically assigns priority and routes it to the right department (Roads, Sanitation, Electricity, Traffic).
          </div>
        </div>
      </div>

      {/* Recent */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20, fontWeight: 600 }}>Recent Complaints</h2>
        {user && <button onClick={() => navigate(isAuthority ? '/complaints' : '/my-reports')} style={outlineBtn}>View all</button>}
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
      ) : recent.length === 0 ? (
        <EmptyState icon="📭" title="No complaints yet" subtitle="Be the first to report a civic issue" />
      ) : (
        recent.map(c => <ComplaintCard key={c._id} complaint={c} onSelect={setSelected} />)
      )}

      {selected && (
        <ComplaintModal complaint={selected} onClose={() => setSelected(null)} onUpdated={() => { refetch(); setSelected(null); }} />
      )}
    </div>
  );
}
