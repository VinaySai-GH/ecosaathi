import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import type { Tip } from '../data/tips';

interface Props {
    tip: Tip;
    index: number;
}

export default function TipCard({ tip, index }: Props): React.JSX.Element {
    return (
        <View style={styles.card}>
            <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}>{tip.icon}</Text>
            </View>
            <Text style={styles.text}>{tip.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    indexBadge: {
        width: 20,
        height: 20,
        borderRadius: Radius.full,
        backgroundColor: Colors.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        flexShrink: 0,
    },
    indexText: {
        ...Typography.caption,
        color: Colors.accent,
        fontWeight: '700',
    },
    iconCircle: {
        flexShrink: 0,
        marginTop: 1,
    },
    icon: {
        fontSize: 20,
    },
    text: {
        ...Typography.body,
        color: Colors.textMuted,
        flex: 1,
    },
});
