import React from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export const AppLayout = () => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, flexDirection: isMobile ? 'column' : 'row' }]}>
      {!isMobile && <Sidebar />}
      
      <View style={styles.mainContent}>
        <Header />
        
        <ScrollView 
          accessibilityRole="main"
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
          <Outlet />
        </ScrollView>
        
        <Footer />
      </View>

      {isMobile && <Sidebar />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    overflow: 'visible',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  }
});
