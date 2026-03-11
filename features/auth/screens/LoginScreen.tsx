import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../../../shared/constants/theme';
import { useAuth } from '../../../shared/context/AuthContext';
import { loginUser } from '../auth.service';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any, any>;
};

export default function LoginScreen({ navigation }: Props): React.JSX.Element {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!phone || phone.length !== 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
            return;
        }
        if (!password) {
            Alert.alert('Missing Password', 'Please enter your password.');
            return;
        }

        setIsSubmitting(true);
        try {
            const userData = await loginUser(phone, password);
            await signIn(userData);
            // After signIn, AuthContext state changes and App.tsx handles routing to TabNavigator
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Could not log in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.brandIcon}>🌿</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Enter your phone number to access EcoSaathi</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10-digit mobile number"
                        placeholderTextColor={Colors.textDim}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                        autoFocus
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor={Colors.textDim}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        style={[styles.btn, isSubmitting && styles.btnDisabled]}
                        onPress={handleLogin}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={Colors.bg} />
                        ) : (
                            <Text style={styles.btnText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
                        <Text style={styles.linkText}>New here? <Text style={styles.linkHighlight}>Register instead</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.bg },
    container: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
    header: { alignItems: 'center', marginBottom: Spacing.xxl },
    brandIcon: { fontSize: 48, marginBottom: Spacing.md },
    title: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.xs },
    subtitle: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
    form: { backgroundColor: Colors.surface, padding: Spacing.xl, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
    label: { ...Typography.label, color: Colors.text, marginBottom: Spacing.sm },
    input: { backgroundColor: Colors.card, color: Colors.text, ...Typography.body, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
    btn: { backgroundColor: Colors.accent, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center' },
    btnDisabled: { opacity: 0.7 },
    btnText: { ...Typography.h3, color: Colors.bg },
    linkWrap: { marginTop: Spacing.xl, alignItems: 'center' },
    linkText: { ...Typography.body, color: Colors.textMuted },
    linkHighlight: { color: Colors.accent, fontWeight: '600' }
});
