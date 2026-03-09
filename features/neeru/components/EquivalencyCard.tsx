import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import type { Equivalency } from '../data/equivalencies';

interface Props {
    equivalency: Equivalency;
    kl: number;
    index: number; // staggered animation delay
}

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width - Spacing.md * 2;

export default function EquivalencyCard({ equivalency, kl, index }: Props): React.JSX.Element {
    const translateY = useRef(new Animated.Value(40)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                delay: index * 150,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }),
        ]).start();
    }, [index, opacity, translateY]);

    const headline = equivalency.compute(kl);

    return (
        <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY }] }]}>
            <LinearGradient
                colors={['#1a4a30', '#0f2d1e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {/* Icon bubble */}
                <View style={styles.iconBubble}>
                    <Text style={styles.icon}>{equivalency.icon}</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>{equivalency.title}</Text>

                {/* Big bold equivalency */}
                <Text style={styles.headline}>{headline}</Text>

                {/* Subtitle context */}
                <Text style={styles.subtitle}>{equivalency.subtitle}</Text>

                {/* Source tag */}
                <View style={styles.sourceTag}>
                    <Text style={styles.sourceText}>Source: {equivalency.source}</Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: CARD_WIDTH,
        marginBottom: Spacing.md,
    },
    card: {
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconBubble: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.accentGlow,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    icon: {
        fontSize: 26,
    },
    title: {
        ...Typography.label,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: Spacing.xs,
    },
    headline: {
        ...Typography.h2,
        color: Colors.accent,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    sourceTag: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.accentGlow,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radius.full,
    },
    sourceText: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
});
