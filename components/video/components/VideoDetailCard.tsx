import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../shared/Card';
import { useTheme } from '../../../theme/ThemeProvider';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface VideoDetailCardProps {
    title: string;
    description: string;
    duration: number;
    date?: string;
}

export function VideoDetailCard({ title, description, duration, date = 'Bugün' }: VideoDetailCardProps) {
    const { colors } = useTheme();

    const formatTime = (timeInMillis: number) => {
        const totalSeconds = Math.floor(timeInMillis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Animated.View entering={FadeInDown.delay(200).springify()}>
            {/* @ts-ignore - Missing children prop issue */}
            <Card style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {title}
                    </Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                            <Text style={[styles.statText, { color: colors.text.secondary }]}>
                                {formatTime(duration)}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                            <Text style={[styles.statText, { color: colors.text.secondary }]}>
                                {date}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.description, { color: colors.text.secondary }]}>
                    {description}
                </Text>
            </Card>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    infoCard: {
        padding: 20,
        marginTop: 16,
    },
    titleContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontWeight: '500',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.9,
    },
}); 