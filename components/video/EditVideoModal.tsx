import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface EditVideoModalProps {
  visible: boolean;
  onClose: () => void;
  initialTitle: string;
  initialDescription: string;
  onSave: (newTitle: string, newDescription: string) => void;
}

export function EditVideoModal({
  visible,
  onClose,
  initialTitle,
  initialDescription,
  onSave,
}: EditVideoModalProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  // Eğer modal açıldığında ilk değerleri güncellemek isterseniz:
  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Başlık boş olamaz.');
      return;
    }
    onSave(title, description);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.background.primary }]}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Başlık</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border.light, color: colors.text.primary }]}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: colors.text.primary }]}>Açıklama</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border.light, color: colors.text.primary }]}
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, { backgroundColor: colors.border.light }]} onPress={onClose}>
              <Text style={{ color: colors.text.primary }}>İptal</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: '#000' }]} onPress={handleSave}>
              <Text style={{ color: 'white' }}>Kaydet</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
  },
});
