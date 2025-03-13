import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                {title}
            </Text>
            {subtitle && (
                <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 8 : 16,
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