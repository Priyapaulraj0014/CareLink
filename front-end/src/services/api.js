const API_BASE_URL = 'http://192.168.31.210/carelink-pro/Back-end/api';

const apiService = {
  token: localStorage.getItem('token'),

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      },
    };
    const response = await fetch(url, config);
    return response.json();
  },

  async login(username, password) {
    return this.request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getPatients() {
    return this.request('/patients/list.php');
  },

  async createPatient(data) {
    return this.request('/patients/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAppointments() {
    return this.request('/appointments/list.php');
  },

  async createAppointment(data) {
    return this.request('/appointments/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getPurchaseOrders() {
    return this.request('/orders/list.php');
  },

  async createPurchaseOrder(data) {
    return this.request('/orders/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getInvoices() {
    return this.request('/invoices/list.php');
  },

  async generateInvoice(data) {
    return this.request('/invoices/generate.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getAppointments() {
    return this.request('/appointments/list.php');
  },

  async createAppointment(data) {
    return this.request('/appointments/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAppointmentStatus(id, status) {
    return this.request('/appointments/update_status.php', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
    });
  },

  async getDoctors() {
    return this.request('/appointments/get_doctors.php');
  },
};



export default apiService;