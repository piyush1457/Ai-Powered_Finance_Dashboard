import React, { memo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export const SummaryCards = memo(({ data, isLoading }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (isLoading) {
    return (
      <View style={[styles.container, isMobile && styles.mobileContainer]}>
        {[1, 2, 3].map(i => (
          <Card key={i} style={[styles.card, isMobile && styles.mobileCard]}>
            <Skeleton height={14} width={120} style={{ marginBottom: 12 }} />
            <Skeleton height={44} width={160} style={{ marginBottom: 12 }} />
            <Skeleton height={18} width={140} />
          </Card>
        ))}
      </View>
    );
  }

  if (!data) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <Card style={[styles.card, isMobile && styles.mobileCard]}>
        <View style={[styles.cardBg, { backgroundImage: 'linear-gradient(135deg, transparent 60%, rgba(79, 156, 249, 0.05))' }]} pointerEvents="none" />
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>TOTAL NET WORTH</Text>
        <Text style={[tokens.typography.display, { color: colors.textPrimary, marginBottom: 8 }]}>{formatCurrency(data.netWorth.value)}</Text>
        <View style={styles.trendRow}>
          <ArrowUpRight size={14} color={tokens.colors.green} />
          <Text style={{ color: tokens.colors.green, fontSize: 11, fontWeight: '500', marginLeft: 4 }}>
            +{data.netWorth.change}% {data.netWorth.period}
          </Text>
        </View>
      </Card>

      <Card style={[styles.card, isMobile && styles.mobileCard]}>
        <View style={[styles.cardBg, { backgroundImage: 'linear-gradient(135deg, transparent 60%, rgba(245, 200, 66, 0.05))' }]} pointerEvents="none" />
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>MONTHLY SPENDING</Text>
        <Text style={[tokens.typography.display, { color: colors.textPrimary, marginBottom: 8 }]}>{formatCurrency(data.monthlySpending.value)}</Text>
        <View style={styles.trendRow}>
          <ArrowUpRight size={14} color={tokens.colors.gold} />
          <Text style={{ color: tokens.colors.gold, fontSize: 11, fontWeight: '500', marginLeft: 4 }}>
            +{data.monthlySpending.change}% {data.monthlySpending.period}
          </Text>
        </View>
      </Card>

      <Card style={[styles.card, isMobile && styles.mobileCard]}>
        <View style={[styles.cardBg, { backgroundImage: 'linear-gradient(135deg, transparent 60%, rgba(0, 229, 192, 0.05))' }]} pointerEvents="none" />
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>TOTAL SAVINGS</Text>
        <Text style={[tokens.typography.display, { color: colors.textPrimary, marginBottom: 8 }]}>{formatCurrency(data.totalSavings.value)}</Text>
        <View style={styles.trendRow}>
          <CheckCircle2 size={14} color={tokens.colors.primary} />
          <Text style={{ color: tokens.colors.primary, fontSize: 11, fontWeight: '500', marginLeft: 4 }}>
            {data.totalSavings.status}
          </Text>
        </View>
      </Card>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  mobileContainer: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    padding: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mobileCard: {
    width: '100%',
  },
  cardLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 10,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
