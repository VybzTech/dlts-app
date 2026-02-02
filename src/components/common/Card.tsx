import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'expo-linear-gradient';

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  gradient?: string[];
  padding?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  borderRadius?: number;
  elevation?: number;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  gradient = ['#ffffff', '#f5f5f5'],
  padding = 16,
  marginVertical = 8,
  marginHorizontal = 12,
  borderRadius = 12,
  elevation = 3,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          padding,
          marginVertical,
          marginHorizontal,
          borderRadius,
          elevation,
        },
        style,
      ]}
    >
      {title && (
        <Text style={[styles.title, titleStyle]}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    color: '#666',
  },
});

export default Card;