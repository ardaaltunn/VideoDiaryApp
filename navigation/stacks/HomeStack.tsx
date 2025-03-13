import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { RootStackParamList } from '../types';
import { VideoListScreen } from '../../screens/home/VideoListScreen';
import { VideoCutScreen } from '../../screens/home/VideoCutScreen';
import { VideoPlayerScreen } from '../../screens/video/VideoPlayerScreen';
import { VideoCropperScreen } from '../../screens/video/VideoCropperScreen';
import { MetadataFormScreen } from '../../screens/video/MetadataFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function HomeStack() {
    const { colors } = useTheme();

    return (
        // @ts-ignore - Missing children prop issue
        <Stack.Navigator
            initialRouteName="VideoList"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background.primary },
            }}
        >
            <Stack.Screen name="VideoList" component={VideoListScreen} />
            <Stack.Screen name="VideoCut" component={VideoCutScreen} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
            <Stack.Screen name="VideoCropper" component={VideoCropperScreen} />
            <Stack.Screen name="MetadataForm" component={MetadataFormScreen} />
        </Stack.Navigator>
    );
} 