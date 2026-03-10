import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import type { Equivalency } from '../data/equivalencies';

interface ShareCardProps {
    kl: number;
    cityLabel: string;
    month: number;
    year: number;
    equivalency: Equivalency;
    benchmarkKl: number;
    status: 'under' | 'over' | 'at';
}

const MONTH_NAMES = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export default function ShareCard({
    kl,
    cityLabel,
    month,
    year,
    equivalency,
    benchmarkKl,
    status,
}: ShareCardProps): React.JSX.Element {
    const isOver = status === 'over';
    const diff = Math.abs(kl - benchmarkKl).toFixed(1);
    const statusLine = isOver
        ? `⚠️ ${diff} KL above ${cityLabel}'s guideline`
        : `✅ ${diff} KL under ${cityLabel}'s guideline`;

    return (
        <View style={styles.card}>
            <LinearGradient
                colors={['#0f3b22', '#0a1f14', '#122d1e']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Brand header */}
                <View style={styles.brandRow}>
                    <Text style={styles.brandIcon}>🌿</Text>
                    <Text style={styles.brandName}>EcoSaathi</Text>
                    <Text style={styles.brandTag}>NEERU</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Month + City */}
                <Text style={styles.meta}>
                    {MONTH_NAMES[month]} {year} · {cityLabel}
                </Text>

                {/* Big KL number */}
                <View style={styles.klRow}>
                    <Text style={[styles.klNumber, { color: isOver ? Colors.danger : Colors.accent }]}>
                        {kl}
                    </Text>
                    <Text style={styles.klUnit}> KL</Text>
                </View>
                <Text style={styles.klLabel}>water used this month</Text>

                {/* Equivalency */}
                <View style={styles.eqCard}>
                    <Text style={styles.eqIcon}>{equivalency.icon}</Text>
                    <Text style={styles.eqText}>{equivalency.compute(kl)}</Text>
                </View>

                {/* Benchmark status */}
                <View
                    style={[
                        styles.statusPill,
                        { backgroundColor: isOver ? Colors.dangerDim : Colors.successDim },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: isOver ? Colors.danger : Colors.accent },
                        ]}
                    >
                        {statusLine}
                    </Text>
                </View>

                {/* CTA */}
                <Text style={styles.cta}>Track your water impact → EcoSaathi</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 360,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    gradient: {
        padding: Spacing.xl,
    },

    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    brandIcon: { fontSize: 22 },
    brandName: {
        ...Typography.h3,
        color: Colors.text,
        flex: 1,
    },
    brandTag: {
        ...Typography.label,
        color: Colors.accent,
        letterSpacing: 3,
    },

    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.md,
    },

    meta: {
        ...Typography.label,
        color: Colors.textMuted,
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },

    klRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: Spacing.xs,
    },
    klNumber: {
        fontSize: 56,
        fontWeight: '800',
        letterSpacing: -2,
        lineHeight: 60,
    },
    klUnit: {
        ...Typography.h2,
        color: Colors.textMuted,
        marginBottom: 6,
    },
    klLabel: {
        ...Typography.body,
        color: Colors.textDim,
        marginBottom: Spacing.lg,
    },

    eqCard: {
        backgroundColor: Colors.card,
        borderRadius: Radius.md,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    eqIcon: { fontSize: 24 },
    eqText: {
        ...Typography.body,
        color: Colors.text,
        flex: 1,
    },

    statusPill: {
        alignSelf: 'flex-start',
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    statusText: {
        ...Typography.label,
    },

    cta: {
        ...Typography.caption,
        color: Colors.textDim,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});
