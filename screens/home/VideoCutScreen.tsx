import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { VideoSelectModal } from '../../components/video/VideoSelectModal';
import { Header } from '../../components/home/components';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type VideoCutScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoCut'>;

const { width } = Dimensions.get('window');
// Ekranın 80% genişliğinde bir kutu
const BOX_WIDTH = width * 0.8;
// 16:9 oranı için yükseklik
const BOX_HEIGHT = BOX_WIDTH * 9 / 16;

export function VideoCutScreen({ navigation }: VideoCutScreenProps) {
    const { colors, isDark } = useTheme();
    const [isModalVisible, setModalVisible] = React.useState(false);

    const handleVideoSelect = (uri: string) => {
        navigation.navigate('VideoCropper', { uri });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <Header
                title="Video Kırp"
                subtitle="Videonu seç ve düzenle"
            />

            <Animated.View
                style={styles.contentContainer}
                entering={FadeIn.delay(300)}
            >
                <Text style={[styles.instructions, { color: colors.text.secondary }]}>
                    Düzenlemek istediğin videoyu seçmek için aşağıdaki alana dokun
                </Text>

                <Pressable
                    style={[styles.box, { backgroundColor: colors.background.secondary }]}
                    onPress={() => setModalVisible(true)}
                >
                    <BlurView
                        intensity={10}
                        style={styles.blurContainer}
                        tint={isDark ? 'dark' : 'light'}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="videocam"
                                size={48}
                                color={'#000000'}
                            />
                            <Text style={[styles.selectText, { color: colors.text.primary }]}>
                                Video Seç
                            </Text>
                        </View>
                    </BlurView>
                </Pressable>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <Ionicons name="cut-outline" size={24} color={'#000000'} />
                        <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                            Videoları Kırp
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="play-outline" size={24} color={'#000000'} />
                        <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                            Anında Önizle
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="save-outline" size={24} color={'#000000'} />
                        <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                            Günlüğüne Kaydet
                        </Text>
                    </View>
                </View>
            </Animated.View>

            <VideoSelectModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onVideoSelect={handleVideoSelect}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.8,
    },
    box: {
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    blurContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 48,
    },
    featureItem: {
        alignItems: 'center',
        width: '30%',
    },
    featureText: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
}); 