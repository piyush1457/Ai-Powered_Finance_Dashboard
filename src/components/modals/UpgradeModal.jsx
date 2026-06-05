import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useToast } from '../../context/ToastContext';

export const UpgradeModal = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const handleUpgrade = () => {
    trackEvent('Upgrade', 'submit', selectedPlan);
    showToast('Redirecting to checkout...', 'success');
    setTimeout(onClose, 1500);
  };

  const FeatureItem = ({ text }) => (
    <View style={styles.featureItem}>
      <Check size={16} color={tokens.colors.primary} />
      <Text style={[styles.featureText, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Wealth Curator Premium" style={{ width: 500 }}>
      <ScrollView>
        <View style={styles.heroBox}>
          <View style={styles.iconWrapper}>
            <Star size={32} color={tokens.colors.gold} fill={tokens.colors.gold} />
          </View>
          <Text style={[styles.heroText, { color: colors.textPrimary }]}>
            Take your portfolio to the next level with advanced AI insights and unlimited strategy executions.
          </Text>
        </View>

        <View style={styles.planToggle}>
          <Button 
            variant={selectedPlan === 'monthly' ? 'primary' : 'ghost'} 
            style={styles.toggleBtn}
            onPress={() => setSelectedPlan('monthly')}
          >
            Monthly ($19/mo)
          </Button>
          <Button 
            variant={selectedPlan === 'annual' ? 'primary' : 'ghost'} 
            style={styles.toggleBtn}
            onPress={() => setSelectedPlan('annual')}
          >
            Annual ($15/mo)
          </Button>
        </View>

        <View style={[styles.featuresList, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <FeatureItem text="Unlimited AI Strategy Audits" />
          <FeatureItem text="Real-time market sentiment analysis" />
          <FeatureItem text="Automated portfolio rebalancing" />
          <FeatureItem text="Tax-loss harvesting suggestions" />
          <FeatureItem text="Priority 24/7 customer support" />
        </View>

        <View style={styles.actions}>
          <Button variant="ghost" onPress={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="primary" onPress={handleUpgrade} style={{ flex: 2 }}>
            <Zap size={16} color="#fff" style={{ marginRight: 8 }} />
            Upgrade Now
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  heroBox: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${tokens.colors.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  planToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
  },
  featuresList: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  }
});
