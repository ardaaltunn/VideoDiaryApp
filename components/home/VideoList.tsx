import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
    useWindowDimensions,
    Platform,
} from 'react-native';
import { Card } from '../shared/Card';
import { useTheme } from '../../theme/ThemeProvider';
import Animated, {
    FadeInUp,
    FadeOutDown,
    interpolate,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export interface VideoItem {
    id: string;
    uri: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    createdAt: string;
}

interface VideoListProps {
    videos: VideoItem[];
    onVideoPress: (video: VideoItem) => void;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function VideoList({ videos, onVideoPress }: VideoListProps) {
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const cardWidth = width - 32;

    const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
        <AnimatedCard
            entering={FadeInUp.delay(index * 100)}
            exiting={FadeOutDown}
            onPress={() => onVideoPress(item)}
            style={[styles.card, { width: cardWidth }]}
        >
            <View style={styles.thumbnailContainer}>
                <Image
                    source={{ uri: item.thumbnail }}
                    style={[styles.thumbnail, { width: cardWidth }]}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'transparent']}
                    style={styles.thumbnailGradient}
                />
                <View style={styles.durationContainer}>
                    <BlurView intensity={30} tint="dark" style={styles.durationBadge}>
                        <Ionicons name="time-outline" size={12} color="white" style={styles.durationIcon} />
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </BlurView>
                </View>
            </View>

            <View style={[styles.infoContainer, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <BlurView
                        intensity={isDark ? 30 : 60}
                        tint={isDark ? "dark" : "light"}
                        style={styles.playButton}
                    >
                        <Ionicons
                            name="play"
                            size={16}
                            color={'#000000'}
                        />
                    </BlurView>
                </View>
                <Text
                    style={[styles.description, { color: colors.text.secondary }]}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
                        <Text style={[styles.meta, { color: colors.text.tertiary }]}>
                            {item.createdAt}
                        </Text>
                    </View>
                </View>
            </View>
        </AnimatedCard>
    );

    if (videos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <BlurView
                    intensity={isDark ? 30 : 60}
                    tint={isDark ? "dark" : "light"}
                    style={styles.emptyIconContainer}
                >
                    <Ionicons
                        name="videocam-outline"
                        size={32}
                        color={colors.primary}
                    />
                </BlurView>
                <Text style={[styles.emptyText, { color: colors.text.primary }]}>
                    Henüz video eklenmemiş
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
                    Yeni bir video eklemek için + butonuna tıklayın
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
    },
    separator: {
        height: 20,
    },
    thumbnailContainer: {
        position: 'relative',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    thumbnail: {
        height: 220,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    thumbnailGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    durationContainer: {
        position: 'absolute',
        right: 12,
        bottom: 12,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        overflow: 'hidden',
    },
    durationIcon: {
        marginRight: 4,
    },
    durationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    infoContainer: {
        padding: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
        marginRight: 12,
    },
    playButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    meta: {
        fontSize: 13,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 250,
    },
}); 