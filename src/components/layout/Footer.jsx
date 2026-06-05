import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { LegalModal } from '../modals/LegalModal';

export const Footer = () => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('privacy');

  const handleOpenLegal = (tab) => {
    setActiveLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <View 
        accessibilityRole="contentinfo"
        style={[styles.footer, isMobile && styles.footerMobile, { backgroundColor: colors.bg, borderTopColor: colors.border }]}
      >
        <Text style={[styles.text, { color: colors.textMuted }]}>
          © 2024 Proton Finance. All financial data is encrypted and secure.
        </Text>
        
        <View style={[styles.links, isMobile && styles.linksMobile]}>
          <Pressable onPress={() => handleOpenLegal('privacy')}><Text style={[styles.link, { color: colors.textMuted }]}>Privacy Policy</Text></Pressable>
          <Pressable onPress={() => handleOpenLegal('security')}><Text style={[styles.link, { color: colors.textMuted }]}>Security Audit</Text></Pressable>
          <Pressable onPress={() => handleOpenLegal('terms')}><Text style={[styles.link, { color: colors.textMuted }]}>Terms</Text></Pressable>
        </View>
      </View>

      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        initialTab={activeLegalTab}
      />
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerMobile: {
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 40,
  },
  text: {
    fontSize: 11,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  linksMobile: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  link: {
    fontSize: 11,
  }
});
