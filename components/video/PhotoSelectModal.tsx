// PhotoSelectModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Alert,
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

interface PhotoSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoSelect: (uri: string) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function PhotoSelectModal({
  visible,
  onClose,
  onPhotoSelect,
}: PhotoSelectModalProps) {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();

  const handlePickPhotoFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriye erişim izni verilmedi.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onPhotoSelect(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Galeri fotoğraf seçme hatası:', error);
      Alert.alert('Hata', 'Fotoğraf seçilirken bir sorun oluştu.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera erişim izni verilmedi.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onPhotoSelect(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Kamera fotoğraf çekme hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekilirken bir sorun oluştu.');
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
          { backgroundColor: colors.card.shadow },
        ]}
      >
        {/* Modal kapatma alanı (arka plan) */}
        <Pressable style={styles.dismissArea} onPress={onClose} />

        {/* Asıl içerik */}
        <AnimatedView
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[
            styles.content,
            { backgroundColor: colors.card.background },
          ]}
        >
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Yeni Fotoğraf Ekle
          </Text>

          <Pressable
            style={[styles.option, { borderColor: colors.border.light }]}
            onPress={handlePickPhotoFromGallery}
          >
            <Ionicons
              name="images-outline"
              size={24}
              color={colors.text.primary}
            />
            <Text style={[styles.optionText, { color: colors.text.primary }]}>
              Galeriden Seç
            </Text>
          </Pressable>

          <Pressable
            style={[styles.option, { borderColor: colors.border.light }]}
            onPress={handleTakePhoto}
          >
            <Ionicons
              name="camera-outline"
              size={24}
              color={colors.text.primary}
            />
            <Text style={[styles.optionText, { color: colors.text.primary }]}>
              Fotoğraf Çek
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
