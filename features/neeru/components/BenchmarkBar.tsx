import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import type { CityBenchmark } from '../data/cities';

interface Props {
    kl: number;
    city: CityBenchmark;
}

export default function BenchmarkBar({ kl, city }: Props): React.JSX.Element {
    const barAnim = useRef(new Animated.Value(0)).current;
    const isOver = kl > city.benchmark_kl;
    const isAt = kl === city.benchmark_kl;

    const userPct = Math.min((kl / (city.benchmark_kl * 2)) * 100, 100);
    const benchPct = 50; // benchmark always at 50% of track

    const statusColor = isOver ? Colors.danger : Colors.accent;
    const statusLabel = isOver ? 'Above recommended' : isAt ? 'Right at limit' : 'Under recommended ✓';
    const diffKl = Math.abs(kl - city.benchmark_kl).toFixed(1);
    const diffMsg = isOver
        ? `${diffKl} KL over ${city.label}'s monthly guideline`
        : isAt
            ? `Exactly at ${city.label}'s monthly guideline`
            : `${diffKl} KL under ${city.label}'s monthly guideline`;

    useEffect(() => {
        Animated.timing(barAnim, {
            toValue: 1,
            duration: 800,
            delay: 300,
            useNativeDriver: false,
        }).start();
    }, [barAnim]);

    const barWidth = barAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', `${userPct}%`],
    });

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionLabel}>City Benchmark</Text>

            {/* Numbers row */}
            <View style={styles.numbersRow}>
                <View>
                    <Text style={styles.numLabel}>You used</Text>
                    <Text style={[styles.numValue, { color: statusColor }]}>{kl} KL</Text>
                </View>
                <View style={styles.divider} />
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.numLabel}>{city.label} guideline</Text>
                    <Text style={styles.numValue}>{city.benchmark_kl} KL</Text>
                </View>
            </View>

            {/* Track */}
            <View style={styles.track}>
                <Animated.View
                    style={[styles.fill, { width: barWidth, backgroundColor: statusColor }]}
                />
                {/* Benchmark marker */}
                <View style={[styles.marker, { left: `${benchPct}%` as unknown as number }]}>
                    <View style={styles.markerLine} />
                    <Text style={styles.markerLabel}>guideline</Text>
                </View>
            </View>

            {/* Status pill */}
            <View
                style={[
                    styles.pill,
                    { backgroundColor: isOver ? Colors.dangerDim : Colors.successDim },
                ]}
            >
                <Text style={[styles.pillText, { color: statusColor }]}>
                    {statusLabel} — {diffMsg}
                </Text>
            </View>

            {city.isWaterStressed && (
                <Text style={styles.stressNote}>
                    ⚠️ {city.label} is a water-stressed city. Every litre matters.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.card,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    sectionLabel: {
        ...Typography.label,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: Spacing.md,
    },
    numbersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    divider: {
        width: 1,
        height: 36,
        backgroundColor: Colors.border,
    },
    numLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 2,
    },
    numValue: {
        ...Typography.h2,
        color: Colors.text,
    },
    track: {
        height: 10,
        backgroundColor: Colors.surface,
        borderRadius: Radius.full,
        marginBottom: Spacing.md,
        overflow: 'visible',
        position: 'relative',
    },
    fill: {
        height: '100%',
        borderRadius: Radius.full,
    },
    marker: {
        position: 'absolute',
        top: -4,
        alignItems: 'center',
    },
    markerLine: {
        width: 2,
        height: 18,
        backgroundColor: Colors.textMuted,
        borderRadius: 1,
    },
    markerLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    pill: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        alignSelf: 'flex-start',
        marginBottom: Spacing.sm,
    },
    pillText: {
        ...Typography.label,
    },
    stressNote: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: Spacing.xs,
    },
});
