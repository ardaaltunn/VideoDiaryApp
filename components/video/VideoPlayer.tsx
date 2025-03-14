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
import { useNavigation } from '@react-navigation/native';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface VideoPlayerProps {
  uri: string;
  title: string;
  description: string;
  onBack?: () => void;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16;

export function VideoPlayer({ uri, title, description, onBack }: VideoPlayerProps) {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  // Alt tab bar’ı gizleme
  React.useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: 'none' } });
    }
    return () => {
      if (parent) {
        parent.setOptions({ tabBarStyle: undefined });
      }
    };
  }, [navigation]);

  // SafeAreaView edges -> top, left, right
  // Bu sayede üst bildirim alanı boşluğu korunur.
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      <VideoContent
        uri={uri}
        title={title}
        description={description}
        onBack={onBack}
      />
    </SafeAreaView>
  );
}

/**
 * VideoContent: asıl içerik (AppBar, Video, Scroll vs.)
 * Bunu ayırmamızın sebebi, SafeAreaView'i en dışta kullanmak
 */
function VideoContent({
  uri,
  title,
  description,
  onBack,
}: {
  uri: string;
  title: string;
  description: string;
  onBack?: () => void;
}) {
  const { colors } = useTheme();

  const videoRef = React.useRef<Video | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event: any) => {
    'worklet';
    scrollY.value = event.contentOffset.y;
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
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
    }
  };

  return (
    <View style={styles.content}>
      {/* AppBar */}
      <VideoAppBar
        title={title}
        subtitle={description}
        onBack={onBack}
      />

      {/* Video Section */}
      <View style={styles.videoSection}>
        <Video
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

      {/* Scroll Content */}
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
