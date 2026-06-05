import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';

export const Badge = memo(({ variant = 'neutral', children, style }) => {
  const { colors } = useTheme();

  const getVariantColors = () => {
    switch (variant) {
      case 'success': return { bg: `${colors.success}20`, text: colors.success };
      case 'warning': return { bg: `${colors.warning}20`, text: colors.warning };
      case 'danger': return { bg: `${colors.danger}20`, text: colors.danger };
      case 'info': return { bg: `${colors.info}20`, text: colors.info };
      case 'neutral':
      default: return { bg: colors.surfaceElevated, text: colors.textSecondary };
    }
  };

  const vColors = getVariantColors();

  return (
    <View style={[styles.badge, { backgroundColor: vColors.bg }, style]}>
      <Text style={[styles.text, { color: vColors.text }]}>
        {children}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...tokens.typography.caption,
    textTransform: 'uppercase',
  }
});
