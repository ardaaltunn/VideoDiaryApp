import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../../theme/ThemeProvider';

interface VideoControlsProps {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    onPlayPause: () => void;
}

export function VideoControls({ isPlaying, currentTime, duration, onPlayPause }: VideoControlsProps) {
    const { colors } = useTheme();

    const formatTime = (timeInMillis: number) => {
        const totalSeconds = Math.floor(timeInMillis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <BlurView intensity={30} style={styles.controlsContainer}>
            <Pressable onPress={onPlayPause} style={styles.playButton}>
                <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={28}
                    color="white"
                />
            </Pressable>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progress,
                            {
                                width: `${(currentTime / duration) * 100}%`,
                                backgroundColor: colors.primary,
                            },
                        ]}
                    />
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        flex: 1,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: 2,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
}); 