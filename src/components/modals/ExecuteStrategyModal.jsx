import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const ExecuteStrategyModal = ({ isOpen, onClose }) => {
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const { colors } = useTheme();
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExecute = () => {
    trackEvent('AI Insights', 'cta_click', 'Execute Strategy');
    setIsExecuting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsExecuting(false);
      setIsSuccess(true);
      showToast('Strategy executed successfully. Rebalancing in progress.', 'success');
      
      // Auto close after showing success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    if (!isExecuting) {
      onClose();
      // Reset state on close
      setTimeout(() => setIsSuccess(false), 300);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Execute AI Strategy" style={{ width: 500 }}>
      {isSuccess ? (
        <View style={styles.successContainer}>
          <CheckCircle2 size={64} color={tokens.colors.green} />
          <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginTop: 16 }]}>Strategy Initiated</Text>
          <Text style={[styles.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            Your portfolio is currently being rebalanced. This may take a few minutes to reflect in your accounts.
          </Text>
        </View>
      ) : (
        <>
          <Text style={[styles.body, { color: colors.textSecondary, marginBottom: 16 }]}>
            The Wealth Curator AI recommends the following rebalancing actions to optimize for the upcoming Q3 market shift:
          </Text>

          <View style={[styles.actionList, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <View style={[styles.actionItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>Reduce Technology exposure by 4%</Text>
              <ArrowRight size={14} color={colors.textMuted} />
              <Text style={[styles.actionAmount, { color: colors.textPrimary }]}>$49,936</Text>
            </View>
            <View style={[styles.actionItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>Increase Emerging Market Debt by 2%</Text>
              <ArrowRight size={14} color={colors.textMuted} />
              <Text style={[styles.actionAmount, { color: colors.textPrimary }]}>$24,968</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>Add High-Yield Real Estate position 2%</Text>
              <ArrowRight size={14} color={colors.textMuted} />
              <Text style={[styles.actionAmount, { color: colors.textPrimary }]}>$24,968</Text>
            </View>
          </View>

          <View style={[styles.yieldBox, { backgroundColor: `${tokens.colors.green}15`, borderColor: `${tokens.colors.green}30` }]}>
            <Text style={[styles.yieldText, { color: tokens.colors.green }]}>Estimated yield increase: +2.4% annually</Text>
          </View>
          
          <View style={styles.actions}>
            <Button variant="ghost" onPress={handleClose} disabled={isExecuting}>
              Cancel
            </Button>
            <Button variant="primary" onPress={handleExecute} disabled={isExecuting}>
              {isExecuting ? <ActivityIndicator size="small" color="#fff" /> : 'Confirm Execution'}
            </Button>
          </View>
        </>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionList: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
  },
  actionAmount: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  yieldBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  yieldText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  }
});
