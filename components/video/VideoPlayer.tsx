import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Platform,
    ScrollView,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { VideoAppBar } from './components/VideoAppBar';
import { VideoControls } from './components/VideoControls';
import { VideoDetailCard } from './components/VideoDetailCard';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface VideoPlayerProps {
    uri: string;
    title: string;
    description: string;
    onBack?: () => void;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 47 : 24;
const SCROLL_THRESHOLD = VIDEO_HEIGHT - HEADER_HEIGHT;

export function VideoPlayer({ uri, title, description, onBack }: VideoPlayerProps) {
    const { colors, isDark } = useTheme();
    // @ts-ignore - React.useRef import issue
    const videoRef = React.useRef(null);
    const [status, setStatus] = React.useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    const scrollY = useSharedValue(0);
    // @ts-ignore - Reanimated scroll event type issue
    const scrollHandler = useAnimatedScrollHandler((event: any) => {
        'worklet';
        scrollY.value = event.contentOffset.y;
    });

    const headerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_THRESHOLD],
            [0, 1],
            'clamp'
        );

        return {
            opacity: withSpring(opacity),
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [0, SCROLL_THRESHOLD],
                        [0, 0],
                        'clamp'
                    ),
                },
            ],
        };
    });

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

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setCurrentTime(status.positionMillis);
            setDuration(status.durationMillis || 0);
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background.primary }]}
            edges={['top', 'left', 'right']}
        >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* App Bar */}
            <VideoAppBar
                title={title}
                subtitle={description}
                onBack={onBack}
            />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Video Section */}
                <View style={styles.videoSection}>
                    <Video
                        // @ts-ignore
                        ref={videoRef}
                        style={styles.video}
                        source={{ uri }}
                        useNativeControls={false}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    />

                    {/* Custom Controls */}
                    <VideoControls
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        duration={duration}
                        onPlayPause={togglePlayPause}
                    />
                </View>

                {/* Content Section */}
                <AnimatedScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                >
                    <VideoDetailCard
                        title={title}
                        description={description}
                        duration={duration}
                    />
                </AnimatedScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    videoSection: {
        width: width,
        height: VIDEO_HEIGHT,
        backgroundColor: '#000',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
}); 