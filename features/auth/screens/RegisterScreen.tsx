import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import { useAuth } from '../../../shared/context/AuthContext';
import { registerUser } from '../auth.service';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any, any>;
};

export default function RegisterScreen({ navigation }: Props): React.JSX.Element {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();

    const handleRegister = async () => {
        if (!name.trim()) return Alert.alert('Invalid Name', 'Please enter your name.');
        if (!phone || phone.length !== 10) return Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
        if (!password || password.length < 6) return Alert.alert('Weak Password', 'Password must be at least 6 characters.');

        setIsSubmitting(true);
        try {
            const userData = await registerUser(name, phone, password);
            await signIn(userData);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'Could not register.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.brandIcon}>🌱</Text>
                    <Text style={styles.title}>Join EcoSaathi</Text>
                    <Text style={styles.subtitle}>Create an account to start tracking</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        placeholderTextColor={Colors.textDim}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10-digit mobile number"
                        placeholderTextColor={Colors.textDim}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a strong password"
                        placeholderTextColor={Colors.textDim}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        style={[styles.btn, isSubmitting && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        {isSubmitting ? <ActivityIndicator color={Colors.bg} /> : <Text style={styles.btnText}>Register</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
                        <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.bg },
    container: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
    header: { alignItems: 'center', marginBottom: Spacing.xl },
    brandIcon: { fontSize: 48, marginBottom: Spacing.md },
    title: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.xs },
    subtitle: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
    form: { backgroundColor: Colors.surface, padding: Spacing.xl, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
    label: { ...Typography.label, color: Colors.text, marginBottom: Spacing.sm },
    input: { backgroundColor: Colors.card, color: Colors.text, ...Typography.body, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
    btn: { backgroundColor: Colors.accent, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginTop: Spacing.md },
    btnDisabled: { opacity: 0.7 },
    btnText: { ...Typography.h3, color: Colors.bg },
    linkWrap: { marginTop: Spacing.xl, alignItems: 'center' },
    linkText: { ...Typography.body, color: Colors.textMuted },
    linkHighlight: { color: Colors.accent, fontWeight: '600' }
});
