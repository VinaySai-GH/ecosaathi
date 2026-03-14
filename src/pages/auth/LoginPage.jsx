import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginUser } from '../../services/auth.service.js';
import './auth.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setIsSubmitting(true);
    try {
      const userData = await loginUser(phone, password);
      signIn(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box anim-enter">
        <div className="auth-header">
          <span className="auth-brand-icon">🌿</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Enter your phone number to access EcoSaathi</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <label className="auth-label">Phone Number</label>
          <input type="tel" placeholder="10-digit mobile number" value={phone} maxLength={10}
            onChange={(e) => { setPhone(e.target.value); setError(''); }} autoFocus />
          <label className="auth-label" style={{ marginTop: 20 }}>Password</label>
          <input type="password" placeholder="Enter your password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }} />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : 'Login'}
          </button>
          <p className="auth-link">
            New here? <span className="auth-link-highlight" onClick={() => navigate('/register')}>Register instead</span>
          </p>
        </form>
      </div>
    </div>
  );
}
