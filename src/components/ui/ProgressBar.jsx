import React, { memo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const ProgressBar = memo(({ value = 0, color, height = 8, style }) => {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.min(Math.max(value, 0), 100),
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value, progressAnim]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={[styles.track, { backgroundColor: colors.border, height, borderRadius: height / 2 }, style]}>
      <Animated.View 
        style={[
          styles.fill, 
          { 
            backgroundColor: color || colors.primary, 
            width: widthInterpolated,
            borderRadius: height / 2,
          }
        ]} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  }
});
