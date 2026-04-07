import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Layout({ children }) {
  const { logout, user } = useAuth();
  const { isDark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: '🏠 Dashboard', roles: ['admin', 'doctor', 'nurse', 'receptionist', 'billing'] },
    { path: '/patients', label: '🧑‍⚕️ Patients', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/appointments', label: '📅 Appointments', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/orders', label: '📦 Purchase Orders', roles: ['admin', 'billing'] },
    { path: '/invoices', label: '🧾 Invoices', roles: ['admin', 'billing'] },
  ];

  // DARK MODE COLORS
  const theme = {
    sidebar: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    bg: isDark ? '#1a1a2e' : '#f0f2f5',
    cardBg: isDark ? '#16213e' : 'white',
    text: isDark ? '#e0e0e0' : '#333',
    subtext: isDark ? '#aaa' : '#888',
    border: isDark ? '#2a2a4a' : '#eee',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '260px', background: theme.sidebar, display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>

        {/* Logo */}
        <div style={{ padding: '30px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>🏥 CareLink Pro</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '4px 0 0 0' }}>Management Platform</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {menuItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '14px 24px',
                  color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderLeft: location.pathname === item.path ? '3px solid white' : '3px solid transparent',
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  fontWeight: location.pathname === item.path ? '600' : 'normal',
                }}
              >
                {item.label}
              </div>
            ))}
        </nav>

        {/* Bottom Section */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>

          {/* Dark Mode Toggle */}
          <div
            onClick={toggleDark}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            <span style={{ color: 'white', fontSize: '14px' }}>
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
            <div style={{
              width: '36px',
              height: '20px',
              background: isDark ? 'white' : 'rgba(255,255,255,0.3)',
              borderRadius: '10px',
              position: 'relative',
              transition: 'all 0.3s',
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                background: isDark ? '#667eea' : 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: isDark ? '19px' : '3px',
                transition: 'all 0.3s',
              }} />
            </div>
          </div>

          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ fontSize: '28px' }}>👤</span>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                {user?.role?.toUpperCase()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Logged in</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1, minHeight: '100vh' }}>
        <div style={{ padding: '30px', color: theme.text }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;