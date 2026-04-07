import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', dob: '',
    phone: '', email: '', address: '',
    emergency_contact: '', medical_history: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate first
  const validationErrors = validatePatient();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});
  setLoading(true);
  try {
    await apiService.createPatient(formData);
    await loadPatients();
    setShowForm(false);
    setFormData({
      first_name: '', last_name: '', dob: '',
      phone: '', email: '', address: '',
      emergency_contact: '', medical_history: ''
    });
    alert('Patient added successfully!');
  } catch (error) {
    alert('Error adding patient');
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await apiService.request('/patients/delete.php', {
          method: 'POST',
          body: JSON.stringify({ id })
        });
        await loadPatients();
      } catch (error) {
        alert('Error deleting patient');
      }
    }
  };
  const validatePatient = () => {
  const newErrors = {};

  if (!formData.first_name.trim())
    newErrors.first_name = 'First name is required';

  if (!formData.last_name.trim())
    newErrors.last_name = 'Last name is required';

  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone is required';
  } else if (!/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = 'Phone must be exactly 10 digits';
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Enter a valid email address';
  }

  return newErrors;
};

  const filteredPatients = patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>🧑‍⚕️ Patients</h1>
            <p style={styles.subheading}>Manage all patient records</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ Add Patient'}
          </button>
        </div>

        {/* Add Patient Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Patient</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name *</label>
                  <input
                    style={{
                      ...styles.input,
                      border: errors.first_name ? '1px solid #cc0000' : '1px solid #ddd'
                    }}
                    value={formData.first_name}
                    onChange={e => {
                      setFormData({...formData, first_name: e.target.value});
                      if (errors.first_name) setErrors({...errors, first_name: ''});
                    }}
                    placeholder="First name" />
                  {errors.first_name && <span style={styles.fieldError}>{errors.first_name}</span>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name *</label>
                  <input
                    style={{
                      ...styles.input,
                      border: errors.last_name ? '1px solid #cc0000' : '1px solid #ddd'
                    }}
                    value={formData.last_name}
                    onChange={e => {
                      setFormData({...formData, last_name: e.target.value});
                      if (errors.last_name) setErrors({...errors, last_name: ''});
                    }}
                    placeholder="Last name" />
                  {errors.last_name && <span style={styles.fieldError}>{errors.last_name}</span>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date of Birth</label>
                  <input style={styles.input} type="date" value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div style={styles.inputGroup}>
                <label style={styles.label}>Phone *</label>
                <input
                  style={{
                    ...styles.input,
                    border: errors.phone ? '1px solid #cc0000' : '1px solid #ddd'
                  }}
                  value={formData.phone}
                  onChange={e => {
                    setFormData({...formData, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: ''});
                  }}
                  placeholder="Phone number" />
                {errors.phone && <span style={styles.fieldError}>{errors.phone}</span>}
              </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    style={{
                      ...styles.input,
                      border: errors.email ? '1px solid #cc0000' : '1px solid #ddd'
                    }}
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                    placeholder="Email address" />
                  {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Emergency Contact</label>
                  <input style={styles.input} value={formData.emergency_contact}
                    onChange={e => setFormData({...formData, emergency_contact: e.target.value})}
                    placeholder="Emergency contact" />
                </div>
                <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                  <label style={styles.label}>Address</label>
                  <input style={styles.input} value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Full address" />
                </div>
                <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                  <label style={styles.label}>Medical History</label>
                  <textarea style={{...styles.input, height: '80px'}} value={formData.medical_history}
                    onChange={e => setFormData({...formData, medical_history: e.target.value})}
                    placeholder="Medical history notes" />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : 'Save Patient'}
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div style={styles.searchBar}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Search patients by name, phone or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Patients Table */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>Loading patients...</p>
          ) : filteredPatients.length === 0 ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>No patients found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>DOB</th>
                  <th style={styles.th}>Emergency Contact</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.patientName}>
                        {patient.first_name} {patient.last_name}
                      </div>
                    </td>
                    <td style={styles.td}>{patient.phone}</td>
                    <td style={styles.td}>{patient.email}</td>
                    <td style={styles.td}>{patient.dob}</td>
                    <td style={styles.td}>{patient.emergency_contact}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        style={styles.deleteBtn}>
                        🗑️ Delete
                      </button>
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
  searchBar: { marginBottom:'20px' },
  searchInput: { width:'100%', padding:'12px 15px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box' },
  tableCard: { background:'white', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', overflow:'hidden' },
  table: { width:'100%', borderCollapse:'collapse' },
  tableHeader: { background:'#f8f9fa' },
  th: { padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee' },
  tableRow: { borderBottom:'1px solid #f0f0f0' },
  td: { padding:'14px 16px', fontSize:'14px', color:'#444' },
  patientName: { fontWeight:'600', color:'#333' },
  deleteBtn: { padding:'6px 12px', background:'#fff0f0', color:'#cc0000', border:'1px solid #ffcccc', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
};

export default Patients;
