import React from 'react';
import { VideoCropper } from '../../components/video/VideoCropper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type VideoCropperScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoCropper'>;

export function VideoCropperScreen({ route, navigation }: VideoCropperScreenProps) {
    const handleCropComplete = (startTime: number, endTime: number) => {
        navigation.navigate('MetadataForm', {
            videoUri: route.params.uri,
            startTime,
            endTime,
        });
    };

    return (
        <VideoCropper
            videoUri={route.params.uri}
            onCropComplete={handleCropComplete}
        />
    );
} 