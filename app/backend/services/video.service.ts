import { VideoItem, VideoProcessOptions } from '../types/video.types';
import { videoDb } from '../db/database';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://192.168.1.108:3000'; // Geliştirme ortamı için

export class VideoService {
    static async processVideo(
        sourceUri: string,
        options: VideoProcessOptions
    ): Promise<VideoItem> {
        try {
            // Video dosyasını sunucuya yükle
            const formData = new FormData();
            formData.append('video', {
                uri: sourceUri,
                type: 'video/mp4',
                name: 'video.mp4'
            } as any);

            const uploadResponse = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!uploadResponse.ok) {
                throw new Error('Video yükleme hatası');
            }

            const uploadResult = await uploadResponse.json();

            // Video kırpma isteği
            const trimResponse = await fetch(`${API_URL}/trim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: uploadResult.filename,
                    startTime: options.startTime,
                    duration: options.duration
                })
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

            // Yeni video öğesi oluştur
            const newVideo: VideoItem = {
                id: `video_${Date.now()}`,
                title: options.title,
                description: options.description,
                uri: processedVideoPath,
                thumbnailUri: options.thumbnailUri,
                duration: options.duration,
                createdAt: new Date().toISOString()
            };

            // Veritabanına kaydet
            await videoDb.saveVideo(newVideo);

            return newVideo;
        } catch (error) {
            console.error('Video işleme hatası:', error);
            throw error;
        }
    }

    static async getAllVideos(): Promise<VideoItem[]> {
        return videoDb.getAllVideos();
    }

    static async getVideoById(id: string): Promise<VideoItem | null> {
        return await videoDb.getVideoById(id);
    }
} 