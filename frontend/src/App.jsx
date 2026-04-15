import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage      from './pages/LoginPage';
import HomePage       from './pages/HomePage';
import ReportPage     from './pages/ReportPage';
import MyReportsPage  from './pages/MyReportsPage';
import DashboardPage  from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: "'DM Sans', sans-serif" }}>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />

            {/* Auth only */}
            <Route path="/login" element={
              <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
            } />

            {/* Citizen routes */}
            <Route path="/report" element={
              <ProtectedRoute><ReportPage /></ProtectedRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedRoute><MyReportsPage /></ProtectedRoute>
            } />

            {/* Authority routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuthority><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/complaints" element={
              <ProtectedRoute requireAuthority><ComplaintsPage /></ProtectedRoute>
            } />

            {/* 404 fallback */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6960' }}>
                <div style={{ fontSize: 48, marginBottom: '1rem' }}>🗺️</div>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', marginBottom: '.5rem' }}>Page not found</h2>
                <a href="/" style={{ color: '#4A9E4A', fontSize: 14 }}>Go back home</a>
              </div>
            } />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                background: '#1A1917',
                color: '#fff',
                borderRadius: 8,
              },
              success: { iconTheme: { primary: '#4A9E4A', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#D94040', secondary: '#fff' } },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
