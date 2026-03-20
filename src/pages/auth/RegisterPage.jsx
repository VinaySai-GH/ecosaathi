import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { registerUser } from '../../services/auth.service.js';
import './auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!phone || phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setIsSubmitting(true);
    try {
      const userData = await registerUser(name, phone, password);
      signIn(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box anim-enter">
        <div className="auth-header">
          <span className="auth-brand-icon">🌱</span>
          <h1 className="auth-title">Join EcoSaathi</h1>
          <p className="auth-subtitle">Create an account to start tracking</p>
        </div>
        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <label className="auth-label">Full Name</label>
          <input type="text" placeholder="Your Name" value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }} autoFocus />
          <label className="auth-label" style={{ marginTop: 20 }}>Phone Number</label>
          <input type="tel" placeholder="10-digit mobile number" value={phone} maxLength={10}
            onChange={(e) => { setPhone(e.target.value); setError(''); }} />
          <label className="auth-label" style={{ marginTop: 20 }}>Password</label>
          <input type="password" placeholder="Enter a strong password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }} />

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : 'Register'}
          </button>
          <p className="auth-link">
            Already have an account? <span className="auth-link-highlight" onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}
