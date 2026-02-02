// /app/(auth)/login

import LoginScreen from "@/src/screens/auth/LoginScreen";
import { api } from "@/src/services/api";
import { loginStyles } from "@/src/styles/login";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuthStore } from "../../store/authStore";
import { User } from "@/src/types";

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
  const [user, setUser] = useState<User>();
  const router = useRouter();
  // const { login } = useAuthStore();

  const validateForm = (): boolean => {
    console.log(
      "Email value:",
      `"${email}"`,
      "Password value:",
      `"${password}"`,
    );

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

    console.log("newErrors object:", newErrors);
    console.log("Keys:", Object.keys(newErrors));
    console.log("Length:", Object.keys(newErrors).length);
    console.log("Is valid:", Object.keys(newErrors).length === 0);

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

  // // Navigate to tabs after successful login
  // // router.replace("/(tabs)");
  const roleRoutes: Record<string, string> = {
    Courier: "/(courier)",
    Admin: "/(admin)",
    ODU: "/(mgt)",
  };
  // const handleLogin = async () => {
  //   console.log(
  //     `Logging in via URL: `,
  //     api.login.toString,
  //     roleRoutes[user?.role as keyof typeof roleRoutes],
  //   );
  //   // Clear general error on new attempt
  //   setErrors((prev) => ({ ...prev, general: undefined }));

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await api.login(email.trim(), password);
  //     // login(response.user, response.token);
  //     console.log(response.user);
  //     // roleRoutes[user?.role as keyof typeof roleRoutes];
  //     setUser(response?.user);
  //     router.replace(roleRoutes[user.role as typeof roleRoutes]);
  //   } catch (error: any) {
  //     setErrors({ general: error.message || "Invalid credentials" });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async () => {
  setErrors((prev) => ({ ...prev, general: undefined }));

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  try {
    const response = await api.login(email.trim(), password);
    console.log(response.user);

    const route = roleRoutes[response.user.role];

    if (!route) {
      setErrors({ general: `Unknown role: ${response.user.role}` });
      return;
    }

    setUser(response.user);
    router.replace(route as any);
    console.log(`Logging in via URL: `, route);
  } catch (error: any) {
    // Log the full error object
    console.log("Full error object:", error);
    
    // Log specific Axios error properties
    if (error.response) {
      // Server responded with error status
      console.log("Error status:", error.response.status);
      console.log("Error data:", error.response.data);
      console.log("Error headers:", error.response.headers);
      setErrors({ general: error.response.data?.message || "Server error" });
    } else if (error.request) {
      // Request made but no response
      console.log("No response received:", error.request);
      setErrors({ general: "No response from server" });
    } else {
      // Error in request setup
      console.log("Error message:", error.message);
      setErrors({ general: error.message || "Invalid credentials" });
    }
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
