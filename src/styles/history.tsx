import { StyleSheet } from "react-native";
import { colors } from "./theme/colors";

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingTop: 12,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyText: {
    flex: 1,
  },
  historySchedule: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  historyCompany: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    marginTop: 2,
  },
});
