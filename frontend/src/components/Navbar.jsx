import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navStyle = {
  background: '#fff',
  borderBottom: '1px solid #E2DED6',
  padding: '0 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 60,
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

export default function Navbar() {
  const { user, logout, isAuthority } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    color: isActive ? '#4A9E4A' : '#6B6960',
    background: isActive ? '#F0EEE8' : 'transparent',
    transition: 'all .15s',
  });

  return (
    <nav style={navStyle}>
      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 20, cursor: 'pointer' }}
           onClick={() => navigate('/')}>
        Civic<span style={{ color: '#4A9E4A' }}>Pulse</span>
      </div>

      {user && (
        <div style={{ display: 'flex', gap: 4 }}>
          <NavLink to="/" end style={linkStyle}>Home</NavLink>
          {!isAuthority && <NavLink to="/report" style={linkStyle}>Report Issue</NavLink>}
          {!isAuthority && <NavLink to="/my-reports" style={linkStyle}>My Reports</NavLink>}
          {isAuthority && <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>}
          {isAuthority && <NavLink to="/complaints" style={linkStyle}>All Complaints</NavLink>}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <span style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 500,
              background: isAuthority ? '#E8F3E8' : '#E6EEFA',
              color: isAuthority ? '#2D6A2D' : '#1A3A6B',
            }}>
              {isAuthority ? '🏛 Authority' : '👤 Citizen'} · {user.name}
            </span>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid #E2DED6',
              borderRadius: 8, padding: '5px 12px', fontSize: 13,
              cursor: 'pointer', color: '#6B6960', fontFamily: 'inherit',
            }}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
        )}
      </div>
    </nav>
  );
}
