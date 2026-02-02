import { StyleSheet } from "react-native";
import { colors } from "./theme/colors";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  form: {
    gap: 4,
  },
  // Error message styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 4,
    minHeight: 20,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginLeft: 4,
  },
  inputWrapper: {
    gap: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    opacity: 1,
    backgroundColor: colors.primary,
  },
  loginButtonGradient: {
    // backgroundImage: linearGradient,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    borderRadius: 12,
  },
  loginButtonDisabled: {
    opacity: 0.7,
    backgroundColor: colors.primary,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 60,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  versionText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
});
