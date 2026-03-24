import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const { logout, user } = useAuth();
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

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <h2 style={styles.logo}>🏥 CareLink Pro</h2>
          <p style={styles.logoSub}>Management Platform</p>
        </div>

        <nav style={styles.nav}>
          {menuItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  ...(location.pathname === item.path ? styles.navItemActive : {})
                }}
              >
                {item.label}
              </div>
            ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>👤</div>
            <div>
              <div style={styles.userName}>{user?.role?.toUpperCase()}</div>
              <div style={styles.userRole}>Logged in</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    background: '#f0f2f5',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  logoSection: {
    padding: '30px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  logo: {
    color: 'white',
    margin: 0,
    fontSize: '20px',
  },
  logoSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    margin: '4px 0 0 0',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto',
  },
  navItem: {
    padding: '14px 24px',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent',
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderLeft: '3px solid white',
    fontWeight: '600',
  },
  sidebarBottom: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  avatar: {
    fontSize: '28px',
  },
  userName: {
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
  },
  userRole: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '11px',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    marginLeft: '260px',
    flex: 1,
    minHeight: '100vh',
  },
  content: {
    padding: '30px',
  },
};

export default Layout;