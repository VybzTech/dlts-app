import { colors } from "@/src/styles/theme/colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  style?: object;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  style = {},
  disabled = false,
}) => {
  return (
    <LinearGradient
      colors={disabled ? ["#ccc", "#ccc"] : [colors.primary, colors.secondary]} // Adjust colors as needed
      style={[styles.button, style]}
    >
      <TouchableOpacity
        onPress={onClick}
        disabled={disabled}
        style={styles.touchable}
      >
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    flex: 1, // Ensures TouchableOpacity fills the gradient
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "500",
  },
});
