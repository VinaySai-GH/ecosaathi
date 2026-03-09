import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';

import { Colors, Typography, Spacing } from '../../shared/constants/theme';
import NeeruHomeScreen from '../../features/neeru/screens/NeeruHomeScreen';
import NeeruResultScreen from '../../features/neeru/screens/NeeruResultScreen';
import type { NeeruStackParamList } from '../../features/neeru/screens/NeeruHomeScreen';

// ─── Neeru stack (Home → Result) ─────────────────────────────────────────────
const NeeruStack = createNativeStackNavigator<NeeruStackParamList>();

function NeeruNavigator(): React.JSX.Element {
    return (
        <NeeruStack.Navigator screenOptions={{ headerShown: false }}>
            <NeeruStack.Screen name="NeeruHome" component={NeeruHomeScreen} />
            <NeeruStack.Screen name="NeeruResult" component={NeeruResultScreen} />
        </NeeruStack.Navigator>
    );
}

// ─── Placeholder screens for tabs not yet built ───────────────────────────────
function ComingSoon({ title, icon }: { title: string; icon: string }): React.JSX.Element {
    return (
        <View style={ph.container}>
            <Text style={ph.icon}>{icon}</Text>
            <Text style={ph.title}>{title}</Text>
            <Text style={ph.sub}>Coming soon</Text>
        </View>
    );
}
const ph = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
    icon: { fontSize: 56, marginBottom: Spacing.md },
    title: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.xs },
    sub: { ...Typography.body, color: Colors.textMuted },
});

// ─── Tab icons ────────────────────────────────────────────────────────────────
type TabIconProps = { focused: boolean; emoji: string };
function TabIcon({ focused, emoji }: TabIconProps): React.JSX.Element {
    return (
        <View style={[tab.iconWrap, focused && tab.iconWrapActive]}>
            <Text style={tab.emoji}>{emoji}</Text>
        </View>
    );
}
const tab = StyleSheet.create({
    iconWrap: {
        width: 36, height: 36, borderRadius: 18,
        justifyContent: 'center', alignItems: 'center',
    },
    iconWrapActive: { backgroundColor: Colors.accentGlow },
    emoji: { fontSize: 20 },
});

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

export default function TabNavigator(): React.JSX.Element {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarActiveTintColor: Colors.accent,
                tabBarInactiveTintColor: Colors.textDim,
                tabBarLabelStyle: { ...Typography.caption, marginTop: 2 },
            }}
        >
            <Tab.Screen
                name="Neeru"
                component={NeeruNavigator}
                options={{
                    tabBarLabel: 'Neeru',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="💧" />,
                }}
            />
            <Tab.Screen
                name="GreenSpot"
                children={() => <ComingSoon title="Green Spot" icon="🗺️" />}
                options={{
                    tabBarLabel: 'Green Spot',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🗺️" />,
                }}
            />
            <Tab.Screen
                name="RaatKaHisaab"
                children={() => <ComingSoon title="Raat Ka Hisaab" icon="🌙" />}
                options={{
                    tabBarLabel: 'Raat Ka Hisaab',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🌙" />,
                }}
            />
            <Tab.Screen
                name="EcoPulse"
                children={() => <ComingSoon title="Eco Pulse" icon="🏆" />}
                options={{
                    tabBarLabel: 'Eco Pulse',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏆" />,
                }}
            />
        </Tab.Navigator>
    );
}
