// components/home/VideoList.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { Card } from '../shared/Card';
import { useTheme } from '../../theme/ThemeProvider';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoProcessing } from '../../app/hooks/useVideoProcessing';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

// Yerel VideoItem tipini tanımlıyoruz
export interface VideoItem {
  id: string;
  uri: string;
  title: string;
  description: string;
  thumbnailUri: string;
  duration: number; // Saniye cinsinden
  createdAt: string;
}

// VideoList bileşenine gönderilecek propsları tanımlıyoruz
export interface VideoListProps {
  videos: VideoItem[];
  onVideoPress: (video: VideoItem) => void;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);

type VideoListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VideoList: React.FC<VideoListProps> = ({ videos, onVideoPress }) => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const cardWidth = width - 32;
  const { isLoading, deleteVideo } = useVideoProcessing();
  const navigation = useNavigation<VideoListNavigationProp>();

  React.useEffect(() => {
    console.log('Videos loaded:', videos);
  }, [videos]);

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoPress = (video: VideoItem) => {
    console.log('Handling video press:', video);
    if (!video.uri) {
      console.error('Video URI is missing!');
      return;
    }
    navigation.navigate('VideoPlayer', {
      id: video.id,
      uri: video.uri,
      title: video.title || 'Untitled',
      description: video.description || 'No description',
    });
  };

  const handleDeletePress = async (id: string) => {
    try {
      await deleteVideo(id);
    } catch (error) {
      console.error('Silme hatası:', error);
      // İsteğe bağlı: Alert ile hata mesajı gösterebilirsiniz.
    }
  };

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => {
    if (!item.uri || !item.thumbnailUri) {
      console.error('Invalid video item:', item);
      return null;
    }

    return (
      <AnimatedCard
        entering={FadeInUp.delay(index * 100)}
        exiting={FadeOutDown}
        onPress={() => handleVideoPress(item)}
        style={[styles.card, { width: cardWidth }]}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: item.thumbnailUri }}
            style={[styles.thumbnail, { width: cardWidth }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.thumbnailGradient}
          />
          <View style={styles.durationContainer}>
            <BlurView intensity={30} tint="dark" style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color="white" style={styles.durationIcon} />
              <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
            </BlurView>
          </View>
        </View>

        <View style={[styles.infoContainer, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
              {item.title || 'Untitled'}
            </Text>
            <BlurView
              intensity={isDark ? 30 : 60}
              tint={isDark ? 'dark' : 'light'}
              style={styles.playButton}
            >
              <Ionicons name="play" size={16} color={colors.text.primary} />
            </BlurView>
          </View>
          <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
              <Text style={[styles.meta, { color: colors.text.tertiary }]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Pressable onPress={() => handleDeletePress(item.id)}>
              <Ionicons
                name="trash-outline"
                size={21}
                color={colors.text.primary}
                style={{ marginLeft: 16 }}
              />
            </Pressable>
          </View>
        </View>
      </AnimatedCard>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <BlurView
          intensity={isDark ? 30 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="videocam-outline" size={45} color={'#000'} />
        </BlurView>
        <Text style={[styles.emptyText, { color: colors.text.primary }]}>
          Henüz video eklenmemiş
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
          Lütfen yeni bir video ekleyin
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  separator: {
    height: 20,
  },
  thumbnailContainer: {
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 220,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  thumbnailGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  durationContainer: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  durationIcon: {
    marginRight: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 250,
  },
});
