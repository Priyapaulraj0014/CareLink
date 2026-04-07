import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoices from './pages/Invoices';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><PurchaseOrders /></PrivateRoute>} />
            <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;