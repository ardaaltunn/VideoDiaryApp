import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { VideoPlayer } from '../../components/video/VideoPlayer';

type VideoPlayerScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

export function VideoPlayerScreen({ route, navigation }: VideoPlayerScreenProps) {
  // Tüm gerekli parametreleri alıyoruz:
  const { id, uri, title, description, duration, date } = route.params;

  // Ekran açıldığında tabBar'ı gizle, ekrandan çıkarken geri getir
  useEffect(() => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  return (
    <VideoPlayer
      id={id}
      uri={uri}
      title={title}
      description={description}
      duration={duration}
      date={date}
      onBack={() => navigation.goBack()}
    />
  );
}
