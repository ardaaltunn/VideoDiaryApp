import React from 'react';
import { MetadataForm } from '../../components/video/MetadataForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CutStackParamList } from '../../navigation/stacks/CutStack';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';

type MetadataFormScreenProps = NativeStackScreenProps<CutStackParamList, 'MetadataForm'>;

export function MetadataFormScreen({ route, navigation }: MetadataFormScreenProps) {
    const handleSubmit = async (data: any) => {
        try {
            // Burada FFMPEG ile video işlemesi ve metadata kaydetme yapılır
            console.log("Form submit edildi:", data);

            // Önce basit yönlendirme deneyelim
            const parent = navigation.getParent();
            console.log("Parent navigator:", parent?.getId());

            if (parent) {
                // Sadece ana sayfaya gitmeyi deneyelim
                console.log("HomeTab'e yönlendiriliyor");
                parent.navigate('HomeTab');

                // Alternatif olarak birkaç farklı yöntemi de deneyelim
                setTimeout(() => {
                    console.log("Alternatif yönlendirme deneniyor...");
                    try {
                        // 1. Doğrudan ana sayfaya gitmeyi dene
                        parent.reset({
                            index: 0,
                            routes: [{ name: 'HomeTab' }]
                        });
                    } catch (e) {
                        console.error("Reset hatası:", e);
                    }
                }, 500);
            } else {
                console.log("Parent navigator bulunamadı");
                // Geçerli navigation ile deneme yap
                navigation.popToTop();
                Alert.alert("Bilgi", "Ana sayfaya yönlendiriliyorsunuz");
            }
        } catch (error) {
            console.error("Navigation hatası:", error);
            Alert.alert("Hata", "Yönlendirme sırasında bir hata oluştu");
        }
    };

    return <MetadataForm onSubmit={handleSubmit} />;
} 