import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Skeleton';
import { Card } from '../ui/Card';
import { ViewAllSpendingModal } from '../modals/ViewAllSpendingModal';
import { useAnalytics } from '../../hooks/useAnalytics';

export const SpendingComposition = memo(({ data, editorsNote, isLoading, style }) => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    trackEvent('SpendingComposition', 'cta_click', 'View All');
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Skeleton width={200} height={24} />
        </View>
        <Card>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ marginBottom: 20 }}>
              <Skeleton width="100%" height={40} />
            </View>
          ))}
        </Card>
      </View>
    );
  }

  if (!data) return null;

  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={[styles.panelTitle, { color: colors.textPrimary }]}>Spending Composition</Text>
          <Pressable onPress={handleOpenModal}>
            <Text style={[styles.seeAll, { color: tokens.colors.primary }]}>View All</Text>
          </Pressable>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.spendRow}>
            {data.map((item, index) => (
              <View key={item.category} style={styles.spendItem}>
                <View style={styles.spendMeta}>
                  <Text style={[styles.spendName, { color: colors.textSecondary }]}>{item.category}</Text>
                  <Text style={[styles.spendPct, { color: colors.textPrimary }]}>{item.percentage}%</Text>
                </View>
                <ProgressBar value={item.percentage} color={item.color} height={5} style={{ backgroundColor: colors.surfaceElevated }} />
              </View>
            ))}
          </View>

          {editorsNote && (
            <View style={[styles.noteCard, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.noteLabel, { color: colors.textMuted }]}>EDITOR'S NOTE</Text>
              <Text style={[styles.noteText, { color: colors.textSecondary }]}>"{editorsNote}"</Text>
            </View>
          )}
        </View>
      </View>

      <ViewAllSpendingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 11.5,
  },
  card: {
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    padding: 22,
  },
  spendRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginTop: 6,
  },
  spendItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  spendMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spendName: {
    fontSize: 12.5,
  },
  spendPct: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: tokens.typography.mono.fontFamily,
  },
  noteCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
  },
  noteLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 19.2, // 1.6 * 12
    fontStyle: 'italic',
  }
});
