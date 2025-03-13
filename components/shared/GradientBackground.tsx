import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';

interface GradientBackgroundProps {
    children: React.ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
    const { colors, isDark } = useTheme();

    const gradientColors = isDark
        ? [
            colors.background.primary,
            colors.background.secondary,
            colors.background.primary,
        ]
        : [
            'rgba(255,255,255,0.8)',
            'rgba(240,240,250,1)',
            'rgba(255,255,255,0.9)',
        ];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={gradientColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
}); 