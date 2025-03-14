import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { colors, isDark } = useTheme();

  return (
    <>
      {/* Status Bar Rengini Güncelle */}
      <StatusBar
        backgroundColor={colors.background.primary} // Android için arka plan rengi
        barStyle={isDark ? 'light-content' : 'dark-content'} // iOS için içerik rengi
      />

      <SafeAreaView
        style={[styles.headerContainer, { backgroundColor: colors.background.primary }]}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    // StatusBar ile arka plan rengi aynı olacak
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});
