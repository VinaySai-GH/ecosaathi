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
    if (!name.trim()) { 
      setError('Please enter your name.'); 
      return; 
    }
    if (!phone || phone.length !== 10) { 
      setError('Phone must be 10 digits (e.g., 9919492311)'); 
      return; 
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone must contain only numbers (e.g., 9919492311)');
      return;
    }
    if (!password || password.length < 6) { 
      setError('Password must be at least 6 characters (e.g., MyPass123)'); 
      return; 
    }
    setIsSubmitting(true);
    try {
      const userData = await registerUser(name, phone, password);
      // Save phone number for future login
      localStorage.setItem('@remember_phone', phone);
      signIn(userData);
      navigate('/');
    } catch (err) {
      // Handle specific backend errors with better messages
      if (err.message.includes('already exists')) {
        setError('This phone number is already registered. Try logging in instead.');
      } else if (err.message.includes('Invalid') || err.message.includes('validation')) {
        setError('Please check your input: Name, 10-digit phone (e.g., 9919492311), password 6+ chars');
      } else {
        setError(err.message || 'Could not register. Please try again.');
      }
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
          <input type="tel" placeholder="10-digit number (e.g., 9919492311)" value={phone} maxLength={10}
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }} />
          <p className="auth-hint" style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Enter without spaces or dashes</p>
          <label className="auth-label" style={{ marginTop: 20 }}>Password</label>
          <input type="password" placeholder="6+ characters (e.g., MyPass123)" value={password}
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
