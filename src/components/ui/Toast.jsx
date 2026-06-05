import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { tokens } from '../../styles/tokens';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast = ({ message, type = 'info', onDismiss }) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      close();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      onDismiss();
    });
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color={tokens.colors.green} />;
      case 'error': return <XCircle size={18} color={tokens.colors.danger} />;
      case 'warning': return <AlertTriangle size={18} color={tokens.colors.warning} />;
      default: return <Info size={18} color={tokens.colors.info} />;
    }
  };

  return (
    <Animated.View style={[
      styles.toast, 
      { 
        backgroundColor: colors.surfaceElevated, 
        borderColor: colors.border,
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim
      }
    ]}>
      <View style={styles.icon}>{getIcon()}</View>
      <Text style={[styles.message, { color: colors.textPrimary }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    marginBottom: 10,
    boxShadow: tokens.shadows.lg,
    minWidth: 280,
    maxWidth: 400,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  }
});
