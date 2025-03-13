import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from 'react-native-reanimated';

interface VideoSelectModalProps {
    visible: boolean;
    onClose: () => void;
    onVideoSelect: (uri: string) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function VideoSelectModal({
    visible,
    onClose,
    onVideoSelect,
}: VideoSelectModalProps) {
    const { colors } = useTheme();
    const { height } = useWindowDimensions();

    const handlePickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            onVideoSelect(result.assets[0].uri);
            onClose();
        }
    };

    const handleRecordVideo = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            onVideoSelect(result.assets[0].uri);
            onClose();
        }
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                    styles.overlay,
                    { backgroundColor: colors.card.shadow }
                ]}
            >
                <Pressable style={styles.dismissArea} onPress={onClose} />
                <AnimatedView
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={[
                        styles.content,
                        { backgroundColor: colors.card.background }
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Yeni Video Ekle
                    </Text>
                    <Pressable
                        style={[styles.option, { borderColor: colors.border.light }]}
                        onPress={handlePickVideo}
                    >
                        <Ionicons
                            name="images-outline"
                            size={24}
                            color={'#000000'}
                        />
                        <Text style={[styles.optionText, { color: colors.text.primary }]}>
                            Galeriden Seç
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.option, { borderColor: colors.border.light }]}
                        onPress={handleRecordVideo}
                    >
                        <Ionicons
                            name="camera-outline"
                            size={24}
                            color={'#000000'}
                        />
                        <Text style={[styles.optionText, { color: colors.text.primary }]}>
                            Video Çek
                        </Text>
                    </Pressable>
                </AnimatedView>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dismissArea: {
        flex: 1,
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 48,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
}); 