import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoList, VideoItem } from '../../components/home/VideoList';
import { Header } from '../../components/home/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useVideoProcessing } from '../../app/hooks/useVideoProcessing';

type VideoListScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoList'>;

export function VideoListScreen({ navigation }: VideoListScreenProps) {
  const { colors } = useTheme();
  const { videos, isLoading } = useVideoProcessing();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header title="Video Günlüğüm" subtitle="Anılarını videolarla kaydet" />
      <View style={styles.content}>
        <VideoList
          videos={videos}
          onVideoPress={(video: VideoItem) =>
            navigation.navigate('VideoPlayer', { ...video })
          }
        />
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
});
