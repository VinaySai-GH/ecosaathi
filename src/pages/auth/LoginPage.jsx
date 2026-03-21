import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginUser } from '../../services/auth.service.js';
import './auth.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Autofill saved phone number on component mount
  React.useEffect(() => {
    try {
      const savedPhone = localStorage.getItem('@remember_phone');
      if (savedPhone) {
        setPhone(savedPhone);
        setRememberMe(true);
      }
    } catch (e) {
      console.error('Failed to load saved phone', e);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || phone.length !== 10) { 
      setError('Phone must be 10 digits (e.g., 9919492311)'); 
      return; 
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone must contain only numbers (e.g., 9919492311)');
      return;
    }
    if (!password) { 
      setError('Please enter your password.'); 
      return; 
    }
    setIsSubmitting(true);
    try {
      const userData = await loginUser(phone, password);
      
      // Save phone if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('@remember_phone', phone);
      } else {
        localStorage.removeItem('@remember_phone');
      }
      
      signIn(userData);
      navigate('/');
    } catch (err) {
      // Better error messages
      if (err.message.includes('Invalid phone') || err.message.includes('Invalid password')) {
        setError('Wrong phone or password. Check the example: 9919492311');
      } else if (err.message.includes('not found')) {
        setError('Phone number not registered. Please sign up first.');
      } else {
        setError(err.message || 'Could not log in. Please try again.');
      }
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
          <input type="tel" placeholder="10-digit number (e.g., 9919492311)" value={phone} maxLength={10}
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }} autoFocus />
          <p className="auth-hint" style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Enter without spaces or dashes</p>
          <label className="auth-label" style={{ marginTop: 20 }}>Password</label>
          <input type="password" placeholder="Your password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }} />
          
          <div className="auth-remember" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input 
              type="checkbox" 
              id="remember-me" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', width: 16, height: 16 }}
            />
            <label htmlFor="remember-me" style={{ cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>
              Remember this phone number
            </label>
          </div>
          
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
