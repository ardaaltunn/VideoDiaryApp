import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import Animated, { FadeIn } from 'react-native-reanimated';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '../../components/home/components';
import { PhotoSelectModal } from '../../components/video/PhotoSelectModal';

const { width } = Dimensions.get('window');
const BOX_WIDTH = width * 0.8;

const metadataSchema = z.object({
  title: z
    .string()
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(50, 'Başlık en fazla 50 karakter olabilir'),
  description: z
    .string()
    .min(3, 'Açıklama en az 3 karakter olmalıdır')
    .max(200, 'Açıklama en fazla 200 karakter olabilir'),
});

type MetadataFormData = z.infer<typeof metadataSchema>;

interface MetadataFormProps {
  onSubmit: (data: MetadataFormData & { thumbnailUri: string }) => void;
  isProcessing?: boolean;
}

export function MetadataForm({ onSubmit, isProcessing }: MetadataFormProps) {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePhotoSelect = (uri: string) => {
    setThumbnailUri(uri);
  };

  const handleFormSubmit = (data: MetadataFormData) => {
    onSubmit({ ...data, thumbnailUri: thumbnailUri || '' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header title="Video Detayları" subtitle="Başlık ve açıklamasını ekle" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={styles.contentContainer} entering={FadeIn.delay(300)}>
            <Text style={[styles.instructions, { color: colors.text.secondary }]}>
              Videon için bir kapak fotoğrafı, başlık ve açıklama ekle
            </Text>

            <Pressable
              style={[styles.box, { backgroundColor: colors.background.secondary }]}
              onPress={() => setIsModalVisible(true)}
            >
              {thumbnailUri ? (
                <Image
                  source={{ uri: thumbnailUri }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.iconContainer}>
                  <Ionicons name="image-outline" size={48} color={colors.text.primary} />
                  <Text style={[styles.selectText, { color: colors.text.primary }]}>
                    Fotoğraf Seç
                  </Text>
                </View>
              )}
            </Pressable>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.secondary, paddingTop: 16 }]}>Başlık</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background.secondary,
                        color: colors.text.primary,
                        borderColor: errors.title ? '#ef4444' : colors.border.light,
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Video başlığını girin"
                    placeholderTextColor={colors.text.tertiary}
                  />
                )}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Açıklama</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      {
                        backgroundColor: colors.background.secondary,
                        color: colors.text.primary,
                        borderColor: errors.description ? '#ef4444' : colors.border.light,
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Video açıklamasını girin"
                    placeholderTextColor={colors.text.tertiary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description.message}</Text>
              )}
            </View>

            <Pressable
              style={[
                styles.submitButton,
                { backgroundColor: isProcessing ? '#666' : '#000' }
              ]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isProcessing}
            >
              <Text style={styles.submitButtonText}>
                {isProcessing ? 'İşleniyor...' : 'Kaydet'}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PhotoSelectModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onPhotoSelect={handlePhotoSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  contentContainer: { alignItems: 'center', paddingHorizontal: 20 },
  instructions: { fontSize: 16, textAlign: 'center', marginBottom: 32, opacity: 0.8 },
  box: {
    width: BOX_WIDTH,
    height: BOX_WIDTH * 0.5625,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  selectText: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  thumbnailImage: { width: '100%', height: '100%' },
  inputContainer: { marginBottom: 16, width: '100%' },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: { height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
  textArea: { height: 100, paddingTop: 12, paddingBottom: 12 },
  errorText: { color: '#ef4444', fontSize: 14, marginTop: 4 },
  submitButton: { height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 24, width: '100%' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
