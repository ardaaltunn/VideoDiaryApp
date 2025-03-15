import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { VideoPlayer } from '../../components/video/VideoPlayer';

type VideoPlayerScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

export function VideoPlayerScreen({ route, navigation }: VideoPlayerScreenProps) {
  const { id, uri, title, description } = route.params;

  // Ekran açıldığında tabBar'ı gizle, ekrandan çıkarken geri getir
  useEffect(() => {
    // TabNavigator'ın navigation objesine erişiyoruz
    const parent = navigation.getParent();

    // Tab bar'ı gizle
    parent?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    // Cleanup: Ekrandan çıkarken tab bar'ı geri getir
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
      onBack={() => navigation.goBack()}
    />
  );
}
