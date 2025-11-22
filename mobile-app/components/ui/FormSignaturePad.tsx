import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Signature from 'react-native-signature-canvas';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  border: '#dee2e6',
};

interface FormSignaturePadProps {
  onSignatureCaptured: (signatureUri: string) => void;
  currentSignature?: string;
}

export default function FormSignaturePad({ onSignatureCaptured, currentSignature }: FormSignaturePadProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const signatureRef = useRef<any>(null);

  const handleSignature = (signature: string) => {
    // A assinatura vem como base64, vamos salvar
    onSignatureCaptured(signature);
    setModalVisible(false);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  // Estilo personalizado para o canvas de assinatura
  const style = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      background-color: ${SIOB_COLORS.white};
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--body canvas {
      border-radius: 8px;
      border: 2px dashed ${SIOB_COLORS.border};
    }
    .m-signature-pad--footer {
      display: none;
    }
    body, html {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Assinatura Digital (Testemunha / Vítima)</Text>

      {currentSignature ? (
        <View style={styles.signaturePreview}>
          <View style={styles.signaturePlaceholder}>
            <MaterialIcons name="check-circle" size={32} color={SIOB_COLORS.primary} />
            <Text style={styles.signatureText}>Assinatura Capturada</Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onSignatureCaptured('');
              setModalVisible(false);
            }}
          >
            <MaterialIcons name="delete" size={16} color={SIOB_COLORS.white} />
            <Text style={styles.clearButtonText}>Limpar Assinatura</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.signatureButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="draw" size={32} color={SIOB_COLORS.primary} />
          <Text style={styles.signatureButtonText}>Toque para assinar</Text>
          <Text style={styles.signatureDescription}>Assinatura digital do responsável</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Assinatura Digital</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={SIOB_COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.signatureContainer}>
            <Signature
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={handleEmpty}
              descriptionText=""
              clearText=""
              confirmText=""
              webStyle={style}
              autoClear={false}
              imageType="image/png"
              penColor="black"
              backgroundColor={SIOB_COLORS.white}
              style={styles.signatureCanvas}
            />
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Assine no espaço acima usando seu dedo
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={handleClear}>
              <MaterialIcons name="refresh" size={20} color={SIOB_COLORS.text} />
              <Text style={styles.modalButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={20} color={SIOB_COLORS.text} />
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <MaterialIcons name="check" size={20} color={SIOB_COLORS.white} />
              <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 12,
  },
  signatureButton: {
    backgroundColor: SIOB_COLORS.white,
    borderWidth: 2,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  signatureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: SIOB_COLORS.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  signatureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  signaturePreview: {
    alignItems: 'center',
  },
  signaturePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderStyle: 'dashed',
    gap: 8,
  },
  signatureText: {
    fontSize: 16,
    color: SIOB_COLORS.primary,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  clearButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: SIOB_COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
  },
  signatureContainer: {
    flex: 1,
    margin: 16,
  },
  signatureCanvas: {
    flex: 1,
    height: 300,
  },
  instructions: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: SIOB_COLORS.border,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
    backgroundColor: SIOB_COLORS.white,
    gap: 6,
  },
  confirmButton: {
    backgroundColor: SIOB_COLORS.primary,
    borderColor: SIOB_COLORS.primary,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: SIOB_COLORS.text,
  },
  confirmButtonText: {
    color: SIOB_COLORS.white,
  },
});