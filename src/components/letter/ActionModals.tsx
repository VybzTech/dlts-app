import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { colors } from "@/src/styles/theme/colors";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

// Modal for Marking as Delivered with POD
export const DeliveryModal: React.FC<ModalProps & { initialData?: any }> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const [recipientName, setRecipientName] = useState(
    initialData?.recipientName || "",
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [podImage, setPodImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!recipientName.trim()) {
      Alert.alert("Validation Error", "Recipient name is required");
      return;
    }

    try {
      await onSubmit({
        recipientName,
        notes,
        podImage,
      });
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to mark as delivered");
    }
  };

  const resetForm = () => {
    setRecipientName("");
    setNotes("");
    setPodImage(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mark as Delivered</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Recipient Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Recipient Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipient name"
                value={recipientName}
                onChangeText={setRecipientName}
                editable={!isLoading}
              />
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Delivery Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any delivery notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                editable={!isLoading}
              />
            </View>

            {/* POD Image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Proof of Delivery (POD)</Text>
              <TouchableOpacity style={styles.imagePickerBtn}>
                <Text style={styles.imagePickerText}>📸 Take Photo</Text>
              </TouchableOpacity>
              {podImage && (
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: podImage }}
                    style={styles.previewImage}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={() => {
                resetForm();
                onClose();
              }}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.submitBtn]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Confirm Delivery</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Modal for Declining Delivery with Reason
export const DeclineModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert("Validation Error", "Reason for decline is required");
      return;
    }

    try {
      await onSubmit({ reason });
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to mark as undelivered");
    }
  };

  const resetForm = () => {
    setReason("");
  };

  const commonReasons = [
    "Address not found",
    "Recipient unavailable",
    "Recipient refused",
    "Invalid address",
    "No access to location",
    "Recipient deceased",
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Decline Delivery</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Reason Required */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Reason for Decline *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe why you're declining this delivery"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                editable={!isLoading}
              />
            </View>

            {/* Quick Reasons */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quick Select</Text>
              <View style={styles.quickReasonsContainer}>
                {commonReasons.map((r, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.quickReasonBtn,
                      reason === r && styles.quickReasonBtnActive,
                    ]}
                    onPress={() => setReason(r)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.quickReasonText,
                        reason === r && styles.quickReasonTextActive,
                      ]}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={() => {
                resetForm();
                onClose();
              }}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.dangerBtn]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Mark Undelivered</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Modal for Confirming In Transit
export const InTransitModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const handleSubmit = async () => {
    try {
      await onSubmit({});
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to mark as in transit");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmIcon}>
            <Text style={styles.confirmIconText}>🚚</Text>
          </View>

          <Text style={styles.confirmTitle}>Start Delivery?</Text>
          <Text style={styles.confirmMessage}>
            Mark this letter as in transit. You'll be unable to edit delivery
            details once started.
          </Text>

          <View style={styles.confirmFooter}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.submitBtn]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Start Transit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  confirmModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 48,
    padding: 24,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  closeBtn: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalContent: {
    padding: 20,
    maxHeight: "70%",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagePickerBtn: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: colors.primary + "10",
  },
  imagePickerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  imagePreview: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  quickReasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickReasonBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  quickReasonBtnActive: {
    backgroundColor: colors.primary,
  },
  quickReasonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  quickReasonTextActive: {
    color: "#fff",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  confirmFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  confirmIcon: {
    marginBottom: 16,
  },
  confirmIconText: {
    fontSize: 48,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  confirmMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
  },
  cancelBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: colors.primary,
  },
  dangerBtn: {
    backgroundColor: colors.error,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
