import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: '', order_date: '',
    total_amount: '', status: 'pending'
  });

  useEffect(() => {
    loadOrders();

    // Real-time AJAX polling every 5 seconds
    const polling = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(polling);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await apiService.getPurchaseOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createPurchaseOrder(formData);
      await loadOrders();
      setShowForm(false);
      setFormData({ supplier_name: '', order_date: '', total_amount: '', status: 'pending' });
      alert('Purchase order created successfully!');
    } catch (error) {
      alert('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await apiService.request('/orders/update_status.php', {
        method: 'POST',
        body: JSON.stringify({ id, status })
      });
      await loadOrders();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const getStatusStyle = (status) => {
    const colors = {
      pending: { background: '#fff8e1', color: '#f57c00' },
      approved: { background: '#e8f4ff', color: '#0066cc' },
      delivered: { background: '#e8fff0', color: '#006633' },
    };
    return colors[status] || colors.pending;
  };

  const totalAmount = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>📦 Purchase Orders</h1>
            <p style={styles.subheading}>Manage supplier orders — live updates every 5 seconds</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ New Order'}
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{orders.length}</div>
            <div style={styles.statLabel}>Total Orders</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color:'#f57c00'}}>{pendingCount}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color:'#006633'}}>{deliveredCount}</div>
            <div style={styles.statLabel}>Delivered</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color:'#667eea'}}>
              ${totalAmount.toFixed(2)}
            </div>
            <div style={styles.statLabel}>Total Value</div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Purchase Order</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Supplier Name *</label>
                  <input style={styles.input} value={formData.supplier_name}
                    onChange={e => setFormData({...formData, supplier_name: e.target.value})}
                    placeholder="Supplier name" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Order Date *</label>
                  <input style={styles.input} type="date" value={formData.order_date}
                    onChange={e => setFormData({...formData, order_date: e.target.value})} required />
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
                    <option value="approved">Approved</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating...' : 'Create Order'}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader2}>
            <span style={styles.liveIndicator}>🟢 Live Updates</span>
          </div>
          {orders.length === 0 ? (
            <p style={{textAlign:'center', padding:'40px', color:'#888'}}>No orders found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Supplier</th>
                  <th style={styles.th}>Order Date</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created By</th>
                  <th style={styles.th}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.td}><strong>#{order.id}</strong></td>
                    <td style={styles.td}>{order.supplier_name}</td>
                    <td style={styles.td}>{order.order_date}</td>
                    <td style={styles.td}><strong>${parseFloat(order.total_amount).toFixed(2)}</strong></td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...getStatusStyle(order.status)}}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.td}>{order.created_by_name}</td>
                    <td style={styles.td}>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        style={styles.statusSelect}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="delivered">Delivered</option>
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
  tableHeader2: { padding:'15px 20px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'flex-end' },
  liveIndicator: { fontSize:'13px', color:'#006633', fontWeight:'600' },
  table: { width:'100%', borderCollapse:'collapse' },
  tableHeader: { background:'#f8f9fa' },
  th: { padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee' },
  tableRow: { borderBottom:'1px solid #f0f0f0' },
  td: { padding:'14px 16px', fontSize:'14px', color:'#444' },
  statusBadge: { padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  statusSelect: { padding:'6px 10px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'13px', cursor:'pointer' },
};

export default PurchaseOrders;