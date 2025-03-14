import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';

interface VideoAppBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function VideoAppBar({ title, subtitle, onBack }: VideoAppBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.appBarContainer, { backgroundColor: colors.background.primary }]}>
      <View style={styles.appBarContent}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.appBarTitle, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      </View>
  );
}

const styles = StyleSheet.create({
  appBarContainer: {
    // AppBar height
    paddingTop: 8,
    paddingBottom: 8,
    // backgroundColor set by parent
  },
  appBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  appBarSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
