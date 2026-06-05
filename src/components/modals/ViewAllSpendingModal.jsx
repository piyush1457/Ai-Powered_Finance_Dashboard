import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { ShoppingBag, Coffee, Car, Tv, Smartphone, Home, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { mockData } from '../../data/mockData';

const ICONS = { ShoppingBag, Coffee, Car, Tv, Smartphone, Home, Zap };

export const ViewAllSpendingModal = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const data = mockData.spendingComposition;

  const totalSpent = data.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Spending Composition" style={{ width: 600 }}>
      <View style={[styles.summaryBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Spent this Month</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatCurrency(totalSpent)}</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Budget</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatCurrency(totalBudget)}</Text>
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 20 }}>
        {data.map((item) => {
          const Icon = ICONS[item.icon] || ShoppingBag;
          return (
            <View key={item.id} style={[styles.categoryRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
                <Icon size={18} color={item.color} />
              </View>
              <View style={styles.details}>
                <View style={styles.header}>
                  <Text style={[styles.label, { color: colors.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.amount, { color: colors.textPrimary }]}>
                    {formatCurrency(item.amount)} <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '400' }}>/ {formatCurrency(item.total)}</Text>
                  </Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.surfaceElevated }]}>
                  <View style={[styles.progressFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={[styles.percentage, { color: colors.textSecondary }]}>{item.percentage}% used</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  summaryBox: {
    flexDirection: 'row',
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: tokens.typography.mono.fontFamily,
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: 20,
  },
  list: {
    maxHeight: 400,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: tokens.typography.mono.fontFamily,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 11,
    textAlign: 'right',
  }
});
