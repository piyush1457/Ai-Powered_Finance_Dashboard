import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { Button } from '../ui/Button';

export const LegalModal = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);

  const TABS = [
    { id: 'terms', label: 'Terms of Service' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Legal & Privacy" style={{ width: 600 }}>
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {TABS.map(tab => (
          <Pressable 
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: tokens.colors.primary }]}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab.id ? tokens.colors.primary : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'terms' && (
          <View>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>1. Acceptance of Terms</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              By accessing and using Proton Finance, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </Text>
            
            <Text style={[styles.heading, { color: colors.textPrimary }]}>2. AI Wealth Curator</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              The AI Wealth Curator provides algorithmic financial insights based on market data. These insights do not constitute financial advice. Proton Finance is not liable for any losses incurred by executing strategies recommended by the AI.
            </Text>
          </View>
        )}

        {activeTab === 'privacy' && (
          <View>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>Data Collection</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              We collect information to provide better services to all our users. The information Proton Finance collects, and how that information is used, depends on how you use our services and how you manage your privacy controls.
            </Text>
            
            <Text style={[styles.heading, { color: colors.textPrimary }]}>Information Sharing</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              We do not share your personal information with companies, organizations, or individuals outside of Proton Finance except in the following cases: with your consent, with domain administrators, for external processing, or for legal reasons.
            </Text>
          </View>
        )}

        {activeTab === 'security' && (
          <View>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>Bank-Grade Encryption</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              We use 256-bit encryption to secure your data. Our infrastructure is hosted on secure, SOC2 compliant servers. We never store your bank credentials directly on our servers.
            </Text>
            
            <Text style={[styles.heading, { color: colors.textPrimary }]}>Two-Factor Authentication</Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              We strongly recommend enabling 2FA on your account for an additional layer of security. You can manage this in your account settings.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Button variant="primary" onPress={onClose}>I Understand</Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: -10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    maxHeight: 400,
    marginBottom: 24,
  },
  heading: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    alignItems: 'flex-end',
  }
});
