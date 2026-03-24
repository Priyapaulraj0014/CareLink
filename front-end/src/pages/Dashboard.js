import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

function StatCard({ icon, title, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.cardIcon}>{icon}</div>
      <div style={styles.cardInfo}>
        <div style={styles.cardValue}>{value}</div>
        <div style={styles.cardTitle}>{title}</div>
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

  return (
    <Layout>
      <div>
        <h1 style={styles.heading}>Welcome back, {user?.role?.toUpperCase()} 👋</h1>
        <p style={styles.subheading}>Here's what's happening today</p>

        <div style={styles.statsGrid}>
          <StatCard icon="🧑‍⚕️" title="Total Patients" value={stats.total_patients} color="#667eea" />
          <StatCard icon="📅" title="Appointments Today" value={stats.today_appointments} color="#f093fb" />
          <StatCard icon="📦" title="Pending Orders" value={stats.pending_orders} color="#4facfe" />
          <StatCard icon="🧾" title="Unpaid Invoices" value={stats.unpaid_invoices} color="#f5576c" />
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

const styles = {
  heading: { fontSize: '26px', color: '#333', margin: '0 0 5px 0' },
  subheading: { color: '#888', margin: '0 0 30px 0' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    background: 'white', borderRadius: '12px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardIcon: { fontSize: '36px' },
  cardValue: { fontSize: '28px', fontWeight: '700', color: '#333' },
  cardTitle: { fontSize: '13px', color: '#888', marginTop: '2px' },
  section: {
    background: 'white', borderRadius: '12px',
    padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  sectionTitle: { fontSize: '18px', color: '#333', margin: '0 0 20px 0' },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  quickLink: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '15px', background: '#f8f9fa', borderRadius: '10px',
    textDecoration: 'none', color: '#444', fontSize: '14px',
    fontWeight: '600', transition: 'all 0.2s',
  },
  quickLinkIcon: { fontSize: '22px' },
};

export default Dashboard;