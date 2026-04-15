import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyComplaints } from '../hooks/useComplaints';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintModal from '../components/ComplaintModal';
import { SkeletonCard, EmptyState, Button } from '../components/UI';

// Status values from your backend
const TABS = [
  { value: 'all',         label: 'All' },
  { value: 'New',         label: 'New' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved',    label: 'Resolved' },
];

export default function MyReportsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('all');
  const [selected, setSelected]     = useState(null);
  const { complaints, loading, refetch } = useMyComplaints();

  const filtered = activeTab === 'all'
    ? complaints
    : complaints.filter(c => c.status === activeTab);

  const counts = complaints.reduce((acc, c) => {
    acc.all = (acc.all || 0) + 1;
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 600 }}>My Complaints</h1>
        <Button onClick={() => navigate('/report')}>+ New Complaint</Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: '#F7F6F2', borderRadius: 8, padding: 3, marginBottom: '1.5rem', width: 'fit-content' }}>
        {TABS.map(({ value, label }) => (
          <button key={value} onClick={() => setActiveTab(value)} style={{
            padding: '7px 18px', borderRadius: 6, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: activeTab === value ? '#fff' : 'transparent',
            color: activeTab === value ? '#1A1917' : '#6B6960',
            boxShadow: activeTab === value ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
            transition: 'all .15s',
          }}>
            {label}
            {counts[value] != null && (
              <span style={{ marginLeft: 6, background: activeTab === value ? '#E8F3E8' : '#E2DED6', color: activeTab === value ? '#2D6A2D' : '#6B6960', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>
                {counts[value] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
      ) : filtered.length === 0 ? (
        <EmptyState icon="📋" title="No complaints here" subtitle={activeTab === 'all' ? 'Submit your first complaint to get started' : `No ${activeTab} complaints`} />
      ) : (
        filtered.map(c => (
          <ComplaintCard key={c._id} complaint={c} onSelect={setSelected} />
        ))
      )}

      {selected && (
        <ComplaintModal complaint={selected} onClose={() => setSelected(null)} onUpdated={() => { refetch(); setSelected(null); }} />
      )}
    </div>
  );
}
