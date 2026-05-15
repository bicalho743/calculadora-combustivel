// App.tsx
import React from 'react';
import { Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { CalculadoraScreen } from './src/screens/CalculadoraScreen';
import { ViagemScreen }      from './src/screens/ViagemScreen';
import { VeiculosScreen }    from './src/screens/VeiculosScreen';
import { SobreScreen }       from './src/screens/SobreScreen';
import { colors }            from './src/theme';

const Tab = createBottomTabNavigator();

function Icon({ label, color }: { label: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{label}</Text>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary:      colors.green,
            background:   colors.bg,
            card:         colors.bg,
            text:         colors.textPrimary,
            border:       colors.border,
            notification: colors.green,
          },
        }}
      >
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bg,
              borderTopColor:  colors.border,
              borderTopWidth:  0.5,
              height: Platform.OS === 'ios' ? 82 : 58,
              paddingBottom: Platform.OS === 'ios' ? 24 : 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor:   colors.green,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
          }}
        >
          <Tab.Screen name="Calcular" component={CalculadoraScreen}
            options={{ tabBarIcon: ({ color }) => <Icon label="⛽" color={color} /> }} />
          <Tab.Screen name="Viagem"   component={ViagemScreen}
            options={{ tabBarIcon: ({ color }) => <Icon label="🗺️" color={color} /> }} />
          <Tab.Screen name="Veículos" component={VeiculosScreen}
            options={{ tabBarIcon: ({ color }) => <Icon label="🚗" color={color} /> }} />
          <Tab.Screen name="Sobre"    component={SobreScreen}
            options={{ tabBarIcon: ({ color }) => <Icon label="ℹ️" color={color} /> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
