import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';
import toast from 'react-hot-toast';

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#6B6960', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid #E2DED6',
  borderRadius: 8, fontFamily: 'inherit', fontSize: 14, color: '#1A1917',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
};

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode]       = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ fullName: '', email: '', password: '', address: '' });

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        // backend: { email, password }
        await login({ email: form.email, password: form.password });
        toast.success('Welcome back!');
      } else {
        // backend: { fullName, email, password, address }
        if (!form.fullName || !form.address) {
          toast.error('Full name and address are required');
          setLoading(false);
          return;
        }
        await signup({ fullName: form.fullName, email: form.email, password: form.password, address: form.address });
        toast.success('Account created!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 28 }}>
            Civic<span style={{ color: '#4A9E4A' }}>Pulse</span>
          </div>
          <div style={{ fontSize: 14, color: '#6B6960', marginTop: 6 }}>Smart Civic Issue Reporting System</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2DED6', padding: '2rem' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', gap: 2, background: '#F7F6F2', borderRadius: 8, padding: 3, marginBottom: '1.5rem' }}>
            {['login','signup'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: 8, borderRadius: 6, border: 'none', fontSize: 14,
                fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#1A1917' : '#6B6960',
                boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                transition: 'all .15s',
              }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} type="text" placeholder="Your full name" value={form.fullName} onChange={set('fullName')} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Address</label>
                  <input style={inputStyle} type="text" placeholder="Your address" value={form.address} onChange={set('address')} required />
                </div>
              </>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
            </div>

            <Button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#A8A49E', marginTop: '1.5rem' }}>
          Report civic issues · Track resolution · Improve your city
        </p>
      </div>
    </div>
  );
}
