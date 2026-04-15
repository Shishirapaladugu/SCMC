import React from 'react';
import { useUpdateStatus } from '../hooks/useComplaints';

// Status values from your backend: 'New' | 'In Progress' | 'Resolved'
const STATUS_STYLE = {
  'New':         { background: '#FFF3DC', color: '#7A4F00' },
  'In Progress': { background: '#E6EEFA', color: '#1A3A6B' },
  'Resolved':    { background: '#E8F3E8', color: '#2D6A2D' },
};

// Categories from your ML model
const CATEGORY_STYLE = {
  'pothole':        { background: '#F0EAFF', color: '#5A3A9A', icon: '🛣️' },
  'garbage':        { background: '#FFF0E0', color: '#8A4A00', icon: '🗑️' },
  'streetlight':    { background: '#FFFFF0', color: '#6A6A00', icon: '💡' },
  'IllegalParking': { background: '#FFE8E8', color: '#8A0000', icon: '🚗' },
  'General':        { background: '#F0F0F0', color: '#444',    icon: '📌' },
};

const PRIORITY_STYLE = {
  'High':   { background: '#FDEAEA', color: '#8B1A1A' },
  'Medium': { background: '#FFF3DC', color: '#7A4F00' },
};

export default function ComplaintCard({ complaint, onSelect, isAuthority, onStatusUpdated }) {
  const { updateStatus, updating } = useUpdateStatus();

  const cat  = CATEGORY_STYLE[complaint.category] || CATEGORY_STYLE['General'];
  const stat = STATUS_STYLE[complaint.status]      || STATUS_STYLE['New'];
  const pri  = PRIORITY_STYLE[complaint.priority]  || PRIORITY_STYLE['Medium'];

  const handleStatusChange = async (e) => {
    e.stopPropagation();
    await updateStatus(complaint._id, e.target.value, onStatusUpdated);
  };

  return (
    <div
      onClick={() => onSelect?.(complaint)}
      style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2DED6',
        padding: '1rem 1.25rem', display: 'flex', gap: '1rem',
        alignItems: 'flex-start', cursor: onSelect ? 'pointer' : 'default',
        transition: 'border-color .15s', marginBottom: '.75rem',
      }}
      onMouseEnter={e => onSelect && (e.currentTarget.style.borderColor = '#C5C0B5')}
      onMouseLeave={e => onSelect && (e.currentTarget.style.borderColor = '#E2DED6')}
    >
      {/* Thumbnail */}
      <div style={{
        width: 68, height: 68, borderRadius: 8, flexShrink: 0,
        background: '#F7F6F2', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 28, overflow: 'hidden',
        border: '1px solid #E2DED6',
      }}>
        {complaint.imageUrl
          ? <img src={complaint.imageUrl} alt="complaint" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : cat.icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Location */}
        <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
          📍 {complaint.address}, {complaint.city}, {complaint.state}
        </div>
        {/* Reported by */}
        {complaint.user?.email && (
          <div style={{ fontSize: 12, color: '#A8A49E', marginBottom: 6 }}>
            Reported by: {complaint.user.email}
          </div>
        )}
        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category */}
          <span style={{ ...cat, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {cat.icon} {complaint.category || 'General'}
          </span>
          {/* Department */}
          {complaint.department && (
            <span style={{ background: '#F0F0F0', color: '#444', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
              🏛 {complaint.department}
            </span>
          )}
          {/* Priority */}
          {complaint.priority && (
            <span style={{ ...pri, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
              {complaint.priority} Priority
            </span>
          )}
          {/* Status */}
          <span style={{ ...stat, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: '#A8A49E' }}>
          {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span style={{ fontSize: 11, color: '#C5C0B5' }}>#{complaint._id?.slice(-6)}</span>
        {/* Authority status dropdown */}
        {isAuthority && (
          <select
            value={complaint.status}
            onChange={handleStatusChange}
            onClick={e => e.stopPropagation()}
            disabled={updating}
            style={{
              padding: '4px 8px', fontSize: 12, borderRadius: 6,
              border: '1px solid #E2DED6', fontFamily: 'inherit',
              background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        )}
      </div>
    </div>
  );
}
