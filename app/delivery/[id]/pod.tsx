import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import SignatureCanvas from 'react-native-signature-canvas';
import { useDeliveryStore } from '../../../src/store/deliveryStore';
import { api } from '../../../src/services/api';
import { LoadingSpinner } from '../../../src/components/common/LoadingSpinner';
import { colors } from '../../../src/theme/colors';
import type { Delivery, PODData } from '../../../src/types';

export default function PODScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deliveries, addPODToDelivery } = useDeliveryStore();
  const signatureRef = useRef<any>(null);

  const [delivery, setDelivery] = useState<Delivery | null>(
    deliveries.find((d) => d.id === id) || null
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignature = (sig: string) => {
    setSignature(sig);
    setShowSignaturePad(false);
  };

  const handleClearSignature = () => {
    signatureRef.current?.clearSignature();
  };

  const handleTakePhoto = async () => {
    if (photos.length >= 3) {
      Alert.alert('Limit Reached', 'You can only take up to 3 photos');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhotos([...photos, base64]);
    }
  };

  const handleChooseFromGallery = async () => {
    if (photos.length >= 3) {
      Alert.alert('Limit Reached', 'You can only select up to 3 photos');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
      base64: true,
      selectionLimit: 3 - photos.length,
    });

    if (!result.canceled) {
      const newPhotos = result.assets
        .filter((asset) => asset.base64)
        .map((asset) => `data:image/jpeg;base64,${asset.base64}`);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!recipientName.trim()) {
      Alert.alert('Required', 'Please enter the recipient name');
      return;
    }

    if (!signature) {
      Alert.alert('Required', 'Please capture the recipient signature');
      return;
    }

    if (photos.length === 0) {
      Alert.alert(
        'No Photos',
        'Are you sure you want to submit without photos?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: submitPOD },
        ]
      );
      return;
    }

    submitPOD();
  };

  const submitPOD = async () => {
    setIsSubmitting(true);

    try {
      // Get current location
      let location = { latitude: 0, longitude: 0 };
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          location = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
        }
      } catch (e) {
        console.log('Could not get location:', e);
      }

      const podData: PODData = {
        deliveryId: id,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim() || undefined,
        signature: signature!,
        photos,
        notes: notes.trim() || undefined,
        timestamp: new Date().toISOString(),
        location,
      };

      await api.submitPOD(podData);
      addPODToDelivery(id, podData);

      Alert.alert('Success', 'Proof of Delivery submitted successfully', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit POD. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!delivery) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Proof of Delivery' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Delivery Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Information</Text>
          <Text style={styles.companyName}>{delivery.companyName}</Text>
          <Text style={styles.address}>{delivery.destination}</Text>
        </View>

        {/* Recipient Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recipient Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Recipient Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipient's full name"
              placeholderTextColor={colors.textLight}
              value={recipientName}
              onChangeText={setRecipientName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textLight}
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Signature */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Digital Signature <Text style={styles.required}>*</Text>
          </Text>

          {signature ? (
            <View style={styles.signaturePreviewContainer}>
              <Image
                source={{ uri: signature }}
                style={styles.signaturePreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => {
                  setSignature(null);
                  setShowSignaturePad(true);
                }}
              >
                <Ionicons name="refresh" size={16} color={colors.primary} />
                <Text style={styles.retakeText}>Retake Signature</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signatureButton}
              onPress={() => setShowSignaturePad(true)}
            >
              <Ionicons name="create-outline" size={32} color={colors.primary} />
              <Text style={styles.signatureButtonText}>Tap to Capture Signature</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Photos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Delivery Photos ({photos.length}/3)
          </Text>
          <Text style={styles.photoHint}>
            Take photos of the delivered items as proof
          </Text>

          {/* Photo Grid */}
          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close" size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Photo Buttons */}
          {photos.length < 3 && (
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={24} color={colors.white} />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handleChooseFromGallery}
              >
                <Ionicons name="images" size={24} color={colors.primary} />
                <Text style={styles.galleryButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any additional notes..."
            placeholderTextColor={colors.textLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={colors.white} />
              <Text style={styles.submitButtonText}>Complete Delivery</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Signature Modal */}
      <Modal visible={showSignaturePad} animationType="slide">
        <View style={styles.signatureModal}>
          <View style={styles.signatureHeader}>
            <TouchableOpacity onPress={() => setShowSignaturePad(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.signatureTitle}>Recipient's Signature</Text>
            <TouchableOpacity onPress={handleClearSignature}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.signatureInstructions}>
            Please sign in the box below
          </Text>

          <View style={styles.signatureCanvasContainer}>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={() => Alert.alert('Error', 'Please provide a signature')}
              descriptionText=""
              clearText="Clear"
              confirmText="Done"
              webStyle={`
                .m-signature-pad { box-shadow: none; border: none; }
                .m-signature-pad--body { border: none; }
                .m-signature-pad--footer { display: none; }
                body, html { height: 100%; }
              `}
              autoClear={false}
              backgroundColor={colors.white}
            />
          </View>

          <TouchableOpacity
            style={styles.doneSignatureButton}
            onPress={() => signatureRef.current?.readSignature()}
          >
            <Text style={styles.doneSignatureText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  required: {
    color: colors.danger,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  signatureButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  signatureButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  signaturePreviewContainer: {
    alignItems: 'center',
  },
  signaturePreview: {
    width: '100%',
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  retakeText: {
    color: colors.primary,
    fontSize: 14,
  },
  photoHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  galleryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  galleryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.success,
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
  // Signature Modal
  signatureModal: {
    flex: 1,
    backgroundColor: colors.white,
  },
  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 50,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signatureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearText: {
    color: colors.danger,
    fontSize: 16,
  },
  signatureInstructions: {
    textAlign: 'center',
    color: colors.textSecondary,
    padding: 16,
    fontSize: 14,
  },
  signatureCanvasContainer: {
    flex: 1,
    margin: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  doneSignatureButton: {
    backgroundColor: colors.success,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  doneSignatureText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
