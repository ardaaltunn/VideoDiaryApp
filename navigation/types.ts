import { VideoItem } from '../components/home/VideoList';

export type RootStackParamList = {
    VideoList: undefined;
    VideoPlayer: { video: VideoItem };
    MetadataForm: { videoUri: string; startTime: number; endTime: number };
    VideoCut: { uri?: string };
}; 