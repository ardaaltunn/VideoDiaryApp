import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoList, VideoItem } from '../../components/home/VideoList';
import { Header } from '../../components/home/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type VideoListScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoList'>;

export function VideoListScreen({ navigation }: VideoListScreenProps) {
    const { colors } = useTheme();
    const [videos, setVideos] = React.useState<VideoItem[]>([
        {
            id: '1',
            uri: 'https://example.com/video1.mp4',
            title: 'İlk Günlük Kaydım',
            description: 'Bugün yeni bir projeye başladım ve heyecan verici gelişmeler var. Kendimi geliştirmek için yeni hedefler belirledim.',
            thumbnail: 'https://picsum.photos/800/600?random=1',
            duration: '2:45',
            createdAt: '14 Mart 2024'
        },
        {
            id: '2',
            uri: 'https://example.com/video2.mp4',
            title: 'Haftalık Değerlendirme',
            description: 'Bu hafta yaşadığım deneyimler ve öğrendiğim yeni şeyler hakkında düşüncelerim. Özellikle yeni başladığım yoga pratiği bana çok iyi geldi.',
            thumbnail: 'https://picsum.photos/800/600?random=2',
            duration: '3:20',
            createdAt: '12 Mart 2024'
        },
        {
            id: '3',
            uri: 'https://example.com/video3.mp4',
            title: 'Yeni Başlangıçlar',
            description: 'Hayatımda yeni bir sayfa açmanın tam zamanı. Bu videoda gelecek planlarımı ve hedeflerimi paylaşıyorum.',
            thumbnail: 'https://picsum.photos/800/600?random=3',
            duration: '4:15',
            createdAt: '10 Mart 2024'
        }
    ]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
            <Header
                title="Video Günlüğüm"
                subtitle="Anılarını videolarla kaydet"
            />

            <View style={{ flex: 1 }}>
                <VideoList
                    videos={videos}
                    onVideoPress={(video: VideoItem) =>
                        navigation.navigate('VideoPlayer', { video })
                    }
                />
            </View>
        </SafeAreaView>
    );
} 