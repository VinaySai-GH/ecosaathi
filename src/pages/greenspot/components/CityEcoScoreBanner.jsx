import React, { useState, useEffect } from 'react';
import { Colors, Spacing } from '../../../constants/theme.js';

export default function CityEcoScoreBanner() {
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEcoScore();
    }, []);

    const fetchEcoScore = async () => {
        try {
            const response = await fetch('/api/spots/stats/eco-score?city=Tirupati');
            const data = await response.json();
            setScore(data);
        } catch (error) {
            console.error('Failed to fetch eco score:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.banner}>
                <p>Loading Tirupati Eco Score...</p>
            </div>
        );
    }

    if (!score) {
        return null;
    }

    const scoreColor =
        score.ecoScore >= 70 ? '#22c55e' : score.ecoScore >= 40 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{ ...styles.banner, borderLeftColor: scoreColor }}>
            <div style={styles.scoreContainer}>
                <div style={{ ...styles.scoreNumber, color: scoreColor }}>
                    {score.ecoScore}
                    <span style={styles.scoreMax}>/100</span>
                </div>
                <div style={styles.scoreLabel}>Tirupati Eco Score</div>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.stat}>
                    <div style={styles.statNumber}>📍 {score.totalSpots}</div>
                    <div style={styles.statLabel}>Total Spots</div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statNumber}>✅ {score.verifiedSpots}</div>
                    <div style={styles.statLabel}>Verified</div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statNumber}>👥 {score.activeContributors}</div>
                    <div style={styles.statLabel}>Contributors</div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statNumber}>🔍 {score.totalVerifications}</div>
                    <div style={styles.statLabel}>Verifications</div>
                </div>
            </div>

            <div style={styles.progressBar}>
                <div
                    style={{
                        ...styles.progressFill,
                        width: `${score.ecoScore}%`,
                        backgroundColor: scoreColor,
                    }}
                />
            </div>

            <div style={styles.message}>
                {score.ecoScore >= 70 && '🌟 Excellent! Tirupati is leading green sustainability.'}
                {score.ecoScore >= 40 && score.ecoScore < 70 && '🌱 Good progress! Let\'s add more eco-friendly spots.'}
                {score.ecoScore < 40 && '⚠️ Just starting! Help grow the Green Spot community.'}
            </div>
        </div>
    );
}

const styles = {
    banner: {
        backgroundColor: Colors.background,
        borderLeft: `4px solid ${Colors.accent}`,
        borderRadius: '8px',
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    scoreContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.md,
    },
    scoreNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px',
    },
    scoreMax: {
        fontSize: '18px',
        fontWeight: 'normal',
        color: '#999',
    },
    scoreLabel: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: Colors.text,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    stat: {
        textAlign: 'center',
        padding: Spacing.sm,
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
    },
    statNumber: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '12px',
        color: '#999',
    },
    progressBar: {
        height: '6px',
        backgroundColor: '#e5e7eb',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    progressFill: {
        height: '100%',
        transition: 'width 0.3s ease',
    },
    message: {
        fontSize: '13px',
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
    },
};
