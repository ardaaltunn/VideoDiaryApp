import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
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
        <View style={[styles.appBar, { backgroundColor: colors.background.primary }]}>
            <View style={styles.appBarContent}>
                <Pressable
                    onPress={onBack}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </Pressable>
                <Text
                    style={[styles.appBarTitle, { color: colors.text.primary }]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </View>
            {subtitle && (
                <Text
                    style={[styles.appBarSubtitle, { color: colors.text.secondary }]}
                    numberOfLines={1}
                >
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    appBar: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    appBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
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
        flex: 1,
    },
}); 