import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useComplaints';
import { MetricCard, SkeletonCard } from '../components/UI';

const DEPT_COLORS = { Sanitation: '#C87A20', Roads: '#7A5CC8', Electricity: '#A0A020', Traffic: '#C82020', General: '#888' };

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading } = useStats();

  if (loading) return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 600, marginBottom: '1.5rem' }}>Authority Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  const maxDept = Math.max(...(stats.byDepartment.map(d => d.count)), 1);

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 600 }}>Authority Dashboard</h1>
        <button onClick={() => navigate('/complaints')} style={{ padding: '9px 18px', background: 'transparent', color: '#1A1917', border: '1px solid #E2DED6', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          View All Complaints →
        </button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <MetricCard label="Total Complaints"  value={stats.total}      icon="📋" bg="#E6EEFA" />
        <MetricCard label="New"               value={stats.new}        icon="🆕" bg="#FFF3DC" />
        <MetricCard label="In Progress"       value={stats.inprogress} icon="🔧" bg="#E0F0FF" />
        <MetricCard label="Resolved"          value={stats.resolved}   icon="✅" bg="#E8F3E8" />
        <MetricCard label="High Priority"     value={stats.high}       icon="🔴" bg="#FDEAEA" />
        <MetricCard label="Departments Active" value={stats.byDepartment.length} icon="🏛" bg="#F0EAFF" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* By Department */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DED6', padding: '1.25rem' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6B6960', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '1rem' }}>By Department</div>
          {stats.byDepartment.length === 0
            ? <div style={{ fontSize: 13, color: '#A8A49E', textAlign: 'center', padding: '1rem' }}>No data yet</div>
            : stats.byDepartment.map(({ _id: dept, count }) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
                <div style={{ fontSize: 12, color: '#6B6960', width: 80, textAlign: 'right', flexShrink: 0 }}>{dept}</div>
                <div style={{ flex: 1, height: 22, background: '#F7F6F2', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(count / maxDept) * 100}%`, height: '100%', borderRadius: 4, background: DEPT_COLORS[dept] || '#888', display: 'flex', alignItems: 'center', paddingLeft: 8, fontSize: 11, fontWeight: 500, color: '#fff', transition: 'width .5s', minWidth: count > 0 ? 24 : 0 }}>
                    {count > 0 ? count : ''}
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Resolution breakdown */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DED6', padding: '1.25rem' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6B6960', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '1rem' }}>Resolution Progress</div>
          {[
            ['Resolved',    stats.resolved,   '#4A9E4A'],
            ['In Progress', stats.inprogress, '#3A6BC8'],
            ['New',         stats.new,        '#E8A020'],
          ].map(([lbl, val, color]) => {
            const pct = stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;
            return (
              <div key={lbl} style={{ marginBottom: '.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{lbl}</span>
                  <span style={{ color: '#6B6960' }}>{val} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#F7F6F2', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: color, transition: 'width .5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DED6', padding: '1.25rem' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#6B6960', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '1rem' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          {[
            ['🆕 New Complaints',     '/complaints?status=New'],
            ['🔧 In Progress',        '/complaints?status=In Progress'],
            ['🔴 High Priority',      '/complaints?priority=High'],
            ['📋 All Complaints',     '/complaints'],
          ].map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)} style={{ padding: '8px 16px', background: '#F7F6F2', border: '1px solid #E2DED6', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#1A1917', transition: 'all .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#E8F3E8'}
              onMouseLeave={e => e.currentTarget.style.background = '#F7F6F2'}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
