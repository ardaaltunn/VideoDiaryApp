import { create } from 'zustand';
import { VideoItem } from '../types/video.types';

interface VideoStore {
    videos: VideoItem[];
    selectedVideo: VideoItem | null;
    isProcessing: boolean;
    setVideos: (videos: VideoItem[]) => void;
    addVideo: (video: VideoItem) => void;
    setSelectedVideo: (video: VideoItem | null) => void;
    setProcessing: (status: boolean) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
    videos: [],
    selectedVideo: null,
    isProcessing: false,
    setVideos: (videos) => set({ videos }),
    addVideo: (video) => set((state) => ({
        videos: [video, ...state.videos]
    })),
    setSelectedVideo: (video) => set({ selectedVideo: video }),
    setProcessing: (status) => set({ isProcessing: status })
})); 