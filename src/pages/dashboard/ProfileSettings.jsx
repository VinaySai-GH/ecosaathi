import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateProfile, getCities } from '../../services/auth.service.js';

export default function ProfileSettings() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  
  // Local state for edits
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [password, setPassword] = useState('');
  
  const [allCities, setAllCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    getCities().then(res => setAllCities(res.cities || [])).catch(err => console.error(err));
    
    // click outside listener
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const formattedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
      const updatedUser = await updateProfile(name, password || undefined, formattedCity);
      signIn(updatedUser); // Update local context and storage seamlessly
      setMessage('Profile updated successfully!');
      setPassword(''); 
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Hero Avatar Section (WhatsApp Style) */}
      <div style={styles.heroSection}>
        <div style={styles.avatarLarge}>
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <h2 style={styles.heroName}>{user?.name}</h2>
        <p style={styles.heroPhone}>+91 {user?.phone} • {user?.city || 'No City Assigned'}</p>
      </div>

      <div style={styles.settingsCard}>
        <h3 style={styles.sectionTitle}>Edit Profile</h3>
        
        <form onSubmit={handleUpdate} style={styles.formContainer}>
          
          {/* Read-Only Phone field mimicking WhatsApp static info */}
          <div style={styles.formGroup}>
            <div style={styles.iconCol}>📱</div>
            <div style={styles.inputCol}>
              <label style={styles.label}>Phone Number (Fixed)</label>
              <input type="text" value={user?.phone || ''} disabled style={styles.inputDisabled} />
            </div>
          </div>
          <hr style={styles.divider} />

          <div style={styles.formGroup}>
            <div style={styles.iconCol}>👤</div>
            <div style={styles.inputCol}>
              <label style={styles.label}>Display Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={styles.input} 
                required
              />
            </div>
          </div>
          <hr style={styles.divider} />

          <div style={styles.formGroup}>
            <div style={styles.iconCol}>🏢</div>
            <div style={styles.inputCol}>
              <label style={styles.label}>City (Eco Pulse Leaderboard)</label>
              <div style={{ position: 'relative' }} ref={suggestionRef}>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => {
                    setCity(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="e.g. Tirupati"
                  style={styles.input} 
                />
                
                {showSuggestions && city && allCities.filter(c => c.toLowerCase().includes(city.toLowerCase()) && c.toLowerCase() !== city.toLowerCase()).length > 0 && (
                  <ul style={styles.suggestionsList}>
                    {allCities
                      .filter(c => c.toLowerCase().includes(city.toLowerCase()) && c.toLowerCase() !== city.toLowerCase())
                      .map((c, i) => (
                      <li key={i} style={styles.suggestionItem} onClick={() => {
                        setCity(c);
                        setShowSuggestions(false);
                      }}>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <hr style={styles.divider} />

          <div style={styles.formGroup}>
            <div style={styles.iconCol}>🔒</div>
            <div style={styles.inputCol}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to remain unchanged"
                style={styles.input} 
              />
            </div>
          </div>

          <div style={styles.actionContainer}>
            {error && <p style={styles.errorText}>{error}</p>}
            {message && <p style={styles.successText}>{message}</p>}

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} style={styles.saveBtn}>
                 {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatarLarge: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#075E54', // WhatsApp classic green primary
    color: '#fff',
    fontSize: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  heroName: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff'
  },
  heroPhone: {
    margin: '5px 0 0 0',
    fontSize: '15px',
    color: '#aaa'
  },
  settingsCard: {
    backgroundColor: '#11221c',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#25D366', // WhatsApp bright green
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0'
  },
  iconCol: {
    width: '40px',
    fontSize: '22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#888'
  },
  inputCol: {
    flex: 1,
    paddingLeft: '10px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#888',
    marginBottom: '4px'
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#fff',
    fontSize: '16px',
    padding: '4px 0',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputDisabled: {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    fontSize: '16px',
    padding: '4px 0',
    cursor: 'not-allowed'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid #22332c',
    margin: '4px 0 4px 50px' // Align divider under text only, WhatsApp style
  },
  actionContainer: {
    marginTop: '30px',
    textAlign: 'center'
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#075E54',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1a2b25',
    color: '#aaa',
    border: '1px solid #22332c',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1a3f2b',
    border: '1px solid #1e4a32',
    borderRadius: '12px',
    marginTop: '4px',
    padding: 0,
    listStyle: 'none',
    maxHeight: '160px',
    overflowY: 'auto',
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  suggestionItem: {
    padding: '12px 16px',
    color: '#fff',
    cursor: 'pointer',
    borderBottom: '1px solid #122d1e',
    fontSize: '15px'
  },
  errorText: {
    color: '#ef5350',
    marginBottom: '15px'
  },
  successText: {
    color: '#25D366',
    marginBottom: '15px'
  }
};
