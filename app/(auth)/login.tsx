import { colors } from "@/src/theme/colors";
import { loginStyles } from "@/styles/login";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const { login } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const handleLogin = async () => {
    // Clear general error on new attempt
    setErrors((prev) => ({ ...prev, general: undefined }));

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login(email.trim(), password);
      login(response.user);
      // Navigate to tabs after successful login
      router.replace("/(tabs)");
    } catch (error: any) {
      setErrors({ general: error.message || "Invalid credentials" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={loginStyles.keyboardView}
      >
        <View style={loginStyles.header}>
          <Image
            source={require("@/assets/logo/lirs-logo.png")}
            style={{ width: 90, height: 90 }}
          />
          <Text style={loginStyles.title}>LIRS Courier</Text>
          <Text style={loginStyles.subtitle}>
            Document & Logistics Tracking System
          </Text>
        </View>

        <View style={loginStyles.form}>
          {/* General Error Message */}
          {errors.general && (
            <View style={[loginStyles.errorContainer, { justifyContent: "center", marginBottom: 12 }]}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={loginStyles.errorText}>{errors.general}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={loginStyles.inputWrapper}>
            {errors.email && (
              <View style={loginStyles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={loginStyles.errorText}>{errors.email}</Text>
              </View>
            )}
            <View
              style={[
                loginStyles.inputContainer,
                errors.email && loginStyles.inputContainerError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={errors.email ? colors.danger : colors.textSecondary}
                style={loginStyles.inputIcon}
              />
              <TextInput
                style={loginStyles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearFieldError("email");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={loginStyles.inputWrapper}>
            {errors.password && (
              <View style={loginStyles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={loginStyles.errorText}>{errors.password}</Text>
              </View>
            )}
            <View
              style={[
                loginStyles.inputContainer,
                errors.password && loginStyles.inputContainerError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? colors.danger : colors.textSecondary}
                style={loginStyles.inputIcon}
              />
              <TextInput
                style={loginStyles.input}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearFieldError("password");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={loginStyles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={{ marginTop: 12 }}
          >
            <LinearGradient
              colors={["#15a449", colors.primaryLight]}
              start={{ x: 0.35, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                loginStyles.loginButton,
                isLoading && loginStyles.loginButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={loginStyles.loginButtonText}>Log In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerText}>
            LIRS - DLTS
          </Text>
          <Text style={loginStyles.versionText}>Version 1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
