import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import Animated, {
    FadeInDown,
    FadeOutDown,
} from 'react-native-reanimated';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const metadataSchema = z.object({
    title: z.string()
        .min(3, 'Başlık en az 3 karakter olmalıdır')
        .max(50, 'Başlık en fazla 50 karakter olabilir'),
    description: z.string()
        .min(10, 'Açıklama en az 10 karakter olmalıdır')
        .max(200, 'Açıklama en fazla 200 karakter olabilir'),
});

type MetadataFormData = z.infer<typeof metadataSchema>;

interface MetadataFormProps {
    onSubmit: (data: MetadataFormData) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MetadataForm({ onSubmit }: MetadataFormProps) {
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Animated.View
                entering={FadeInDown.delay(100)}
                style={styles.formContainer}
            >
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Video Detayları
                </Text>

                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Başlık
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        color: colors.text.primary,
                                        borderColor: errors.title
                                            ? '#ef4444'
                                            : colors.border.light,
                                    },
                                ]}
                                value={value}
                                onChangeText={onChange}
                                placeholder="Video başlığını girin"
                                placeholderTextColor={colors.text.tertiary}
                            />
                            {errors.title && (
                                <Text style={styles.errorText}>{errors.title.message}</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Açıklama
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.textArea,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        color: colors.text.primary,
                                        borderColor: errors.description
                                            ? '#ef4444'
                                            : colors.border.light,
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
                            {errors.description && (
                                <Text style={styles.errorText}>
                                    {errors.description.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                <AnimatedPressable
                    entering={FadeInDown.delay(300)}
                    style={[
                        styles.submitButton,
                        { backgroundColor: colors.primary },
                    ]}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={styles.submitButtonText}>Kaydet</Text>
                </AnimatedPressable>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        paddingTop: 12,
        paddingBottom: 12,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginTop: 4,
    },
    submitButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
}); 