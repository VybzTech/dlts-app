// DLTS App Color Palette
export const colors = {
  // Primary
  primary: "#166534",
  primaryLight: "#22c55e",
  primaryDark: "#14532d",

  // Secondary
  secondary: "#15803d",

  // Background Colors
  backgroundPrimary: "#052e16",
  backgroundSecondary: "#14532d",
  backgroundCard: "rgba(20, 83, 45, 0.6)",
  backgroundInput: "rgba(5, 46, 22, 0.6)",

  // Text Colors
  textPrimary: "#ecfdf5",
  textSecondary: "#bbf7d0",
  textMuted: "#86efac",

  // Border Colors
  borderColor: "rgba(134, 239, 172, 0.1)",
  borderColorLight: "rgba(134, 239, 172, 0.2)",

  // Shadows
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  shadowSm: "0 4px 12px rgba(0, 0, 0, 0.2)",

  // Radius
  radius: "12px",
  radiusLg: "16px",
  radiusSm: "8px",

  // Status Colors
  success: "#34C759",
  successLight: "#E8F9ED",
  warning: "#FF9500",
  warningLight: "#FFF4E6",
  danger: "#FF3B30",
  dangerLight: "#FFEBEA",
  info: "#5856D6",
  infoLight: "#EEEDFC",

  // Neutrals
  white: "#FFFFFF",
  background: "#F5F5F5",
  card: "#FFFFFF",
  border: "#E5E5EA",
  borderLight: "#F0F0F0",

  // Text
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  textLight: "#AEAEB2",
  textInverse: "#FFFFFF",

  // Priority Colors
  priority: {
    MINIMAL: "#8E8E93",
    MEDIUM: "#007AFF",
    HIGH: "#FF9500",
    URGENT: "#FF3B30",
  },

  // Status Colors
  status: {
    assigned: "#8E8E93",
    picked_up: "#007AFF",
    en_route: "#FF9500",
    arrived: "#5856D6",
    delivered: "#34C759",
    returned: "#FF3B30",
  },
} as const;

// Status Labels
export const statusLabels: Record<string, string> = {
  assigned: "Assigned",
  picked_up: "Picked Up",
  en_route: "En Route",
  arrived: "Arrived",
  delivered: "Delivered",
  returned: "Returned",
};

// Priority Labels
export const priorityLabels: Record<string, string> = {
  MINIMAL: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
