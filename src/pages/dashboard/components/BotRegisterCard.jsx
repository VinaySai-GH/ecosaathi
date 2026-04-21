import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { Colors, Spacing } from '../../../constants/theme.js';

export default function BotRegisterCard() {
    const { user, token } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [preferredTime, setPreferredTime] = useState('21:00');
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            checkBotStatus();
        }
    }, [user]);

    const checkBotStatus = async () => {
        try {
            const response = await fetch('/api/bot/status', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setIsRegistered(data.registered);
            if (data.registered) {
                setPreferredTime(data.botUser.preferred_time);
                setStreak(data.botUser.streak);
            }
        } catch (error) {
            console.error('Failed to check bot status:', error);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/bot/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ preferred_time: preferredTime }),
            });

            if (response.ok) {
                setIsRegistered(true);
                setMessage('✅ Registered for Raat Ka Hisaab! 🌙');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const data = await response.json();
                setMessage('❌ ' + (data.error || 'Registration failed'));
            }
        } catch (error) {
            setMessage('❌ Connection error');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTime = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/bot/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ preferred_time: preferredTime }),
            });

            if (response.ok) {
                setMessage('✅ Time updated!');
                setTimeout(() => setMessage(''), 2000);
            } else {
                setMessage('❌ Update failed');
            }
        } catch (error) {
            setMessage('❌ Connection error');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.icon}>🌙</span>
                <h3 style={styles.title}>Raat Ka Hisaab</h3>
                <span style={styles.subtitle}>Nightly Reflection Bot</span>
            </div>

            {!isRegistered ? (
                <div style={styles.content}>
                    <p style={styles.description}>
                        Receive daily WhatsApp messages with eco-reflection questions. Reply Y/N/Hmm to build your
                        streak and earn insights.
                    </p>

                    <div style={styles.timeSelector}>
                        <label style={styles.label}>Preferred message time:</label>
                        <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            style={styles.select}
                        >
                            <option value="21:00">21:00 (9:00 PM)</option>
                            <option value="21:30">21:30 (9:30 PM)</option>
                            <option value="22:00">22:00 (10:00 PM)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...styles.buttonPrimary,
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? 'Registering...' : 'Join Raat Ka Hisaab'}
                    </button>
                </div>
            ) : (
                <div style={styles.content}>
                    <div style={styles.statusBox}>
                        <p style={styles.statusLabel}>✅ You're registered!</p>
                        <p style={styles.streakText}>🔥 Current Streak: {streak} days</p>
                    </div>

                    <div style={styles.timeSelector}>
                        <label style={styles.label}>Change message time:</label>
                        <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            style={styles.select}
                        >
                            <option value="21:00">21:00 (9:00 PM)</option>
                            <option value="21:30">21:30 (9:30 PM)</option>
                            <option value="22:00">22:00 (10:00 PM)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleUpdateTime}
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...styles.buttonSecondary,
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Time'}
                    </button>

                    <a href="/insights" style={styles.insightsLink}>
                        📊 View Your 30-Day Insights →
                    </a>
                </div>
            )}

            {message && (
                <div style={{
                    ...styles.message,
                    backgroundColor: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
                    color: message.startsWith('✅') ? '#065f46' : '#991b1b',
                }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: Colors.surface,
        borderRadius: '8px',
        padding: Spacing.lg,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    icon: {
        fontSize: '28px',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 'bold',
        color: Colors.text,
    },
    subtitle: {
        fontSize: '12px',
        color: '#999',
        marginLeft: 'auto',
        fontStyle: 'italic',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.md,
    },
    description: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
        lineHeight: '1.5',
    },
    timeSelector: {
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.sm,
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: Colors.text,
    },
    select: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        fontFamily: 'inherit',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    button: {
        padding: '10px 16px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    buttonPrimary: {
        backgroundColor: Colors.accent,
        color: 'white',
    },
    buttonSecondary: {
        backgroundColor: '#e5e7eb',
        color: Colors.text,
    },
    statusBox: {
        backgroundColor: '#d1fae5',
        padding: Spacing.md,
        borderRadius: '6px',
        border: '1px solid #6ee7b7',
    },
    statusLabel: {
        margin: 0,
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#065f46',
    },
    streakText: {
        margin: Spacing.sm + ' 0 0 0',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#059669',
    },
    insightsLink: {
        textAlign: 'center',
        color: Colors.accent,
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        padding: '8px 0',
    },
    message: {
        marginTop: Spacing.md,
        padding: Spacing.sm,
        borderRadius: '6px',
        fontSize: '13px',
        textAlign: 'center',
        animation: 'fadeIn 0.2s ease',
    },
};
