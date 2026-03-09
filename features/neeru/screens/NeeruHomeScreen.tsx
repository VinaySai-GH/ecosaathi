import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import { CITIES, DEFAULT_CITY } from '../data/cities';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type NeeruStackParamList = {
    NeeruHome: undefined;
    NeeruResult: { kl: number; cityLabel: string; month: number; year: number };
};

type Props = {
    navigation: NativeStackNavigationProp<NeeruStackParamList, 'NeeruHome'>;
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export default function NeeruHomeScreen({ navigation }: Props): React.JSX.Element {
    const now = new Date();
    const [kl, setKl] = useState('');
    const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY.label);
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
    const [selectedYear] = useState(now.getFullYear());
    const [cityDropOpen, setCityDropOpen] = useState(false);
    const [monthDropOpen, setMonthDropOpen] = useState(false);
    const [error, setError] = useState('');

    function handleCalculate(): void {
        const parsed = parseFloat(kl);
        if (!kl || isNaN(parsed) || parsed <= 0) {
            setError('Please enter a valid water usage amount.');
            return;
        }
        if (parsed > 500) {
            setError('That seems too high. Double-check your bill (max 500 KL).');
            return;
        }
        setError('');
        navigation.navigate('NeeruResult', {
            kl: parsed,
            cityLabel: selectedCity,
            month: selectedMonth + 1,
            year: selectedYear,
        });
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>NEERU</Text>
                    <Text style={styles.title}>How much water{'\n'}did you use?</Text>
                    <Text style={styles.subtitle}>
                        Enter your monthly household usage from your water bill.
                    </Text>
                </View>

                {/* KL Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Water used this month</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 8.5"
                            placeholderTextColor={Colors.textDim}
                            keyboardType="decimal-pad"
                            value={kl}
                            onChangeText={(v) => { setKl(v); setError(''); }}
                            autoFocus
                        />
                        <View style={styles.unitBadge}>
                            <Text style={styles.unitText}>KL</Text>
                        </View>
                    </View>
                    <Text style={styles.hint}>
                        1 KL = 1000 litres. Check your bill for "units consumed" or "kl used".
                    </Text>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                {/* Month picker */}
                <View style={styles.pickerSection}>
                    <Text style={styles.label}>Billing month</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => { setMonthDropOpen((o) => !o); setCityDropOpen(false); }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.dropdownValue}>{MONTHS[selectedMonth]}, {selectedYear}</Text>
                        <Text style={styles.dropdownChevron}>{monthDropOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {monthDropOpen && (
                        <View style={styles.dropList}>
                            {MONTHS.map((m, i) => (
                                <TouchableOpacity
                                    key={m}
                                    style={[styles.dropItem, i === selectedMonth && styles.dropItemActive]}
                                    onPress={() => { setSelectedMonth(i); setMonthDropOpen(false); }}
                                >
                                    <Text style={[styles.dropItemText, i === selectedMonth && styles.dropItemTextActive]}>
                                        {m}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* City picker */}
                <View style={styles.pickerSection}>
                    <Text style={styles.label}>Your city</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => { setCityDropOpen((o) => !o); setMonthDropOpen(false); }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.dropdownValue}>{selectedCity}</Text>
                        <Text style={styles.dropdownChevron}>{cityDropOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {cityDropOpen && (
                        <View style={styles.dropList}>
                            {CITIES.map((c) => (
                                <TouchableOpacity
                                    key={c.label}
                                    style={[styles.dropItem, c.label === selectedCity && styles.dropItemActive]}
                                    onPress={() => { setSelectedCity(c.label); setCityDropOpen(false); }}
                                >
                                    <Text style={[styles.dropItemText, c.label === selectedCity && styles.dropItemTextActive]}>
                                        {c.label}
                                        <Text style={styles.dropItemState}> · {c.state}</Text>
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Scan bill (placeholder) */}
                <TouchableOpacity style={styles.scanButton} activeOpacity={0.7}>
                    <Text style={styles.scanIcon}>📷</Text>
                    <Text style={styles.scanText}>Scan bill instead (coming soon)</Text>
                </TouchableOpacity>

                {/* CTA */}
                <TouchableOpacity onPress={handleCalculate} activeOpacity={0.85}>
                    <LinearGradient
                        colors={[Colors.accent, '#4ab860']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.cta}
                    >
                        <Text style={styles.ctaText}>See My Impact  →</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.bg },
    scroll: { flex: 1 },
    content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

    header: { marginBottom: Spacing.xl },
    eyebrow: {
        ...Typography.label,
        color: Colors.accent,
        letterSpacing: 3,
        marginBottom: Spacing.sm,
    },
    title: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.sm },
    subtitle: { ...Typography.body, color: Colors.textMuted },

    inputSection: { marginBottom: Spacing.lg },
    label: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm },
    inputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
    input: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Platform.OS === 'ios' ? 16 : 12,
        ...Typography.h2,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    unitBadge: {
        backgroundColor: Colors.accentDim,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    },
    unitText: { ...Typography.h3, color: Colors.accent },
    hint: { ...Typography.caption, color: Colors.textDim, marginTop: Spacing.xs },
    errorText: { ...Typography.caption, color: Colors.danger, marginTop: Spacing.xs },

    pickerSection: { marginBottom: Spacing.lg },
    dropdown: {
        backgroundColor: Colors.card,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    dropdownValue: { ...Typography.body, color: Colors.text },
    dropdownChevron: { color: Colors.textMuted, fontSize: 11 },
    dropList: {
        backgroundColor: Colors.card,
        borderRadius: Radius.md,
        marginTop: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    dropItem: { paddingHorizontal: Spacing.md, paddingVertical: 12 },
    dropItemActive: { backgroundColor: Colors.accentDim },
    dropItemText: { ...Typography.body, color: Colors.textMuted },
    dropItemTextActive: { color: Colors.accent, fontWeight: '600' },
    dropItemState: { ...Typography.caption, color: Colors.textDim },

    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        marginBottom: Spacing.lg,
    },
    scanIcon: { fontSize: 20 },
    scanText: { ...Typography.body, color: Colors.textMuted },

    cta: {
        borderRadius: Radius.full,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    ctaText: { ...Typography.h3, color: Colors.bg },
});
