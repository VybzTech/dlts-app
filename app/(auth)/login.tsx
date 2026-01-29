// /app/(auth)/login

import LoginScreen from "@/src/screens/auth/LoginScreen";
import { api } from "@/src/services/api";
import { loginStyles } from "@/src/styles/login";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function AuthLoginScreen() {
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
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
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
      login(response.user, response.token);
      console.log(response.user);
      // Navigate to tabs after successful login
      // router.replace("/(tabs)");
      const roleRoutes = {
        courier: "/(courier)",
        admin: "/(admin)",
        mgt: "/(mgt)",
      };

      router.replace(roleRoutes[response.user.role]);
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
        <LoginScreen
          errors={errors}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          handleLogin={handleLogin}
          clearFieldError={clearFieldError}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
