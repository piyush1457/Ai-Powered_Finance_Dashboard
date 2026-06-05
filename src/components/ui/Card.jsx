import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';

export const Card = memo(({ children, elevated, style, ...props }) => {
  const { colors } = useTheme();

  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          borderColor: colors.border,
          shadowColor: elevated ? '#000' : 'transparent',
        },
        elevated && styles.elevated,
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
  },
  elevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  }
});
