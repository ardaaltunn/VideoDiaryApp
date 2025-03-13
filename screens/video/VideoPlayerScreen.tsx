import React from 'react';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type VideoPlayerScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

export function VideoPlayerScreen({ route, navigation }: VideoPlayerScreenProps) {
    const { video } = route.params;

    return (
        <VideoPlayer
            uri={video.uri}
            title={video.title}
            description={video.description}
            onBack={() => navigation.goBack()}
        />
    );
} 