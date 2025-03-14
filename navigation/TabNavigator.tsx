import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack } from './stacks/HomeStack';
import { CutStack } from './stacks/CutStack';
import { useTheme } from '../theme/ThemeProvider';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('HomeTab');

    return (
        <Tab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background.primary,
                    borderTopColor: colors.border.light,
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    color: 'black'
                }
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        setActiveTab('HomeTab');
                        navigation.navigate('HomeTab'); // HomeStack'in ana ekranı (VideoList)
                    },
                })}
            />
            <Tab.Screen
                name="CutTab"
                component={CutStack}
                options={{
                    title: 'Video Kırp',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="cut" size={size} color={color} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        setActiveTab('CutTab');
                        navigation.navigate('CutTab'); // CutStack'in ana ekranı (VideoCut)
                    },
                })}
            />
        </Tab.Navigator>
    );
}
