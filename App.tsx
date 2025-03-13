import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './theme/ThemeProvider';
import { TabNavigator } from './navigation/TabNavigator';

/**
 * Video Günlüğüm Uygulaması Ana Bileşeni
 * 
 * Bu uygulama, kullanıcıların günlük videolar kaydetmesine,
 * düzenlemesine ve görüntülemesine olanak tanır.
 */
export default function App() {
  // Navigasyon temasını ayarlama
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
    },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* @ts-ignore - Missing children prop issue */}
        <ThemeProvider>
          {/* @ts-ignore - Missing children prop issue */}
          <NavigationContainer theme={theme}>
            <TabNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
