/**
 * VideoDiaryApp Ana Bileşeni
 * Yazan: Arda Altun
 * Tarih: 17/03/2025
 * Bu uygulama, kullanıcıların günlük videolar kaydetmesine,
 * düzenlemesine ve görüntülemesine olanak tanır.
 */

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@theme/ThemeProvider';
import { TabNavigator } from '@navigation/TabNavigator';
import { initDatabase } from '@app/backend/db/database';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    init();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <ThemeProvider>
              <TabNavigator />
            </ThemeProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
