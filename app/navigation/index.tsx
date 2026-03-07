import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder navigation shell
// Replace with React Navigation stack once screens are built

export default function Navigation(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>EcoSaathi</Text>
            <Text style={styles.sub}>Navigation coming soon…</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a2e1a' },
    text: { fontSize: 28, fontWeight: 'bold', color: '#4caf7d' },
    sub: { fontSize: 14, color: '#aaa', marginTop: 8 },
});
