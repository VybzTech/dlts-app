import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLetterStore } from "@/store/letterStore";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { getFullImageUrl } from "@/src/api/config/axios.config";

export default function CourierLetterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { letters, fetchLetters, markAsInTransit, markAsDelivered } =
    useLetterStore();

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [podImage, setPodImage] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const letter = useMemo(() => letters.find((l) => l.id === id), [letters, id]);

  useEffect(() => {
    if (!letter) fetchLetters();
  }, [id]);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission",
        "Camera access is required to take a POD photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPodImage(asset.uri); // Store the URI directly
    }
  };

  const handleStartDelivery = async () => {
    setIsActionLoading(true);
    try {
      await markAsInTransit(id);
      Alert.alert("Success", "Letter marked as In-Transit");
    } catch (e) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const submitDelivery = async () => {
    if (!podImage) {
      Alert.alert("Error", "Please take a photo of the signed document.");
      return;
    }
    if (!recipientName.trim()) {
      Alert.alert("Error", "Please enter the recipient's name.");
      return;
    }

    setIsActionLoading(true);
    try {
      await markAsDelivered(id, {
        podImageUri: podImage,
        recipientName: recipientName,
        notes: deliveryNotes,
      });
      setShowDeliveryModal(false);
      setPodImage(null);
      setRecipientName("");
      Alert.alert("Success", "Letter delivered and POD uploaded.");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Failed to upload delivery proof.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!letter) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  console.log(letter.liabilityValue.toLocaleString());

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#1E3A8A", "#1E40AF"]} style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Delivery Detail</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>
      {/* Priority Badge */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: "rgba(180,180,180,0.1)",
              borderColor: "rgba(180,180,180,0.3)",
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.text + "A0" }]}>
            ID: {letter.trackingId}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                letter.priority === "HIGH"
                  ? colors.danger + "20"
                  : colors.primary + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color:
                  letter.priority === "HIGH" ? colors.danger : colors.primary,
              },
            ]}
          >
            {letter.priority} Priority
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.parcelCard}>
          <View style={styles.parcelRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text style={styles.parcelSubject}>{letter.subject}</Text>
          </View>
          <View style={styles.parcelStats}>
            <View style={styles.parcelStat}>
              <Text style={styles.statLabel}>Value</Text>
              <Text style={styles.statValue}>
                ₦{Number(letter?.liabilityValue || 0).toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statDivider, { marginHorizontal: 15 }]} />
            <View style={styles.parcelStat}>
              <Text style={styles.statLabel}>Year</Text>
              <Text style={styles.statValue}>{letter.liabilityYear}</Text>
            </View>
          </View>
        </View>
        {/* Parcel Details */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.dropoffCompany}>{letter.recipientName}</Text>
          <Text style={styles.dropoffLabel}>Receiving Entity</Text>
          <View style={styles.divider} />
          <View style={styles.dropoffHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={20} color={colors.white} />
            </View>
            <View>
              <Text style={styles.dropoffCompany}>
                {letter.recipientAddress}
              </Text>
              <Text style={styles.dropoffLabel}>Drop-off Address</Text>
            </View>
          </View>
          {/* <View style={styles.infoWrapper}>
        </View> */}
          <View style={styles.addressSection}>
            <View style={styles.lgaRow}>
              <Ionicons name="map-outline" size={16} color={colors.primary} />
              <Text style={styles.lgaText}>
                {letter.lgaAddress} Local Gov't Area
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { marginVertical: 20 }]} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date Assigned</Text>
              <Text style={styles.metaValue}>
                {letter.assignedAt
                  ? new Date(letter.assignedAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValue}>
                {letter.assignedAt
                  ? new Date(letter.assignedAt).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Recently"}
              </Text>
            </View>
          </View>
        </View>

        {letter.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Special Instructions</Text>
            <Text style={styles.notesText}>{letter.notes}</Text>
          </View>
        )}

        {/* Delivery Status Timeline Placeholder */}
        {/* <View style={styles.statusBox}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(letter.status) },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusCurrent}>
              Current Status: {letter.status.replace("_", " ")}
            </Text>
            <Text style={styles.statusTime}>
              Keep the sender updated by changing status
            </Text>
          </View>
        </View> */}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Section */}
      <View style={styles.actionFixed}>
        {letter.status === "Assigned" && (
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={handleStartDelivery}
            disabled={isActionLoading}
          >
            <Text style={styles.actionText}>
              {isActionLoading ? "Processing..." : "Mark as In-Transit"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {letter.status === "In_Transit" && (
          <TouchableOpacity
            style={[styles.primaryAction, { backgroundColor: colors.success }]}
            onPress={() => setShowDeliveryModal(true)}
          >
            <Text style={styles.actionText}>Complete Delivery</Text>
            <Ionicons name="checkmark-done" size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {letter.status === "Delivered" && (
          <View>
            <View style={styles.deliveredAck}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.ackText}>
                Delivery Completed Successfully
              </Text>
            </View>
            {letter.podImagePath && (
              <View style={styles.podPreviewContainer}>
                <Text style={styles.podPreviewTitle}>Capture Summary</Text>
                <Image
                  source={{ uri: getFullImageUrl(letter.podImagePath) || "" }}
                  style={styles.podPreviewImage}
                  resizeMode="cover"
                />
                <Text style={styles.deliveredByText}>
                  Receiver: {letter.receivedBy || letter.recipientName}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Delivery Completion Modal */}
      <Modal visible={showDeliveryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Proof of Delivery</Text>
              <TouchableOpacity onPress={() => setShowDeliveryModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.photoSection}>
                {podImage ? (
                  <View style={styles.capturedPhotoWrapper}>
                    <Image
                      source={{ uri: podImage }}
                      style={styles.capturedPhoto}
                    />
                    <TouchableOpacity
                      style={styles.retakeBtn}
                      onPress={takePhoto}
                    >
                      <Text style={styles.retakeText}>Retake Photo</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.takePhotoBtn}
                    onPress={takePhoto}
                  >
                    <Ionicons name="camera" size={40} color={colors.primary} />
                    <Text style={styles.takePhotoText}>
                      Take Photo of Signed Doc
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Receiver's Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="FullName of recipient"
                  value={recipientName}
                  onChangeText={setRecipientName}
                />

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>
                  Delivery Notes (Optional)
                </Text>
                <TextInput
                  style={[styles.input, { height: 80, paddingTop: 12 }]}
                  placeholder="Additional details..."
                  multiline
                  value={deliveryNotes}
                  onChangeText={setDeliveryNotes}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitDeliveryBtn,
                  isActionLoading && { opacity: 0.7 },
                ]}
                onPress={submitDelivery}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Text style={styles.actionText}>Submit Delivery</Text>
                    <Ionicons
                      name="checkmark-done"
                      size={20}
                      color={colors.white}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Assigned":
      return colors.info;
    case "In_Transit":
      return colors.warning;
    case "Delivered":
      return colors.success;
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingBottom: 26,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    // marginTop: -15,
    marginVertical: 10,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  dropoffHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  infoWrapper: {
    // flexDirection: "column",
    // alignItems: "flex-start",
    // gap: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  dropoffCompany: {
    fontSize: 19,
    letterSpacing: 0.1,
    fontFamily: "Poppins_600SemiBold",
    fontWeight: "700",
    color: colors.text,
  },
  dropoffLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary + "C0",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
    marginHorizontal: 24,
  },
  addressSection: {
    paddingLeft: 4,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontWeight: "600",
  },
  lgaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  lgaText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  parcelCard: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  parcelRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  parcelSubject: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  parcelStats: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  parcelStat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#F1F5F9",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  statusBox: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusCurrent: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  statusTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notesBox: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#92400E",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#B45309",
    lineHeight: 20,
  },
  actionFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(248, 250, 252, 0.9)",
    paddingBottom: 40,
  },
  primaryAction: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  actionText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  deliveredAck: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#ECFDF5",
    paddingVertical: 15,
    borderRadius: 16,
  },
  ackText: {
    color: colors.success,
    fontWeight: "700",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  photoSection: {
    marginBottom: 24,
  },
  takePhotoBtn: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: colors.primary + "8F",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  takePhotoText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  capturedPhotoWrapper: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  capturedPhoto: {
    width: "100%",
    height: "100%",
  },
  retakeBtn: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retakeText: {
    color: colors.white,
    fontWeight: "700",
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  submitDeliveryBtn: {
    backgroundColor: colors.success,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  podPreviewContainer: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  podPreviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 12,
  },
  podPreviewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  deliveredByText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
});
