import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { Colors, Spacing } from '../../../constants/theme.js';

export default function BotInsightsPage() {
    const { token } = useAuth();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const response = await fetch('/api/bot/insights', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setInsights(data);
        } catch (error) {
            console.error('Failed to fetch insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.container}>Loading your insights...</div>;
    }

    if (!insights || insights.totalResponses === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyState}>
                    <p>📊 No insights yet</p>
                    <p>Answer nightly questions to see your 30-day eco journey insights.</p>
                </div>
            </div>
        );
    }

    const { stats, insights: insightText, streak } = insights;
    const yesPercentage = stats.yesPercentage;
    const healthColor =
        yesPercentage >= 70 ? '#22c55e' : yesPercentage >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🌿 Your 30-Day Eco Journey</h1>
            </div>

            {/* Streak Card */}
            <div style={{ ...styles.card, borderLeft: `4px solid ${Colors.accent}` }}>
                <div style={styles.streakDisplay}>
                    <span style={styles.streakNumber}>{streak}</span>
                    <span style={styles.streakLabel}>Day Streak 🔥</span>
                </div>
            </div>

            {/* Overall Stats */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>✅</div>
                    <div style={styles.statValue}>{stats.yesCount}</div>
                    <div style={styles.statName}>Yes</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>❌</div>
                    <div style={styles.statValue}>{stats.noCount}</div>
                    <div style={styles.statName}>No</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>🤔</div>
                    <div style={styles.statValue}>{stats.hmmCount}</div>
                    <div style={styles.statName}>Hmm</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>📊</div>
                    <div style={styles.statValue}>{stats.totalResponses}</div>
                    <div style={styles.statName}>Total</div>
                </div>
            </div>

            {/* Yes Percentage Gauge */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Eco-Friendly Actions</h3>
                <div style={styles.gaugeContainer}>
                    <div style={styles.gaugeBar}>
                        <div
                            style={{
                                ...styles.gaugeFill,
                                width: `${yesPercentage}%`,
                                backgroundColor: healthColor,
                            }}
                        />
                    </div>
                    <div style={{ ...styles.gaugeLabel, color: healthColor }}>
                        {yesPercentage}% "Yes" responses
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Your Eco Categories</h3>
                <div style={styles.categoryGrid}>
                    {Object.entries(stats.categoryStats).map(([category, count]) => (
                        <div key={category} style={styles.categoryItem}>
                            <div style={styles.categoryName}>
                                {getCategoryEmoji(category)} {capitalizeFirst(category)}
                            </div>
                            <div style={styles.categoryCount}>{count} responses</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights Text */}
            <div style={{ ...styles.card, backgroundColor: '#f9fafb' }}>
                <h3 style={styles.cardTitle}>💡 Your Reflection</h3>
                <div style={styles.insightBox}>
                    {insightText.split('\n').map((line, idx) => (
                        <p key={idx} style={styles.insightLine}>
                            {line}
                        </p>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div style={styles.ctaBox}>
                <p>Keep building your streak! Continue answering daily for more insights.</p>
                <button
                    onClick={() => window.history.back()}
                    style={styles.backButton}
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}

function getCategoryEmoji(category) {
    const emojis = {
        food: '🍽️',
        water: '💧',
        transport: '🚗',
        waste: '♻️',
        nature: '🌱',
    };
    return emojis[category] || '📌';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    header: {
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: 0,
        color: Colors.text,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: '8px',
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    streakDisplay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    streakNumber: {
        fontSize: '48px',
        fontWeight: 'bold',
        color: Colors.accent,
    },
    streakLabel: {
        fontSize: '18px',
        color: Colors.text,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    statCard: {
        backgroundColor: Colors.surface,
        borderRadius: '8px',
        padding: Spacing.md,
        textAlign: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    statIcon: {
        fontSize: '24px',
        marginBottom: '8px',
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: Colors.text,
        margin: '4px 0',
    },
    statName: {
        fontSize: '12px',
        color: '#999',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0 0 ' + Spacing.md + ' 0',
        color: Colors.text,
    },
    gaugeContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.sm,
    },
    gaugeBar: {
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    gaugeFill: {
        height: '100%',
        transition: 'width 0.5s ease',
    },
    gaugeLabel: {
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    categoryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: Spacing.sm,
    },
    categoryItem: {
        backgroundColor: '#f9fafb',
        padding: Spacing.sm,
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
    },
    categoryName: {
        fontSize: '13px',
        fontWeight: '500',
        color: Colors.text,
        marginBottom: '4px',
    },
    categoryCount: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: Colors.accent,
    },
    insightBox: {
        lineHeight: '1.6',
        color: '#666',
    },
    insightLine: {
        margin: '6px 0',
        fontSize: '13px',
    },
    ctaBox: {
        textAlign: 'center',
        padding: Spacing.lg,
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #fcd34d',
    },
    backButton: {
        marginTop: Spacing.sm,
        padding: '8px 16px',
        backgroundColor: Colors.accent,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
    },
};
