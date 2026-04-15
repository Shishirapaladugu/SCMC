import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useComplaints } from '../hooks/useComplaints';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintModal from '../components/ComplaintModal';
import { SkeletonCard, EmptyState } from '../components/UI';

export default function ComplaintsPage() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [filters, setFilters]   = useState({
    status:   searchParams.get('status')   || 'all',
    priority: searchParams.get('priority') || 'all',
    category: 'all',
    search:   '',
  });

  const { complaints, loading, refetch } = useComplaints();

  // Client-side filtering (backend /all returns everything)
  const displayed = complaints.filter(c => {
    if (filters.status   !== 'all' && c.status   !== filters.status)   return false;
    if (filters.priority !== 'all' && c.priority !== filters.priority)  return false;
    if (filters.category !== 'all' && c.category !== filters.category)  return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.address?.toLowerCase().includes(q) &&
          !c.city?.toLowerCase().includes(q)    &&
          !c.state?.toLowerCase().includes(q))   return false;
    }
    return true;
  });

  const set = (k) => (e) => setFilters(prev => ({ ...prev, [k]: e.target.value }));

  const selStyle = { padding: '7px 10px', fontSize: 13, border: '1px solid #E2DED6', borderRadius: 8, fontFamily: 'inherit', background: '#fff', color: '#1A1917', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 600 }}>All Complaints</h1>
        <span style={{ fontSize: 13, color: '#6B6960' }}>{displayed.length} of {complaints.length} shown</span>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid #E2DED6', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', gap: '.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: 13, color: '#6B6960', fontWeight: 500 }}>Filter:</span>

        <input type="text" placeholder="Search city, address…" value={filters.search} onChange={set('search')}
          style={{ ...selStyle, width: 200 }} />

        <select style={selStyle} value={filters.status} onChange={set('status')}>
          <option value="all">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select style={selStyle} value={filters.priority} onChange={set('priority')}>
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>

        <select style={selStyle} value={filters.category} onChange={set('category')}>
          <option value="all">All Categories</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Streetlight</option>
          <option value="IllegalParking">Illegal Parking</option>
          <option value="General">General</option>
        </select>

        <button onClick={() => setFilters({ status: 'all', priority: 'all', category: 'all', search: '' })}
          style={{ marginLeft: 'auto', padding: '6px 12px', background: 'transparent', border: '1px solid #E2DED6', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#6B6960' }}>
          Clear
        </button>
      </div>

      {/* List */}
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : displayed.length === 0 ? (
        <EmptyState icon="🔍" title="No complaints match your filters" subtitle="Try adjusting the filters above" />
      ) : (
        displayed.map(c => (
          <ComplaintCard key={c._id} complaint={c} isAuthority onSelect={setSelected} onStatusUpdated={refetch} />
        ))
      )}

      {selected && (
        <ComplaintModal complaint={selected} onClose={() => setSelected(null)} onUpdated={() => { refetch(); setSelected(null); }} />
      )}
    </div>
  );
}
