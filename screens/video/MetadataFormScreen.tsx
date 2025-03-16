import React from 'react';
import { MetadataForm } from '../../components/video/MetadataForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CutStackParamList } from '../../navigation/stacks/CutStack';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useVideoProcessing } from '../../app/hooks/useVideoProcessing';
import { VideoProcessOptions } from '../../app/backend/types/video.types';

type MetadataFormScreenProps = NativeStackScreenProps<CutStackParamList, 'MetadataForm'>;

export function MetadataFormScreen({ route, navigation }: MetadataFormScreenProps) {
  const { saveVideo, isSaving } = useVideoProcessing();

  const handleSubmit = async (data: { title: string; description: string; thumbnailUri: string }) => {
    try {
      if (!route.params) {
        throw new Error('Route parametreleri eksik');
      }

      const { videoUri, duration } = route.params;

      if (!videoUri) {
        throw new Error('Video URI eksik');
      }

      if (!data.thumbnailUri) {
        // Hem konsola yazıyoruz hem de kullanıcıya uyarı veriyoruz.
        console.log('Kapak fotoğrafı eksik');
        Alert.alert('Uyarı', 'Lütfen bir kapak fotoğrafı seçin.');
        return; // Devam etmesin
      }

      const options: VideoProcessOptions = {
        title: data.title,
        description: data.description,
        startTime: 0,
        duration: duration, // Kırpılmış süre
        thumbnailUri: data.thumbnailUri,
      };

      await saveVideo({
        sourceUri: videoUri,
        options,
      });

      // Tüm stack'i temizle ve ana sayfaya dön
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeTab' }],
        })
      );

      Alert.alert('Başarılı', 'Video başarıyla kaydedildi');
    } catch (error) {
      console.error('Video kaydetme hatası:', error);
      Alert.alert('Hata', error instanceof Error ? error.message : 'Video kaydedilirken bir hata oluştu');
    }
  };

  return <MetadataForm onSubmit={handleSubmit} isProcessing={isSaving} />;
}
