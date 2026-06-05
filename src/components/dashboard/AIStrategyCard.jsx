import React, { memo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { tokens } from '../../styles/tokens';
import { useTheme } from '../../context/ThemeContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ExecuteStrategyModal } from '../modals/ExecuteStrategyModal';
import { ReviewAuditModal } from '../modals/ReviewAuditModal';

export const AIStrategyCard = memo(({ data, isLoading, style }) => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  if (isLoading || !data) {
    return <View style={[styles.card, style, { backgroundColor: colors.surfaceElevated }]} />;
  }

  return (
    <View style={[styles.card, style]}>
      <View style={styles.flare1} pointerEvents="none" />
      <View style={styles.flare2} pointerEvents="none" />

      <View style={styles.pill}>
        <View style={styles.pillDot} />
        <Text style={styles.pillText}>PRO STRATEGY INSIGHT</Text>
      </View>
      
      <Text style={[tokens.typography.h2, styles.title]}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
      
      <View style={styles.actions}>
        <Button 
          variant="primary" 
          style={styles.btnPrimary} 
          textStyle={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}
          onPress={() => setIsExecuteModalOpen(true)}
        >
          Execute Strategy
        </Button>
        <Button 
          variant="ghost" 
          style={styles.btnGhost} 
          textStyle={{ color: '#e8eaf0', fontSize: 13, fontWeight: '500' }}
          onPress={() => setIsAuditModalOpen(true)}
        >
          Review Audit
        </Button>
      </View>

      <ExecuteStrategyModal isOpen={isExecuteModalOpen} onClose={() => setIsExecuteModalOpen(false)} />
      <ReviewAuditModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.lg,
    padding: 28,
    backgroundColor: '#141929',
    backgroundImage: 'linear-gradient(135deg, #141929 0%, #0d1423 100%)',
    borderColor: '#4f9cf930',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  flare1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    backgroundImage: 'radial-gradient(circle, rgba(79,156,249,0.08) 0%, transparent 70%)',
  },
  flare2: {
    position: 'absolute',
    bottom: -40,
    left: 60,
    width: 160,
    height: 160,
    backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4f9cf918',
    borderColor: '#4f9cf930',
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  pillDot: {
    width: 6,
    height: 6,
    backgroundColor: tokens.colors.primary,
    borderRadius: 3,
  },
  pillText: {
    color: tokens.colors.primary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  title: {
    color: '#e8eaf0',
    marginBottom: 12,
    maxWidth: 420,
  },
  description: {
    color: '#8b909e',
    fontSize: 13.5,
    lineHeight: 21,
    maxWidth: 400,
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  btnPrimary: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 9,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 0,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff18',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 20,
    paddingVertical: 10,
  }
});
