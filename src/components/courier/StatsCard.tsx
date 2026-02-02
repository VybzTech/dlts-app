import { Icon } from "@/src/hooks/useIcons";
import { statsStyles } from "@/src/styles/delivery";
import { colors } from "@/src/styles/theme/colors";
import { FilterType } from "@/src/types/delivery.types";
import { LinearGradient } from "expo-linear-gradient";
import React, { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  value: number;
  icon: string;
  iconLibrary?: any;
  filterKey: FilterType;
  activeFilter: FilterType;
  onPress: Dispatch<SetStateAction<FilterType>>;
};

export const StatsCard = ({
  label,
  value,
  icon,
  iconLibrary = "ionicons",
  filterKey,
  activeFilter,
  onPress,
}: Props) => {
  const isActive = activeFilter === filterKey;

  // Green gradient colors
  const bgColor = isActive ? "#059669" : "#d1fae5"; // Dark green to light green
  const textColor = isActive ? "#ffffff" : "#065f46"; // White to dark green text

  return (
    <TouchableOpacity
      style={[statsStyles.cardWrapper]}
      onPress={() => onPress(filterKey)}
      // activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          isActive
            ? [colors.primaryLight, "#15a449", colors.primary]
            : ["#ffffff", "#fff"]
        }
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[statsStyles.card]}
      >
        <View style={statsStyles.content}>
          <Icon name={icon} library={iconLibrary} size={24} color={textColor} />

          <Text style={[statsStyles.value, { color: textColor }]}>{value}</Text>

          <Text style={[statsStyles.label, { color: textColor }]}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
