import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { VideoSelectModal } from '../../components/video/VideoSelectModal';
import { Header } from '../../components/home/components';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CutStackParamList } from '../../navigation/stacks/CutStack';
import * as FileSystem from 'expo-file-system';
import { useVideoProcessing } from '../../app/hooks/useVideoProcessing';

type VideoCutScreenProps = NativeStackScreenProps<CutStackParamList, 'VideoCut'>;

const { width } = Dimensions.get('window');
const BOX_WIDTH = width * 0.8;
const SCRUBBER_WIDTH = BOX_WIDTH;
const HANDLE_WIDTH = 20;

// Örnek trim fonksiyonu (gerçek projede video işleme kütüphanesi entegre edebilirsiniz)
async function fakeTrimVideo(
  originalUri: string,
  startTime: number,
  endTime: number
): Promise<string> {
  return new Promise((resolve) => {
    console.log('Trimming video with:', { originalUri, startTime, endTime });
    setTimeout(() => {
      const trimmedUri = originalUri + `?trim=${startTime}-${endTime}`;
      console.log('Trim completed:', trimmedUri);
      resolve(trimmedUri);
    }, 2000);
  });
}

// Type guard: status içinde naturalSize varsa true döner.
function hasNaturalSize(
  status: AVPlaybackStatus
): status is AVPlaybackStatusSuccess & { naturalSize: { width: number; height: number } } {
  return (
    (status as any).naturalSize &&
    typeof (status as any).naturalSize.width === 'number' &&
    typeof (status as any).naturalSize.height === 'number'
  );
}

