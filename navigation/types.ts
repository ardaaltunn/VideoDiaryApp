import { VideoItem } from '../components/home/VideoList';

export type RootStackParamList = {
    VideoList: undefined;
    VideoPlayer: { video: VideoItem };
    VideoCropper: { uri: string };
    MetadataForm: { videoUri: string; startTime: number; endTime: number };
    VideoCut: undefined;
}; 