import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Helmet } from 'react-helmet-async';

export const Market = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Helmet>
        <title>Proton Finance | Market Overview</title>
      </Helmet>
      
      <Text style={[styles.title, { color: colors.textPrimary }]}>Market Overview</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Global indices, trending assets, and financial news will appear here.
      </Text>
      
      <View style={[styles.placeholder, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
        <Text style={{ color: colors.textSecondary }}>Market data integration is coming soon.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: '"Playfair Display", serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  placeholder: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  }
});
