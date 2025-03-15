import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VideoService } from '../backend/services/video.service';
import { useVideoStore } from '../backend/store/video.store';
import { VideoProcessOptions } from '../backend/types/video.types';
import * as FileSystem from 'expo-file-system';
import { videoDb } from '../backend/db/database';

const API_URL = 'http://192.168.1.108:3000'; // Geliştirme ortamı için

export function useVideoProcessing() {
  const queryClient = useQueryClient();
  const { setProcessing, addVideo, videos, setVideos } = useVideoStore();

  // Tüm videoları getir
  const videosQuery = useQuery({
    queryKey: ['videos'],
    queryFn: VideoService.getAllVideos,
  });

  // Video kırpma mutation'ı (önceki haliyle)
  const trimVideoMutation = useMutation({
    mutationFn: async ({
      sourceUri,
      startTime,
      duration,
    }: {
      sourceUri: string;
      startTime: number;
      duration: number;
    }): Promise<string> => {
      setProcessing(true);
      try {
        // Video dosyasını sunucuya yükle
        const formData = new FormData();
        formData.append('video', {
          uri: sourceUri,
          type: 'video/mp4',
          name: 'video.mp4',
        } as any);

        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Video yükleme hatası');
        }

        const uploadResult = await uploadResponse.json();

        // Video kırpma isteği
        const trimResponse = await fetch(`${API_URL}/trim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: uploadResult.filename,
            startTime,
            duration,
          }),
        });

        if (!trimResponse.ok) {
          throw new Error('Video kırpma hatası');
        }

        const trimResult = await trimResponse.json();

        // Kırpılmış videoyu indir
        const processedVideoPath = `${FileSystem.documentDirectory}processed_${Date.now()}.mp4`;
        await FileSystem.downloadAsync(
          `${API_URL}${trimResult.url}`,
          processedVideoPath
        );

        return processedVideoPath;
      } finally {
        setProcessing(false);
      }
    },
  });

  // Video kaydetme mutation'ı (önceki haliyle)
  const saveVideoMutation = useMutation({
    mutationFn: async ({
      sourceUri,
      options,
    }: {
      sourceUri: string;
      options: VideoProcessOptions;
    }) => {
      setProcessing(true);
      try {
        const processedVideo = await VideoService.processVideo(sourceUri, options);
        addVideo(processedVideo);
        return processedVideo;
      } finally {
        setProcessing(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  // Video silme mutation'ı
  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      setProcessing(true);
      try {
        await videoDb.deleteVideo(id);
      } finally {
        setProcessing(false);
      }
    },
    onSuccess: (_data, id) => {
      setVideos(videos.filter((video) => video.id !== id));
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  // Yeni: Video düzenleme (update) mutation'ı
  const editVideoMutation = useMutation({
    mutationFn: async ({
      id,
      newTitle,
      newDescription,
    }: {
      id: string;
      newTitle: string;
      newDescription: string;
    }) => {
      setProcessing(true);
      try {
        await videoDb.updateVideo(id, newTitle, newDescription);
      } finally {
        setProcessing(false);
      }
    },
    onSuccess: (_data, { id, newTitle, newDescription }) => {
      setVideos(
        videos.map((v) =>
          v.id === id ? { ...v, title: newTitle, description: newDescription } : v
        )
      );
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  return {
    videos: videosQuery.data || [],
    isLoading: videosQuery.isLoading,
    trimVideo: trimVideoMutation.mutateAsync,
    isTrimming: trimVideoMutation.status === 'pending',
    saveVideo: saveVideoMutation.mutate,
    isSaving: saveVideoMutation.status === 'pending',
    deleteVideo: deleteVideoMutation.mutateAsync,
    isDeleting: deleteVideoMutation.status === 'pending',
    editVideo: editVideoMutation.mutateAsync,
    isEditing: editVideoMutation.status === 'pending',
  };
}
