import React, { memo } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';

export const Button = memo(({ 
  onPress, 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  icon: Icon,
  style,
  textStyle,
  accessibilityLabel
}) => {
  const { colors } = useTheme();

  const getVariantStyles = (pressed, hovered, focused) => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: hovered ? colors.surfaceElevated : colors.surface,
          borderColor: focused ? colors.primary : colors.border,
          borderWidth: 1,
          textColor: colors.textPrimary,
        };
      case 'ghost':
        return {
          backgroundColor: hovered ? colors.surfaceElevated : 'transparent',
          textColor: colors.textSecondary,
        };
      case 'danger':
        return {
          backgroundColor: pressed ? '#DC2626' : (hovered ? '#EF4444' : colors.danger),
          textColor: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          backgroundColor: pressed ? '#1E3A8A' : (hovered ? colors.primaryHover : colors.primary),
          textColor: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 };
      case 'lg': return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
      case 'md':
      default: return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
      style={({ pressed, hovered, focused }) => {
        const vStyles = getVariantStyles(pressed, hovered, focused);
        return [
          styles.base,
          { 
            backgroundColor: disabled ? colors.border : vStyles.backgroundColor,
            borderColor: vStyles.borderColor || 'transparent',
            borderWidth: vStyles.borderWidth || 0,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            opacity: disabled ? 0.6 : 1,
            outlineStyle: focused ? 'solid' : 'none',
            outlineWidth: 2,
            outlineColor: colors.primaryLight,
            outlineOffset: 2,
          },
          style,
        ];
      }}
    >
      {({ pressed, hovered, focused }) => {
        const vStyles = getVariantStyles(pressed, hovered, focused);
        return (
          <View style={styles.content}>
            {Icon && <Icon size={sizeStyles.fontSize * 1.2} color={disabled ? colors.textMuted : vStyles.textColor} style={{ marginRight: 8 }} />}
            <Text style={[
              styles.text, 
              { fontSize: sizeStyles.fontSize, color: disabled ? colors.textMuted : vStyles.textColor },
              textStyle
            ]}>
              {children}
            </Text>
          </View>
        );
      }}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontFamily: tokens.typography.body.fontFamily || 'inherit',
  }
});
