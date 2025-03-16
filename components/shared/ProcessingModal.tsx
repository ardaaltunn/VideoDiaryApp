import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ProcessingModalProps {
  visible: boolean;
  onRequestClose?: () => void;
}

export function ProcessingModal({ visible, onRequestClose }: ProcessingModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
          <ActivityIndicator size="large" color={'#000'} />
          <Text style={[styles.text, { color: colors.text.primary }]}>
            Videonuz işleniyor, lütfen bekleyin...
          </Text>
          {onRequestClose && (
            <Pressable onPress={onRequestClose} style={styles.closeButton}>
              <Text style={{ color: 'white' }}>İptal</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 260,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
