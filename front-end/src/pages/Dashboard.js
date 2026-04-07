import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

function StatCard({ icon, title, value, color, cardBg, textColor, subtextColor }) {
  return (
    <div style={{ background: cardBg, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: '36px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: textColor }}>{value}</div>
        <div style={{ fontSize: '13px', color: subtextColor, marginTop: '2px' }}>{title}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_patients: 0,
    today_appointments: 0,
    pending_orders: 0,
    unpaid_invoices: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiService.request('/dashboard/stats.php');
      if (!data.error) setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  const { isDark } = useTheme();

    const theme = {
      cardBg: isDark ? '#16213e' : 'white',
      text: isDark ? '#e0e0e0' : '#333',
      subtext: isDark ? '#aaa' : '#888',
      sectionBg: isDark ? '#16213e' : 'white',
    };
    const styles = {
  heading: { fontSize: '26px', color: theme.text, margin: '0 0 5px 0' },
  subheading: { color: theme.subtext, margin: '0 0 30px 0' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    background: theme.cardBg,
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardIcon: { fontSize: '36px' },
  cardValue: { fontSize: '28px', fontWeight: '700', color: theme.text },
  cardTitle: { fontSize: '13px', color: theme.subtext, marginTop: '2px' },
  section: {
    background: theme.sectionBg,
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  sectionTitle: { fontSize: '18px', color: theme.text, margin: '0 0 20px 0' },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  quickLink: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '15px',
    background: isDark ? '#1a1a3e' : '#f8f9fa',
    borderRadius: '10px',
    textDecoration: 'none',
    color: theme.text,
    fontSize: '14px',
    fontWeight: '600',
  },
  quickLinkIcon: { fontSize: '22px' },
  };


  return (
    <Layout>
      <div>
        <h1 style={styles.heading}>Welcome back, {user?.role?.toUpperCase()} 👋</h1>
        <p style={styles.subheading}>Here's what's happening today</p>

        <div style={styles.statsGrid}>
          <StatCard icon="🧑‍⚕️" title="Total Patients" value={stats.total_patients} color="#667eea" cardBg={theme.cardBg} textColor={theme.text} subtextColor={theme.subtext} />
          <StatCard icon="📅" title="Appointments Today" value={stats.today_appointments} color="#f093fb" cardBg={theme.cardBg} textColor={theme.text} subtextColor={theme.subtext} />
          <StatCard icon="📦" title="Pending Orders" value={stats.pending_orders} color="#4facfe" cardBg={theme.cardBg} textColor={theme.text} subtextColor={theme.subtext} />
          <StatCard icon="🧾" title="Unpaid Invoices" value={stats.unpaid_invoices} color="#f5576c" cardBg={theme.cardBg} textColor={theme.text} subtextColor={theme.subtext} />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Quick Links</h2>
          <div style={styles.quickLinks}>
            {[
              { icon: '🧑‍⚕️', label: 'Add New Patient', path: '/patients' },
              { icon: '📅', label: 'Schedule Appointment', path: '/appointments' },
              { icon: '📦', label: 'Create Purchase Order', path: '/orders' },
              { icon: '🧾', label: 'Create Invoice', path: '/invoices' },
            ].map((item, index) => (
              <a key={index} href={item.path} style={styles.quickLink}>
                <span style={styles.quickLinkIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}



export default Dashboard;