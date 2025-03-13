import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack } from './stacks/HomeStack';
import { useTheme } from '../theme/ThemeProvider';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Her sekme için hedef ekranları tanımlıyoruz
const TabToScreen = {
    HomeTab: 'VideoList',
    CutTab: 'VideoCut'
};

// Hangi ekranların hangi sekmeye ait olduğunu belirtiyoruz
const ScreenToTab = {
    'VideoList': 'HomeTab',
    'VideoCut': 'CutTab',
    'VideoPlayer': 'HomeTab',
    'VideoCropper': 'CutTab',
    'MetadataForm': 'CutTab'
};

const Tab = createBottomTabNavigator();

export function TabNavigator() {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('HomeTab');

    // Mevcut route'un hangi tab'a ait olduğunu belirleyen fonksiyon
    const getTabFromRouteName = (routeName) => {
        return ScreenToTab[routeName] || 'HomeTab';
    };

    // Route state'inden aktif ekran adını çıkartan fonksiyon
    const getActiveScreenName = (state) => {
        if (!state || !state.routes) return null;

        const route = state.routes[state.index];

        // Eğer nested navigator varsa, onun içindeki aktif route'u bul
        if (route.state) {
            return getActiveScreenName(route.state);
        }

        return route.name;
    };

    return (
        // @ts-ignore - Missing children prop issue
        <Tab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                headerShown: false,
                // Global renk tanımlarını kaldırıyoruz, her tab kendi rengini belirleyecek
                tabBarStyle: {
                    backgroundColor: colors.background.primary,
                    borderTopColor: typeof colors.border === 'object' ? colors.border.light : colors.border,
                },
            }}
            screenListeners={({ navigation }) => ({
                state: (e) => {
                    // NavigationContainer state değiştiğinde
                    const state = e.data.state;
                    const homeStackRoute = state.routes.find(r => r.name === 'HomeStack');

                    if (homeStackRoute && homeStackRoute.state) {
                        const currentScreenName = getActiveScreenName(homeStackRoute.state);
                        if (currentScreenName) {
                            const tabName = getTabFromRouteName(currentScreenName);
                            setActiveTab(tabName);
                        }
                    }
                }
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Ana Sayfa',
                    // Bu tab aktifse primary rengi, değilse secondary rengi kullan
                    tabBarActiveTintColor: activeTab === 'HomeTab' ? '#000000' : '#808080',
                    tabBarInactiveTintColor: '#808080',
                    tabBarIcon: ({ focused, size }) => {
                        const isActive = activeTab === 'HomeTab';
                        return <Ionicons
                            name={isActive ? 'home' : 'home-outline'}
                            size={size}
                            color={isActive ? '#000000' : '#808080'}
                        />;
                    },
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        setActiveTab('HomeTab');
                        navigation.navigate('VideoList');
                    },
                })}
            />
            <Tab.Screen
                name="CutTab"
                component={HomeStack}
                options={{
                    title: 'Video Kırp',
                    // Bu tab aktifse primary rengi, değilse secondary rengi kullan
                    tabBarActiveTintColor: activeTab === 'CutTab' ? '#000000' : '#808080',
                    tabBarInactiveTintColor: '#808080',
                    tabBarIcon: ({ focused, size }) => {
                        const isActive = activeTab === 'CutTab';
                        return <Ionicons
                            name={isActive ? 'cut' : 'cut-outline'}
                            size={size}
                            color={isActive ? '#000000' : '#808080'}
                        />;
                    },
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        setActiveTab('CutTab');
                        navigation.navigate('VideoCut');
                    },
                })}
            />
        </Tab.Navigator>
    );
} 