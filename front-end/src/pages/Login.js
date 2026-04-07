import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // VALIDATION FUNCTION
  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // STOP — don't send to PHP if validation fails
    }

    setErrors({});
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.message || 'Login failed. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>🏥 CareLink Pro</h1>
          <p style={styles.subtitle}>Healthcare Services Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.description}>Sign in to your account</p>

          {errors.general && <div style={styles.errorBox}>{errors.general}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({...errors, username: ''});
              }}
              style={{
                ...styles.input,
                border: errors.username ? '1px solid #cc0000' : '1px solid #ddd'
              }}
              placeholder="Enter your username"
            />
            {errors.username && <span style={styles.fieldError}>{errors.username}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({...errors, password: ''});
              }}
              style={{
                ...styles.input,
                border: errors.password ? '1px solid #cc0000' : '1px solid #ddd'
              }}
              placeholder="Enter your password"
            />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>

          <button
            type="submit"
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logoSection: { textAlign: 'center', marginBottom: '30px' },
  logo: { fontSize: '28px', color: '#667eea', margin: '0' },
  subtitle: { color: '#888', fontSize: '13px', margin: '5px 0 0 0' },
  title: { fontSize: '22px', color: '#333', margin: '0 0 5px 0' },
  description: { color: '#888', fontSize: '14px', margin: '0 0 25px 0' },
  errorBox: {
    background: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#cc0000',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '600' },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  fieldError: {
    color: '#cc0000',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block',
  },
  button: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonDisabled: {
    width: '100%',
    padding: '13px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '10px',
  },
};

export default Login;