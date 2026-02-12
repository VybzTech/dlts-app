import { loginStyles } from "@/src/styles/login";
import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LoginTools {
  errors: any;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  clearFieldError: (val: any) => void;
  handleLogin: () => void;
  onForgotPassword: () => void;
}

const LoginScreen = ({
  errors,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  handleLogin,
  clearFieldError,
  onForgotPassword,
}: LoginTools) => {
  return (
    <View>
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
          <View
            style={[
              loginStyles.errorContainer,
              { justifyContent: "center", marginBottom: 12 },
            ]}
          >
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

        <TouchableOpacity
          style={{ alignSelf: "flex-end", paddingVertical: 8 }}
          onPress={onForgotPassword}
        >
          <Text
            style={{ color: colors.primary, fontWeight: "700", fontSize: 13 }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

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
        <Text style={loginStyles.footerText}>LIRS - DLTS</Text>
        <Text style={loginStyles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

export default LoginScreen;
