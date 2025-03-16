import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { VideoSelectModal } from '../../components/video/VideoSelectModal';
import { Header } from '../../components/home/components';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CutStackParamList } from '../../navigation/stacks/CutStack';
import { useVideoProcessing } from '../../app/hooks/useVideoProcessing';
import { ProcessingModal } from '../../components/shared/ProcessingModal';

type VideoCutScreenProps = NativeStackScreenProps<CutStackParamList, 'VideoCut'>;

const { width } = Dimensions.get('window');
const BOX_WIDTH = width * 0.8;
const SCRUBBER_WIDTH = BOX_WIDTH;
const HANDLE_WIDTH = 20;

// Örnek trim fonksiyonu (kullanılmıyorsa silebilirsiniz)
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

  // Video’nun tam olarak yüklenip yüklenmediğini takip etmek için
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  // Video URI’si, ekran baştan mount edildiğinde route.params üzerinden ayarlanır.
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(
    route.params?.uri || null
  );
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [ended, setEnded] = useState(false);

  const videoRef = useRef<Video | null>(null);
  const setVideoCallbackRef = (instance: Video | null) => {
    videoRef.current = instance;
  };

  const scrubberRef = useRef<View>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);

  const [startTimeState, setStartTimeState] = useState(0);
  const [endTimeState, setEndTimeState] = useState(0);
  const [lastPlayPosition, setLastPlayPosition] = useState(0);

  const startPosition = useSharedValue(0);
  const endPosition = useSharedValue(SCRUBBER_WIDTH);

  const { trimVideo: trimFn, isTrimming, cancelTrim } = useVideoProcessing();

  useEffect(() => {
    if (route.params?.uri) {
      setSelectedVideoUri(route.params.uri);
    }
  }, [route.params?.uri]);

  useEffect(() => {
    if (selectedVideoUri) {
      // Yeni video seçildiğinde video yüklenene kadar false yapalım
      setIsVideoLoaded(false);
      setCurrentTime(0);
      setEnded(false);
      startPosition.value = 0;
      endPosition.value = SCRUBBER_WIDTH;
      setStartTimeState(0);
      setEndTimeState(0);
      try {
        videoRef.current?.setPositionAsync(0);
      } catch (e) {
        console.log('Yeni video setPositionAsync hatası:', e);
      }
    }
  }, [selectedVideoUri]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Eski video durumu kaldırıp, yeni video seçildiğinde ekranı tamamen yeniden yüklemek için navigation.replace kullanıyoruz.
  const handleVideoSelect = (uri: string) => {
    console.log('Yeni video seçildi:', uri);
    // navigation.replace ile VideoCutScreen'i yeni parametre ile yeniden mount ediyoruz.
    navigation.replace('VideoCut', { uri });
  };

  const handleVideoLoad = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    try {
      setIsVideoLoaded(true);
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
      setCurrentTime(0);
      videoRef.current?.setPositionAsync(0).catch((err) => {
        console.log('onLoad setPositionAsync hatası:', err);
      });
    } catch (e) {
      console.log('Error in handleVideoLoad:', e);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    try {
      const newTime = status.positionMillis / 1000;
      if (status.isPlaying) {
        const currentEndTime = (endPosition.value / SCRUBBER_WIDTH) * duration;
        if (newTime >= currentEndTime) {
          const currentStartTime = (startPosition.value / SCRUBBER_WIDTH) * duration;
          videoRef.current
            ?.setPositionAsync(currentStartTime * 1000)
            .catch((err) => console.log('PlaybackUpdate setPositionAsync hatası:', err));
          setCurrentTime(currentStartTime);
        } else {
          setCurrentTime(newTime);
        }
        setEnded(false);
        setLastPlayPosition(newTime);
      }
      if (status.didJustFinish) {
        setCurrentTime(0);
        setIsPlaying(false);
        setEnded(true);
        videoRef.current?.setPositionAsync(0).catch((err) =>
          console.log('PlaybackUpdate setPositionAsync finish hatası:', err)
        );
      }
    } catch (e) {
      console.log('Error in handlePlaybackStatusUpdate:', e);
    }
  };

  const factor = 0.3;

  const startGesture = Gesture.Pan()
    .onStart(() => {
      if (isPlaying) {
        try {
          videoRef.current?.pauseAsync();
          runOnJS(setIsPlaying)(false);
        } catch (e) {
        }
      }
    })
    .onUpdate((e) => {
      try {
        const newPos = Math.max(
          0,
          Math.min(e.translationX * factor + startPosition.value, endPosition.value - HANDLE_WIDTH)
        );
        runOnJS(setStartTimeState)((newPos / SCRUBBER_WIDTH) * duration);
        startPosition.value = newPos;
      } catch (error) {
        console.log('startGesture onUpdate hatası:', error);
      }
    })
    .onFinalize(() => {
      try {
        const finalTime = (startPosition.value / SCRUBBER_WIDTH) * duration;
        runOnJS(setStartTimeState)(finalTime);
        if (isVideoLoaded && videoRef.current) {
          videoRef.current
            .setPositionAsync(finalTime * 1000)
            .catch((err) => console.log('startGesture setPositionAsync hatası:', err));
        }
      } catch (e) {
      }
    });

  const endGesture = Gesture.Pan()
    .onStart(() => {
      if (isPlaying) {
        try {
          videoRef.current?.pauseAsync();
          runOnJS(setIsPlaying)(false);
        } catch (e) {
        }
      }
    })
    .onUpdate((e) => {
      try {
        const newPos = Math.max(
          startPosition.value + HANDLE_WIDTH,
          Math.min(e.translationX * factor + endPosition.value, SCRUBBER_WIDTH)
        );
        runOnJS(setEndTimeState)((newPos / SCRUBBER_WIDTH) * duration);
        endPosition.value = newPos;
      } catch (error) {
        console.log('endGesture onUpdate hatası:', error);
      }
    })
    .onFinalize(() => {
      try {
        const finalTime = (endPosition.value / SCRUBBER_WIDTH) * duration;
        runOnJS(setEndTimeState)(finalTime);
      } catch (e) {
        console.log('endGesture onFinalize hatası:', e);
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
    if (!isVideoLoaded) {
      console.log('Video henüz yüklenmedi, oynatamıyorum.');
      return;
    }
    if (!selectedVideoUri || !videoRef.current) return;
    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        if (ended) {
          await videoRef.current.replayAsync();
          setEnded(false);
        } else {
          const currentStartTime = (startPosition.value / SCRUBBER_WIDTH) * duration;
          const currentEndTime = (endPosition.value / SCRUBBER_WIDTH) * duration;
          if (lastPlayPosition < currentStartTime || lastPlayPosition > currentEndTime) {
            await videoRef.current.setPositionAsync(currentStartTime * 1000);
          }
          await videoRef.current.playAsync();
        }
        setIsPlaying(true);
      }
    } catch (e) {
      console.log('Error in togglePlayPause:', e);
    }
  };

  const handleTrimVideo = async () => {
    // Video yüklü değilse ya da seçili video yoksa işlem yapma
    if (!selectedVideoUri || !isVideoLoaded) {
      console.log("Video henüz yüklenmedi veya yok, trim yapılamaz.");
      return;
    }
  
    try {
      const startTimeVal = (startPosition.value / SCRUBBER_WIDTH) * duration;
      const endTimeVal = (endPosition.value / SCRUBBER_WIDTH) * duration;
      const trimDuration = endTimeVal - startTimeVal;
  
      // Videoyu kırp
      const processedUri = await trimFn({
        sourceUri: selectedVideoUri,
        startTime: startTimeVal,
        duration: trimDuration,
      });
  
      // Trim tamamlanınca, ekranda yeni URI ile yeniden mount
      navigation.replace('VideoCut', { uri: processedUri });
  
      // Böylece, ekrandaki tüm state sıfırlanacak ve onLoad tetiklenerek
      // "Cannot complete operation..." hatası ortadan kalkacak
    } catch (e: any) {
      if (e.message === 'Trim işlemi iptal edildi') {
        console.log('Trim operation was cancelled by the user');
        Alert.alert('İptal', 'Video kırpma iptal edildi');
      } else {
        console.error('handleTrimVideo hatası:', e);
        Alert.alert('Hata', 'Video kırpılırken bir sorun oluştu');
      }
    }
  };
  

  const handleSaveToJournal = () => {
    if (!isVideoLoaded) {
      console.log('Video henüz yüklenmedi, kaydetme yapılamaz.');
      return;
    }
    if (!selectedVideoUri) {
      Alert.alert('Hata', 'Lütfen bir video seçin');
      return;
    }
    navigation.navigate('MetadataForm', {
      videoUri: selectedVideoUri,
      startTime: 0,
      duration: duration,
    });
    setSelectedVideoUri(null);
    setIsPlaying(false);
    setEnded(false);
    setDuration(0);
    setCurrentTime(0);
    setStartTimeState(0);
    setEndTimeState(0);
    setLastPlayPosition(0);
    startPosition.value = 0;
    endPosition.value = SCRUBBER_WIDTH;
  };

  const onScrubberLayout = () => {
    try {
      scrubberRef.current?.measure((x, y, w, h, pageX, pageY) => {
        // Layout bilgisi alınabilir
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
              key={selectedVideoUri}
              ref={setVideoCallbackRef}
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
              <Text style={[styles.selectText, { color: colors.text.primary }]}>Video Seç</Text>
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
              <Text style={[styles.timeText, { color: colors.text.primary }]}>{formatTime(startTimeState)}</Text>
              <Text style={[styles.timeText, { color: colors.text.primary }]}>{formatTime(currentTime)}</Text>
              <Text style={[styles.timeText, { color: colors.text.primary }]}>{formatTime(endTimeState)}</Text>
            </View>
            <View style={[styles.timeline, { backgroundColor: '#fff' }]}>
              <Animated.View style={[styles.progress, { backgroundColor: '#000' }, progressStyle]} />
              <GestureDetector gesture={startGesture}>
                <Animated.View style={[styles.handle, { backgroundColor: '#000' }, startHandleStyle]}>
                  <View style={styles.handleBar} />
                </Animated.View>
              </GestureDetector>
              <GestureDetector gesture={endGesture}>
                <Animated.View style={[styles.handle, { backgroundColor: '#000' }, endHandleStyle]}>
                  <View style={styles.handleBar} />
                </Animated.View>
              </GestureDetector>
            </View>
          </View>
        )}
        <View style={styles.bottomNavigation}>
          <Pressable
            style={styles.navItem}
            onPress={handleTrimVideo}
            disabled={!selectedVideoUri || !isVideoLoaded}
          >
            <Ionicons name="cut-outline" size={24} color={colors.text.primary} />
            <Text style={[styles.navText, { color: colors.text.primary }]}>Videoları Kırp</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={togglePlayPause}
            disabled={!selectedVideoUri || !isVideoLoaded}
          >
            <Ionicons
              name={isPlaying ? 'pause-outline' : 'play-outline'}
              size={24}
              color={selectedVideoUri && isVideoLoaded ? colors.text.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.navText,
                { color: selectedVideoUri && isVideoLoaded ? colors.text.primary : colors.text.secondary },
              ]}
            >
              {isPlaying ? 'Durdur' : 'Anında Önizle'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={handleSaveToJournal}
            disabled={!selectedVideoUri || !isVideoLoaded}
          >
            <Ionicons
              name="save-outline"
              size={24}
              color={selectedVideoUri && isVideoLoaded ? colors.text.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.navText,
                { color: selectedVideoUri && isVideoLoaded ? colors.text.primary : colors.text.secondary },
              ]}
            >
              Günlüğüne Kaydet
            </Text>
          </Pressable>
        </View>
        {selectedVideoUri && (
          <Pressable style={styles.newVideoButton} onPress={() => setModalVisible(true)}>
            <Text style={[styles.newVideoText, { color: colors.text.secondary }]}>Farklı Video Seç</Text>
          </Pressable>
        )}
      </Animated.View>
      <VideoSelectModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onVideoSelect={handleVideoSelect}
      />
      <ProcessingModal
        visible={isTrimming}
        onRequestClose={() => {
          if (typeof cancelTrim === 'function') {
            cancelTrim();
          }
        }}
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
  bottomNavigation: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 48 },
  navItem: { alignItems: 'center', width: '30%' },
  navText: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  video: { width: '100%', height: '100%' },
  scrubberContainer: { marginTop: 16 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, width: '100%' },
  timeText: { fontSize: 12, fontWeight: '500' },
  timeline: { height: 4, borderRadius: 2, width: '100%', backgroundColor: '#E5E5E5' },
  progress: { height: '100%', borderRadius: 2, position: 'absolute' },
  handle: { width: HANDLE_WIDTH, height: HANDLE_WIDTH, borderRadius: HANDLE_WIDTH / 2, position: 'absolute', top: -8, justifyContent: 'center', alignItems: 'center' },
  handleBar: { width: 2, height: 12, backgroundColor: 'white', borderRadius: 1 },
  newVideoButton: { height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  newVideoText: { fontSize: 14, fontWeight: '500' },
});
