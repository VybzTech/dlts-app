import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function HelpScreen() {
  const router = useRouter();

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About DLTS</Text>
          <Text style={styles.aboutText}>
            The Document & Logistics Tracking System (DLTS) is a
            state-of-the-art solution designed for LIRS to streamline the
            delivery and tracking of official correspondence and sensitive
            document logistics.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courier Functions</Text>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="scan-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureLabel}>Letter Acceptance</Text>
              <Text style={styles.featureDesc}>
                Scan and accept letters assigned to your unit from the ODU.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons
                name="camera-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureLabel}>Proof of Delivery (POD)</Text>
              <Text style={styles.featureDesc}>
                Capture images of signed delivery notes to confirm delivery
                instantly.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="map-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureLabel}>Real-time Tracking</Text>
              <Text style={styles.featureDesc}>
                Change status to "In-Transit" to keep stakeholders informed of
                progress.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.supportCard}>
            <Text style={styles.supportHint}>
              Reach out to our technical team for assistance or password issues:
            </Text>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleEmail("etaxinfo@lirs.net")}
            >
              <Ionicons name="mail" size={22} color={colors.primary} />
              <View>
                <Text style={styles.contactLabel}>E-Tax Support</Text>
                <Text style={styles.contactValue}>etaxinfo@lirs.net</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactItem, { marginTop: 16 }]}
              onPress={() => handleEmail("helpdesk@lirs.net")}
            >
              <Ionicons name="mail" size={22} color={colors.primary} />
              <View>
                <Text style={styles.contactLabel}>Help Desk</Text>
                <Text style={styles.contactValue}>helpdesk@lirs.net</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Developed by LIRS ICT Directorate
          </Text>
          <Text style={styles.versionText}>DLTS Mobile • Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  supportHint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 4,
  },
  contactLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
  },
  versionText: {
    fontSize: 12,
    color: "#CBD5E1",
    marginTop: 4,
  },
});
