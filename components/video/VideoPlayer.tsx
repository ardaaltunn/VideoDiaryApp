import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { VideoAppBar } from './components/VideoAppBar';
import { VideoControls } from './components/VideoControls';
import { VideoDetailCard } from './components/VideoDetailCard';
import { EditVideoModal } from './EditVideoModal';
import { useTheme } from '../../theme/ThemeProvider';
import { useVideoProcessing } from '../../app/hooks/useVideoProcessing';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16;

interface VideoPlayerProps {
  id: string; // Video ID'si
  uri: string;
  title: string;
  description: string;
  onBack: () => void;
}

export function VideoPlayer({ id, uri, title, description, onBack }: VideoPlayerProps) {
  const { colors } = useTheme();
  const videoRef = React.useRef<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Yerel state: düzenlenmiş başlık ve açıklama
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);
  
  const [editVisible, setEditVisible] = useState(false);
  const { editVideo } = useVideoProcessing();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    'worklet';
    scrollY.value = event.contentOffset.y;
  });

  const togglePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (err) {
        console.error('Error toggling video playback:', err);
        setError('Video oynatma hatası');
      }
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
    } else if (status.error) {
      console.error('Video playback error:', status.error);
      setError('Video yüklenirken hata oluştu');
    }
  };

  const handleEditPress = () => {
    setEditVisible(true);
  };

  const handleSaveEdit = async (newTitle: string, newDesc: string) => {
    try {
      await editVideo({ id, newTitle, newDescription: newDesc });
      // Yerel state güncellemesi:
      setLocalTitle(newTitle);
      setLocalDescription(newDesc);
      setEditVisible(false);
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={['top', 'left', 'right']}>
      <VideoAppBar
        title={localTitle || 'Video'}
        subtitle={localDescription}
        onBack={onBack}
        onEdit={handleEditPress}
      />

      <View style={styles.videoSection}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri }}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={(error) => {
            console.error('Video loading error:', error);
            setError('Video yüklenemedi');
          }}
        />
        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={togglePlayPause}
        />
      </View>

      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <VideoDetailCard
          title={localTitle || 'Video'}
          description={localDescription || 'Açıklama yok'}
          duration={duration}
        />
      </AnimatedScrollView>

      {/* Düzenleme Modalı */}
      <EditVideoModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        initialTitle={localTitle}
        initialDescription={localDescription}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
