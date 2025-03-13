import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { Video } from 'expo-av';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface VideoCropperProps {
    videoUri: string;
    onCropComplete: (startTime: number, endTime: number) => void;
}

const SCRUBBER_WIDTH = 8;
const CROP_DURATION = 5; // 5 seconds

export function VideoCropper({ videoUri, onCropComplete }: VideoCropperProps) {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const videoRef = useRef<Video>(null);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startPosition = useSharedValue(0);
    const currentPosition = useSharedValue(0);
    const scrubberWidth = width - 48;

    const handlePlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis / 1000);
        }
    };

    const togglePlayPause = async () => {
        if (videoRef.current) {
            if (isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                await videoRef.current.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            const newPosition = startPosition.value + e.translationX;
            const maxPosition = scrubberWidth - SCRUBBER_WIDTH;
            currentPosition.value = Math.max(0, Math.min(newPosition, maxPosition));
        })
        .onEnd(() => {
            startPosition.value = currentPosition.value;
            const time = (currentPosition.value / scrubberWidth) * duration;
            if (videoRef.current) {
                videoRef.current.setPositionAsync(time * 1000);
            }
        });

    const scrubberStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: currentPosition.value }],
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: currentPosition.value + SCRUBBER_WIDTH,
    }));

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode="contain"
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                isLooping
            />

            <View style={styles.controls}>
                <Pressable
                    onPress={togglePlayPause}
                    style={[styles.playButton, { backgroundColor: colors.primary }]}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={24}
                        color="white"
                    />
                </Pressable>

                <View style={styles.scrubberContainer}>
                    <View
                        style={[
                            styles.timeline,
                            { backgroundColor: colors.border.light }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.progress,
                            { backgroundColor: colors.primary },
                            progressStyle,
                        ]}
                    />
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            style={[
                                styles.scrubber,
                                { backgroundColor: colors.primary },
                                scrubberStyle,
                            ]}
                        >
                            <View style={styles.scrubberHandle} />
                        </Animated.View>
                    </GestureDetector>
                </View>

                <Text style={[styles.timeText, { color: colors.text.primary }]}>
                    {Math.floor((currentPosition.value / scrubberWidth) * duration)}s
                </Text>
            </View>

            <Pressable
                style={[styles.cropButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                    const startTime = (currentPosition.value / scrubberWidth) * duration;
                    onCropComplete(startTime, startTime + CROP_DURATION);
                }}
            >
                <Text style={styles.cropButtonText}>5 Saniyelik Kesit Al</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    video: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 16,
        marginBottom: 24,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    scrubberContainer: {
        flex: 1,
        height: 48,
        justifyContent: 'center',
    },
    timeline: {
        height: 4,
        borderRadius: 2,
        width: '100%',
    },
    progress: {
        height: 4,
        borderRadius: 2,
        position: 'absolute',
    },
    scrubber: {
        width: SCRUBBER_WIDTH,
        height: 24,
        borderRadius: SCRUBBER_WIDTH / 2,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrubberHandle: {
        width: 2,
        height: 12,
        backgroundColor: 'white',
        borderRadius: 1,
    },
    timeText: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: '500',
        width: 48,
    },
    cropButton: {
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cropButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
}); 