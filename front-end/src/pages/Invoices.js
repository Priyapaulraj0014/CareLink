import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '', invoice_date: '',
    total_amount: '', status: 'pending'
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [invs, pts] = await Promise.all([
        apiService.getInvoices(),
        apiService.getPatients(),
      ]);
      setInvoices(Array.isArray(invs) ? invs : []);
      setPatients(Array.isArray(pts) ? pts : []);
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
      await apiService.request('/invoices/create.php', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      await loadAll();
      setShowForm(false);
      setFormData({ patient_id: '', invoice_date: '', total_amount: '', status: 'pending' });
      alert('Invoice created successfully!');
    } catch (error) {
      alert('Error creating invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await apiService.request('/invoices/update_status.php', {
        method: 'POST',
        body: JSON.stringify({ id, status })
      });
      await loadAll();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDownloadPDF = (id) => {
    window.open(
      `http://localhost/carelink-pro/Back-end/api/invoices/generate_pdf.php?id=${id}`,
      '_blank'
    );
  };

  const getStatusStyle = (status) => {
    const colors = {
      pending: { background: '#fff8e1', color: '#f57c00' },
      paid: { background: '#e8fff0', color: '#006633' },
      overdue: { background: '#fff0f0', color: '#cc0000' },
    };
    return colors[status] || colors.pending;
  };

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + parseFloat(i.total_amount || 0), 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + parseFloat(i.total_amount || 0), 0);

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>🧾 Invoices</h1>
            <p style={styles.subheading}>Manage billing and generate PDF invoices</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ New Invoice'}
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{invoices.length}</div>
            <div style={styles.statLabel}>Total Invoices</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color:'#006633'}}>
              ${totalRevenue.toFixed(2)}
            </div>
            <div style={styles.statLabel}>Total Collected</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color:'#f57c00'}}>
              ${pendingAmount.toFixed(2)}
            </div>
            <div style={styles.statLabel}>Pending Amount</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color:'#cc0000'}}>
              {invoices.filter(i => i.status === 'overdue').length}
            </div>
            <div style={styles.statLabel}>Overdue</div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Invoice</h3>
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
                  <label style={styles.label}>Invoice Date *</label>
                  <input style={styles.input} type="date" value={formData.invoice_date}
                    onChange={e => setFormData({...formData, invoice_date: e.target.value})} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Amount *</label>
                  <input style={styles.input} type="number" step="0.01" value={formData.total_amount}
                    onChange={e => setFormData({...formData, total_amount: e.target.value})}
                    placeholder="0.00" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Status</label>
                  <select style={styles.input} value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>No invoices found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Invoice #</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Update</th>
                  <th style={styles.th}>PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <strong>INV-{String(invoice.id).padStart(4, '0')}</strong>
                    </td>
                    <td style={styles.td}>{invoice.patient_name}</td>
                    <td style={styles.td}>{invoice.invoice_date}</td>
                    <td style={styles.td}>
                      <strong>${parseFloat(invoice.total_amount).toFixed(2)}</strong>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...getStatusStyle(invoice.status)}}>
                        {invoice.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={invoice.status}
                        onChange={e => handleStatusChange(invoice.id, e.target.value)}
                        style={styles.statusSelect}>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDownloadPDF(invoice.id)}
                        style={styles.pdfBtn}>
                        📄 Download PDF
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
  statsRow: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'15px', marginBottom:'25px' },
  statCard: { background:'white', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  statValue: { fontSize:'28px', fontWeight:'700', color:'#333' },
  statLabel: { fontSize:'13px', color:'#888', marginTop:'4px' },
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
  pdfBtn: { padding:'7px 14px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontWeight:'600' },
};

export default Invoices;