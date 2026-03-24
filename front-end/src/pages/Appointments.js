import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '', doctor_id: '',
    appointment_date: '', status: 'scheduled', notes: ''
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [appts, pts, docs] = await Promise.all([
        apiService.getAppointments(),
        apiService.getPatients(),
        apiService.getDoctors(),
      ]);
      setAppointments(Array.isArray(appts) ? appts : []);
      setPatients(Array.isArray(pts) ? pts : []);
      setDoctors(Array.isArray(docs) ? docs : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createAppointment(formData);
      await loadAll();
      setShowForm(false);
      setFormData({ patient_id: '', doctor_id: '', appointment_date: '', status: 'scheduled', notes: '' });
      alert('Appointment created successfully!');
    } catch (error) {
      alert('Error creating appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await apiService.updateAppointmentStatus(id, status);
      await loadAll();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const getStatusStyle = (status) => {
    const colors = {
      scheduled: { background: '#e8f4ff', color: '#0066cc' },
      completed: { background: '#e8fff0', color: '#006633' },
      cancelled: { background: '#fff0f0', color: '#cc0000' },
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>📅 Appointments</h1>
            <p style={styles.subheading}>Manage patient appointments</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ New Appointment'}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Schedule New Appointment</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Patient *</label>
                  <select style={styles.input} value={formData.patient_id}
                    onChange={e => setFormData({...formData, patient_id: e.target.value})} required>
                    <option value="">Select Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Doctor *</label>
                  <select style={styles.input} value={formData.doctor_id}
                    onChange={e => setFormData({...formData, doctor_id: e.target.value})} required>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.username}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date & Time *</label>
                  <input style={styles.input} type="datetime-local" value={formData.appointment_date}
                    onChange={e => setFormData({...formData, appointment_date: e.target.value})} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Status</label>
                  <select style={styles.input} value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                  <label style={styles.label}>Notes</label>
                  <textarea style={{...styles.input, height: '80px'}} value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="Appointment notes..." />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : 'Schedule Appointment'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.tableCard}>
          {loading ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>No appointments found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Doctor</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} style={styles.tableRow}>
                    <td style={styles.td}><strong>{appt.patient_name}</strong></td>
                    <td style={styles.td}>{appt.doctor_name}</td>
                    <td style={styles.td}>{new Date(appt.appointment_date).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...getStatusStyle(appt.status)}}>
                        {appt.status}
                      </span>
                    </td>
                    <td style={styles.td}>{appt.notes}</td>
                    <td style={styles.td}>
                      <select
                        value={appt.status}
                        onChange={e => handleStatusChange(appt.id, e.target.value)}
                        style={styles.statusSelect}>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px' },
  heading: { fontSize:'26px', color:'#333', margin:0 },
  subheading: { color:'#888', margin:'4px 0 0 0' },
  addBtn: { padding:'12px 24px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'600' },
  formCard: { background:'white', borderRadius:'12px', padding:'25px', marginBottom:'25px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  formTitle: { margin:'0 0 20px 0', color:'#333' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'20px' },
  inputGroup: { display:'flex', flexDirection:'column' },
  label: { fontSize:'13px', color:'#555', fontWeight:'600', marginBottom:'6px' },
  input: { padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none', width:'100%', boxSizing:'border-box' },
  submitBtn: { padding:'12px 30px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'600' },
  tableCard: { background:'white', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', overflow:'hidden' },
  table: { width:'100%', borderCollapse:'collapse' },
  tableHeader: { background:'#f8f9fa' },
  th: { padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee' },
  tableRow: { borderBottom:'1px solid #f0f0f0' },
  td: { padding:'14px 16px', fontSize:'14px', color:'#444' },
  statusBadge: { padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  statusSelect: { padding:'6px 10px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'13px', cursor:'pointer' },
};

export default Appointments;