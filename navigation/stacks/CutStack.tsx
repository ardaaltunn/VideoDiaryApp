import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoCutScreen } from '../../screens/home/VideoCutScreen';
import { MetadataFormScreen } from '../../screens/video/MetadataFormScreen';

export type CutStackParamList = {
  VideoCut: { uri?: string } | undefined;
  MetadataForm: { videoUri: string; startTime: number; endTime: number };
};

const Stack = createNativeStackNavigator<CutStackParamList>();

export function CutStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="VideoCut"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="VideoCut" component={VideoCutScreen} />
      <Stack.Screen name="MetadataForm" component={MetadataFormScreen} />
    </Stack.Navigator>
  );
}
