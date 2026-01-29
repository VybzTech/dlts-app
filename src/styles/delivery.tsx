import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const deliveryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
  },
  header: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.25,
    color: colors.text,
    marginBottom: 16,
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 8,
    // paddingHorizontal: 8,
    // paddingVertical: 12,
  },
  // statCard: {
  //   flex: 1,
  //   backgroundColor: colors.white,
  //   borderRadius: 12,
  //   // padding: 12,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 2,
  //   elevation: 1,
  // },
  // statCardActive: {
  //   backgroundColor: colors.primary,
  //   borderWidth: 0,
  // },
  // statNumber: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   color: colors.text,
  //   marginTop: 4,
  // },
  // statNumberActive: {
  //   color: colors.white,
  // },
  // statLabel: {
  //   fontSize: 11,
  //   color: colors.textSecondary,
  //   marginTop: 2,
  // },
  // statLabelActive: {
  //   color: colors.white,
  // },
  // filterContainer: {
  //   flexDirection: "row",
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   gap: 8,
  // },
  // filterTab: {
  //   paddingHorizontal: 14,
  //   paddingVertical: 6,
  //   borderRadius: 20,
  //   backgroundColor: colors.white,
  //   borderWidth: 1,
  //   borderColor: colors.border,
  // },
  // filterTabActive: {
  //   backgroundColor: colors.primary,
  //   borderColor: colors.primary,
  // },
  // filterTabText: {
  //   fontSize: 12,
  //   color: colors.textSecondary,
  //   fontWeight: "500",
  // },
  // filterTabTextActive: {
  //   color: colors.white,
  // },
  // listContent: {
  //   padding: 16,
  //   paddingTop: 4,
  // },
  // deliveryCard: {
  //   backgroundColor: colors.white,
  //   borderRadius: 12,
  //   padding: 14,
  //   marginBottom: 12,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 3,
  //   elevation: 2,
  // },
  // cardHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 10,
  // },
  // headerLeft: {
  //   flex: 1,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 10,
  // },
  // headerTextContent: {
  //   flex: 1,
  // },
  // scheduleId: {
  //   fontSize: 12,
  //   fontWeight: "600",
  //   color: colors.textSecondary,
  // },
  // companyName: {
  //   fontSize: 15,
  //   fontWeight: "600",
  //   color: colors.text,
  //   marginTop: 2,
  // },
  // cardBody: {
  //   gap: 10,
  // },
  // addressRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 6,
  // },
  // address: {
  //   flex: 1,
  //   fontSize: 13,
  //   color: colors.textSecondary,
  // },
  // cardFooter: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // lgaBadge: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 4,
  //   backgroundColor: colors.background,
  // },
  // lgaText: {
  //   fontSize: 11,
  //   color: colors.textSecondary,
  //   fontWeight: "500",
  // },
  // priorityBadge: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 4,
  // },
  // priorityText: {
  //   fontSize: 11,
  //   fontWeight: "600",
  // },
});

export const statsStyles = StyleSheet.create({
  cardWrapper: {
    flexWrap: "wrap",
    marginBottom: 18,
  },
  card: {
    // flex: 1,
    marginHorizontal: 5,
    // marginVertical: 8,
    // paddingVertical: 16,
    // paddingHorizontal: 12,
    borderRadius: 12,
    // justifyContent: "center",
    // alignItems: "center",
    // minHeight: 110,
    minWidth: 110,
    shadowColor: "#00ff66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    // shadowRadius: 4,
    // elevation: 3,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export const cardStyles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerContent: {
    flex: 1,
  },
  scheduleId: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  companyName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginTop: 2,
  },
  body: {
    gap: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lgaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  lgaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
