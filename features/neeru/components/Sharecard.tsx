import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import type { Equivalency } from '../data/equivalencies';

type Props = {
    kl: number;
    cityLabel: string;
    month: number;
    year: number;
    equivalency: Equivalency;
    benchmarkKl: number;
    status: 'under' | 'over' | 'at';
};

export default function ShareCard({ kl, cityLabel, month, year, equivalency, benchmarkKl, status }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>My EcoSaathi Water Report</Text>
            <Text style={styles.subtitle}>{month}/{year} • {cityLabel}</Text>

            <View style={styles.usageContainer}>
                <Text style={styles.klText}>{kl} KL</Text>
                <Text style={styles.label}>Total Used</Text>
            </View>

            <View style={styles.eqContainer}>
                <Text style={styles.eqIcon}>{equivalency ? equivalency.icon : '💧'}</Text>
                <Text style={styles.equivalencyText}>
                    That's equivalent to {equivalency ? equivalency.title : 'a lot of water'}!
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.bg,
        padding: Spacing.xxl,
        borderRadius: Radius.xl,
        width: 1080, // High res for sharing
        height: 1080,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { fontSize: 48, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
    subtitle: { fontSize: 32, color: Colors.textMuted, marginBottom: 80 },

    usageContainer: {
        backgroundColor: Colors.surface,
        padding: 60,
        borderRadius: Radius.xl,
        marginBottom: 80,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.border
    },
    klText: { fontSize: 120, fontWeight: '900', color: Colors.accent, marginBottom: Spacing.sm },
    label: { fontSize: 24, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 2 },

    eqContainer: { alignItems: 'center', paddingHorizontal: 40 },
    eqIcon: { fontSize: 80, marginBottom: Spacing.md },
    equivalencyText: { fontSize: 36, color: Colors.textDim, textAlign: 'center', lineHeight: 48 },
});