export function VideoCutScreen({ navigation, route }: VideoCutScreenProps) {
  const { colors } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(
    route.params?.uri || null
  );

  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Video ref (callback ref ile)
  const videoRef = useRef<Video | null>(null);
  const setVideoCallbackRef = (instance: Video | null) => {
    // Ref'e doğrudan atamak yerine callback ile atıyoruz.
    videoRef.current = instance;
  };

  const scrubberRef = useRef<View>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);

  // Görünür zaman değerleri
  const [startTimeState, setStartTimeState] = useState(0);
  const [endTimeState, setEndTimeState] = useState(0);
  const [lastPlayPosition, setLastPlayPosition] = useState(0);

  // Reanimated shared values
  const startPosition = useSharedValue(0);
  const endPosition = useSharedValue(SCRUBBER_WIDTH);

  // Route üzerinden gelen video URI
  useEffect(() => {
    if (route.params?.uri) {
      setSelectedVideoUri(route.params.uri);
    }
  }, [route.params?.uri]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoSelect = (uri: string) => {
    console.log('Video seçildi:', uri);
    setSelectedVideoUri(uri);
    setModalVisible(false);
  };

  const handleVideoLoad = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    try {
      if (hasNaturalSize(status)) {
        const { width: vidW, height: vidH } = status.naturalSize;
        setVideoAspectRatio(vidW / vidH);
      }
      if (status.durationMillis) {
        const dur = status.durationMillis / 1000;
        setDuration(dur);
        setEndTimeState(dur);
        startPosition.value = 0;
        endPosition.value = SCRUBBER_WIDTH;
      }
    } catch (e) {
      console.log('Error in handleVideoLoad:', e);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    try {
      setCurrentTime(status.positionMillis / 1000);
      if (status.isPlaying) {
        setLastPlayPosition(status.positionMillis / 1000);
      }
      const currentEndTime = (endPosition.value / SCRUBBER_WIDTH) * duration;
      if (status.positionMillis / 1000 >= currentEndTime) {
        const currentStartTime = (startPosition.value / SCRUBBER_WIDTH) * duration;
        try {
          videoRef.current?.setPositionAsync(currentStartTime * 1000);
        } catch (e) {
          console.log('Error setting position in playback update:', e);
        }
      }
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    } catch (e) {
      console.log('Error in handlePlaybackStatusUpdate:', e);
    }
  };

  // Eski scrubber mantığı (Gesture vs.)
  const factor = 0.3;
  const startGesture = Gesture.Pan()
    .onStart(() => {
      if (isPlaying) {
        try {
          setTimeout(() => {
            try {
              videoRef.current?.pauseAsync();
              runOnJS(setIsPlaying)(false);
            } catch (e) {
              console.log('Error pausing video on start gesture:', e);
            }
          }, 10);
        } catch (e) { }
      }
    })
    .onUpdate((e) => {
      try {
        const newPosition = Math.max(
          0,
          Math.min(e.translationX * factor + startPosition.value, endPosition.value - HANDLE_WIDTH)
        );
        runOnJS(setStartTimeState)((newPosition / SCRUBBER_WIDTH) * duration);
        startPosition.value = newPosition;
      } catch (error) {
        console.log('Error in start gesture onUpdate:', error);
      }
    })
    .onFinalize(() => {
      try {
        const finalTime = (startPosition.value / SCRUBBER_WIDTH) * duration;
        runOnJS(setStartTimeState)(finalTime);
        setTimeout(() => {
          try {
            videoRef.current?.setPositionAsync(finalTime * 1000);
          } catch (e) {
            console.log('Error in start gesture onFinalize setPosition:', e);
          }
        }, 50);
      } catch (e) { }
    });

  const endGesture = Gesture.Pan()
    .onStart(() => {
      if (isPlaying) {
        try {
          setTimeout(() => {
            try {
              videoRef.current?.pauseAsync();
              runOnJS(setIsPlaying)(false);
            } catch (e) {
              console.log('Error pausing video on end gesture start:', e);
            }
          }, 10);
        } catch (e) { }
      }
    })
    .onUpdate((e) => {
      try {
        const newPosition = Math.max(
          startPosition.value + HANDLE_WIDTH,
          Math.min(e.translationX * factor + endPosition.value, SCRUBBER_WIDTH)
        );
        runOnJS(setEndTimeState)((newPosition / SCRUBBER_WIDTH) * duration);
        endPosition.value = newPosition;
      } catch (error) {
        console.log('Error in end gesture onUpdate:', error);
      }
    })
    .onFinalize(() => {
      try {
        const finalTime = (endPosition.value / SCRUBBER_WIDTH) * duration;
        runOnJS(setEndTimeState)(finalTime);
      } catch (e) {
        console.log('Error in end gesture onFinalize:', e);
      }
    });

  const startHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: startPosition.value }],
  }));
  const endHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: endPosition.value }],
  }));
  const progressStyle = useAnimatedStyle(() => ({
    left: startPosition.value,
    width: Math.max(1, endPosition.value - startPosition.value),
  }));

  const togglePlayPause = async () => {
    if (!selectedVideoUri) return;
    try {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          const currentStartTime = (startPosition.value / SCRUBBER_WIDTH) * duration;
          const currentEndTime = (endPosition.value / SCRUBBER_WIDTH) * duration;
          if (lastPlayPosition < currentStartTime || lastPlayPosition > currentEndTime) {
            await videoRef.current.setPositionAsync(currentStartTime * 1000);
          }
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (e) {
      console.log('Error in togglePlayPause:', e);
    }
  };

  const { trimVideo, isTrimming } = useVideoProcessing();

  // Trim işlemi
const handleTrimVideo = async () => {
  if (!selectedVideoUri) return;
  try {
      const startTimeVal = (startPosition.value / SCRUBBER_WIDTH) * duration;
      const endTimeVal = (endPosition.value / SCRUBBER_WIDTH) * duration;
      const trimDuration = endTimeVal - startTimeVal;

      // Video kırpma işlemini başlat
      const processedUri = await trimVideo({
          sourceUri: selectedVideoUri,
          startTime: startTimeVal,
          duration: trimDuration
      });

      // Kırpılan videoyu göster ve durumu güncelle
      setSelectedVideoUri(processedUri);
      setDuration(trimDuration);  // Burada, videonun yeni süresini güncelliyoruz.

      // Scrubber'ı sıfırla
      startPosition.value = 0;
      endPosition.value = SCRUBBER_WIDTH;
      setStartTimeState(0);
      setEndTimeState(trimDuration);  // Yeni duration değeri ile güncelliyoruz.

      Alert.alert('Başarılı', 'Video seçilen aralığa göre kırpıldı');
  } catch (e) {
      console.error('handleTrimVideo hatası:', e);
      Alert.alert('Hata', 'Video kırpılırken bir sorun oluştu');
  }
};


  // Günlüğüne kaydet
  const handleSaveToJournal = () => {
    if (!selectedVideoUri) {
      Alert.alert('Hata', 'Lütfen bir video seçin');
      return;
    }

    navigation.navigate('MetadataForm', {
      videoUri: selectedVideoUri,
      startTime: 0,
      duration: duration
    });

    // Video seçim ve kırpma ekranlarını temizle
    setSelectedVideoUri(null);
    startPosition.value = 0;
    endPosition.value = SCRUBBER_WIDTH;
    setStartTimeState(0);
    setEndTimeState(0);
  };

  const onScrubberLayout = () => {
    try {
      scrubberRef.current?.measure((x, y, w, h, pageX, pageY) => {
        // Gerekirse layout bilgilerini güncelleyebilirsiniz.
      });
    } catch (e) {
      console.log('Error in onScrubberLayout:', e);
    }
  };

  useEffect(() => {
    if (duration > 0) {
      startPosition.value = 0;
      endPosition.value = SCRUBBER_WIDTH;
      setEndTimeState(duration);
    }
  }, [duration]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header title="Video Kırp" subtitle="Videonu seç ve düzenle" />

      {/* Dış container animasyonu */}
      <Animated.View style={styles.contentContainer} entering={FadeIn.delay(300)}>
        <Text style={[styles.instructions, { color: colors.text.secondary }]}>
          {selectedVideoUri
            ? 'Seçilen videoyu düzenlemek için aşağıdaki seçenekleri kullan'
            : 'Düzenlemek istediğin videoyu seçmek için aşağıdaki alana dokun'}
        </Text>

        <Pressable
          style={[
            styles.box,
            {
              width: BOX_WIDTH,
              height: BOX_WIDTH / videoAspectRatio,
              backgroundColor: colors.background.secondary,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          {selectedVideoUri ? (
            <Video
              ref={setVideoCallbackRef} // callback ref
              source={{ uri: selectedVideoUri }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              onLoad={handleVideoLoad}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              shouldPlay={isPlaying}
            />
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons name="videocam" size={48} color={colors.text.primary} />
              <Text style={[styles.selectText, { color: colors.text.primary }]}>
                Video Seç
              </Text>
            </View>
          )}
        </Pressable>

        {selectedVideoUri && (
          <View
            ref={scrubberRef}
            style={[styles.scrubberContainer, { width: BOX_WIDTH }]}
            onLayout={onScrubberLayout}
          >
            <View style={styles.timeContainer}>
              <Text style={[styles.timeText, { color: colors.text.primary }]}>
                {formatTime(startTimeState)}
              </Text>
              <Text style={[styles.timeText, { color: colors.text.primary }]}>
                {formatTime(currentTime)}
              </Text>
              <Text style={[styles.timeText, { color: colors.text.primary }]}>
                {formatTime(endTimeState)}
              </Text>
            </View>
            <View style={[styles.timeline, { backgroundColor: '#fff' }]}>
              <Animated.View style={[styles.progress, { backgroundColor: '#000' }, progressStyle]} />
              <GestureDetector gesture={startGesture}>
                <Animated.View
                  style={[styles.handle, { backgroundColor: '#000' }, startHandleStyle]}
                >
                  <View style={styles.handleBar} />
                </Animated.View>
              </GestureDetector>
              <GestureDetector gesture={endGesture}>
                <Animated.View
                  style={[styles.handle, { backgroundColor: '#000' }, endHandleStyle]}
                >
                  <View style={styles.handleBar} />
                </Animated.View>
              </GestureDetector>
            </View>
          </View>
        )}

        <View style={styles.bottomNavigation}>
          <Pressable style={styles.navItem} onPress={handleTrimVideo} disabled={!selectedVideoUri}>
            <Ionicons name="cut-outline" size={24} color={colors.text.primary} />
            <Text style={[styles.navText, { color: colors.text.primary }]}>Videoları Kırp</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={togglePlayPause} disabled={!selectedVideoUri}>
            <Ionicons
              name={isPlaying ? 'pause-outline' : 'play-outline'}
              size={24}
              color={selectedVideoUri ? colors.text.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.navText,
                { color: selectedVideoUri ? colors.text.primary : colors.text.secondary },
              ]}
            >
              {isPlaying ? 'Durdur' : 'Anında Önizle'}
            </Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={handleSaveToJournal} disabled={!selectedVideoUri}>
            <Ionicons
              name="save-outline"
              size={24}
              color={selectedVideoUri ? colors.text.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.navText,
                { color: selectedVideoUri ? colors.text.primary : colors.text.secondary },
              ]}
            >
              Günlüğüne Kaydet
            </Text>
          </Pressable>
        </View>

        {selectedVideoUri && (
          <Pressable style={styles.newVideoButton} onPress={() => setModalVisible(true)}>
            <Text style={[styles.newVideoText, { color: colors.text.secondary }]}>
              Farklı Video Seç
            </Text>
          </Pressable>
        )}
      </Animated.View>

      {/* Video seçme modalı */}
      <VideoSelectModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onVideoSelect={handleVideoSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  instructions: { fontSize: 16, textAlign: 'center', marginBottom: 32, opacity: 0.8 },
  box: {
    width: BOX_WIDTH,
    height: BOX_WIDTH / (16 / 9),
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  selectText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 48,
  },
  navItem: { alignItems: 'center', width: '30%' },
  navText: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  video: { width: '100%', height: '100%' },
  scrubberContainer: { marginTop: 16 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, width: '100%' },
  timeText: { fontSize: 12, fontWeight: '500' },
  timeline: { height: 4, borderRadius: 2, width: '100%', backgroundColor: '#E5E5E5' },
  progress: { height: '100%', borderRadius: 2, position: 'absolute' },
  handle: {
    width: HANDLE_WIDTH,
    height: HANDLE_WIDTH,
    borderRadius: HANDLE_WIDTH / 2,
    position: 'absolute',
    top: -8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleBar: { width: 2, height: 12, backgroundColor: 'white', borderRadius: 1 },
  videoContainer: { alignItems: 'center', width: '100%' },
  newVideoButton: { height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  newVideoText: { fontSize: 14, fontWeight: '500' },
});
