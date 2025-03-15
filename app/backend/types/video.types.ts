export interface VideoItem {
    id: string;
    title: string;
    description: string;
    uri: string;
    thumbnailUri: string;
    duration: number;
    createdAt: string;
}

export interface VideoProcessOptions {
    startTime: number;
    duration: number;
    title: string;
    description: string;
    thumbnailUri: string;
} 