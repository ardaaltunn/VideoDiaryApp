import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="video-crop"
                options={{
                    title: 'Video Kırp',
                    tabBarIcon: ({ color }) => <TabBarIcon name="cut" color={color} />,
                }}
            />
        </Tabs>
    );
} 