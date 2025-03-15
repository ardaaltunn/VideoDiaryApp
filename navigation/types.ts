import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    VideoList: undefined;
    VideoPlayer: {
        id: string;
        uri: string;
        title: string;
        description: string;
    };
    VideoCut: {
        uri: string;
    };
    MetadataForm: {
        videoUri: string;
        startTime: number;
        duration: number;
    };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    T
>;

export type VideoPlayerScreenProps = RootStackScreenProps<'VideoPlayer'>; 