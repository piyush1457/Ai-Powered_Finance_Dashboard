import React, { memo, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';

export const Skeleton = memo(({ width = '100%', height = 20, radius = tokens.radius.md, style }) => {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: false,
        })
      ])
    ).start();
  }, [anim]);

  return (
    <Animated.View 
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.border,
          opacity: anim,
        },
        style
      ]} 
    />
  );
});
