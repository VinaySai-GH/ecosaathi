import React, { useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Animated,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import EquivalencyCard from '../components/EquivalencyCard';
import BenchmarkBar from '../components/BenchmarkBar';
import TipCard from '../components/TipCard';
import ShareCard from '../components/ShareCard';
import { pickEquivalencies } from '../data/equivalencies';
import { findCity, getBenchmarkStatus } from '../data/cities';
import { pickTips } from '../data/tips';
import { submitWaterLog } from '../neeru.service';
import type { NeeruStackParamList } from './NeeruHomeScreen';

const MONTH_NAMES = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

type Props = {
    navigation: NativeStackNavigationProp<NeeruStackParamList, 'NeeruResult'>;
    route: RouteProp<NeeruStackParamList, 'NeeruResult'>;
};

export default function NeeruResultScreen({ navigation, route }: Props): React.JSX.Element {
    const { kl, cityLabel, month, year } = route.params;
    const city = findCity(cityLabel);
    const status = getBenchmarkStatus(kl, city);
    const equivalencies = pickEquivalencies(kl);
    const tips = pickTips(status, city.isWaterStressed);

    const [isSaving, setIsSaving] = React.useState(false);
    const [isSaved, setIsSaved] = React.useState(false);

    const shareRef = useRef<ViewShot>(null);
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerTranslate = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(headerTranslate, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        ]).start();
    }, [headerOpacity, headerTranslate]);

    const isOver = status === 'over';
    const statusEmoji = isOver ? '⚠️' : '✅';
    const statusMsg = isOver
        ? `You used ${(kl - city.benchmark_kl).toFixed(1)} KL more than ${cityLabel}'s guideline`
        : `You're ${(city.benchmark_kl - kl).toFixed(1)} KL under ${cityLabel}'s guideline`;

    const handleShare = useCallback(async () => {
        try {
            const uri = await captureRef(shareRef, {
                format: 'png',
                quality: 1,
            });
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Sharing not available', 'Sharing is not supported on this device.');
                return;
            }
            await Sharing.shareAsync(uri, {
                mimeType: 'image/png',
                dialogTitle: 'Share your Water Report',
            });
        } catch (err: unknown) {
            Alert.alert('Oops', 'Could not share your report. Try again.');
        }
    }, [kl, cityLabel, month, year, status]);

    const handleSave = useCallback(async (overwrite = false) => {
        setIsSaving(true);
        try {
            await submitWaterLog(kl, month, year, cityLabel, overwrite);
            setIsSaved(true);
        } catch (error: any) {
            // Check if backend returned our 409 Conflict flag telling us data exists
            if (error.status === 409 && error.data?.exists) {
                Alert.alert(
                    'Record Exists',
                    `You already logged ${error.data.existingKl} KL for ${MONTH_NAMES[month - 1]} ${year}. Do you want to overwrite it with ${kl} KL?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Overwrite',
                            style: 'destructive',
                            onPress: () => handleSave(true)
                        }
                    ]
                );
            } else {
                Alert.alert('Save Failed', error.message || 'Could not save water log');
            }
        } finally {
            setIsSaving(false);
        }
    }, [kl, month, year, cityLabel]);
    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

            {/* Top bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.topTitle}>Your Impact</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Hero header */}
                <Animated.View
                    style={[
                        styles.hero,
                        { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
                    ]}
                >
                    <LinearGradient
                        colors={isOver ? ['#3b1a1a', '#0a1f14'] : ['#0f3b22', '#0a1f14']}
                        style={styles.heroGrad}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.heroMonth}>{MONTH_NAMES[month]} {year}</Text>
                        <View style={styles.heroRow}>
                            <Text style={[styles.heroKl, { color: isOver ? Colors.danger : Colors.accent }]}>
                                {kl}
                            </Text>
                            <Text style={styles.heroUnit}> KL</Text>
                        </View>
                        <Text style={styles.heroCity}>{cityLabel}</Text>

                        <View
                            style={[
                                styles.statusPill,
                                { backgroundColor: isOver ? Colors.dangerDim : Colors.successDim },
                            ]}
                        >
                            <Text style={[styles.statusPillText, { color: isOver ? Colors.danger : Colors.accent }]}>
                                {statusEmoji} {statusMsg}
                            </Text>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Equivalencies */}
                <Text style={styles.sectionHeading}>What does this actually mean?</Text>
                {equivalencies.map((eq, i) => (
                    <EquivalencyCard key={eq.id} equivalency={eq} kl={kl} index={i} />
                ))}

                {/* City benchmark */}
                <Text style={styles.sectionHeading}>vs. {cityLabel}</Text>
                <BenchmarkBar kl={kl} city={city} />

                {/* Tips */}
                <Text style={styles.sectionHeading}>
                    {isOver ? '3 ways to reduce' : '3 tips to keep it up'}
                </Text>
                {tips.map((tip, i) => (
                    <TipCard key={tip.id} tip={tip} index={i} />
                ))}

                {/* Save to Trend CTA */}
                <TouchableOpacity
                    style={[styles.saveBtn, isSaved && styles.saveBtnSuccess]}
                    activeOpacity={0.8}
                    onPress={() => handleSave(false)}
                    disabled={isSaving || isSaved}
                >
                    <Text style={styles.saveBtnText}>
                        {isSaving ? 'Saving...' : isSaved ? '✅ Saved to your trend' : '💾 Save to my Monthly Trend'}
                    </Text>
                </TouchableOpacity>
                {/* Share button */}
                <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8} onPress={handleShare}>
                    <LinearGradient
                        colors={[Colors.accent, '#4ab860']}
                        style={styles.shareBtnInner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.shareBtnIcon}>📤</Text>
                        <View>
                            <Text style={[styles.shareBtnTitle, { color: Colors.bg }]}>Share My Water Report</Text>
                            <Text style={[styles.shareBtnSub, { color: Colors.bg, opacity: 0.7 }]}>WhatsApp, Instagram & more</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>

            {/* Hidden card for capture — positioned off-screen */}
            <ViewShot ref={shareRef} options={{ format: 'png', quality: 1 }} style={styles.hiddenCard}>
                <ShareCard
                    kl={kl}
                    cityLabel={cityLabel}
                    month={month}
                    year={year}
                    equivalency={equivalencies[0]!}
                    benchmarkKl={city.benchmark_kl}
                    status={status}
                />
            </ViewShot>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.bg },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: { padding: Spacing.xs },
    backText: { ...Typography.body, color: Colors.accent },
    topTitle: { ...Typography.h3, color: Colors.text },

    content: { padding: Spacing.lg },

    hero: { marginBottom: Spacing.xl },
    heroGrad: {
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    heroMonth: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: Spacing.sm },
    heroRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.xs },
    heroKl: { fontSize: 72, fontWeight: '800', letterSpacing: -2, lineHeight: 76 },
    heroUnit: { ...Typography.h2, color: Colors.textMuted, marginBottom: 10 },
    heroCity: { ...Typography.body, color: Colors.textMuted, marginBottom: Spacing.lg },
    statusPill: {
        alignSelf: 'flex-start',
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    statusPillText: { ...Typography.label },

    sectionHeading: {
        ...Typography.caption,
        color: Colors.textDim,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },

    saveBtn: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        alignItems: 'center',
        marginTop: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    saveBtnSuccess: {
        backgroundColor: Colors.successDim,
        borderColor: Colors.success,
    },
    saveBtnText: {
        ...Typography.h3,
        color: Colors.text,
    },

    shareBtn: {
        marginTop: Spacing.lg,
        borderRadius: Radius.lg,
        overflow: 'hidden',
    },
    shareBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        padding: Spacing.lg,
    },
    shareBtnIcon: { fontSize: 28 },
    shareBtnTitle: { ...Typography.h3, color: Colors.text },
    shareBtnSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

    hiddenCard: {
        position: 'absolute',
        left: -9999,
        top: 0,
    },
});
