import React from 'react';
import { MetadataForm } from '../../components/video/MetadataForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type MetadataFormScreenProps = NativeStackScreenProps<RootStackParamList, 'MetadataForm'>;

export function MetadataFormScreen({ route, navigation }: MetadataFormScreenProps) {
    const handleSubmit = async (data: any) => {
        // Here you would process the video with FFMPEG
        // and save the metadata
        navigation.navigate('VideoList');
    };

    return <MetadataForm onSubmit={handleSubmit} />;
} 