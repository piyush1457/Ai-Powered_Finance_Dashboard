import React, { memo, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { List as FixedSizeList } from 'react-window';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { useDebounce } from '../../hooks/useDebounce';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Skeleton } from '../ui/Skeleton';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShoppingBag, Utensils, Zap, DollarSign, ShoppingCart, Tv, Car, Music, Plane, Cloud, Circle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { exportCSV } from '../../utils/exportCSV';
import { TransactionFilter } from './TransactionFilter';

const ICONS = { ShoppingBag, Utensils, Zap, DollarSign, ShoppingCart, Tv, Car, Music, Plane, Cloud, Circle };

const TransactionRow = memo(({ tx, rowStyle, colors, trackEvent }) => {
  const Icon = ICONS[tx.icon] || ICONS.Circle;

  return (
    <View style={[rowStyle, styles.txRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
        <Icon size={16} color={colors.textSecondary} aria-hidden="true" />
      </View>
      
      <View style={styles.merchantCol}>
        <Text style={[styles.merchantText, { color: colors.textPrimary }]} numberOfLines={1}>{tx.merchant}</Text>
        <Text style={[styles.dateText, { color: colors.textMuted }]} numberOfLines={1}>{tx.date} • {tx.time}</Text>
      </View>
      
      <View style={styles.badgeCol}>
        <View style={[styles.tag, { backgroundColor: `${colors.primary}15` }]}>
          <Text style={[styles.tagText, { color: tokens.colors.primary }]}>{tx.category}</Text>
        </View>
      </View>
      
      <View style={styles.statusCol}>
        <View style={styles.statusWrap}>
          <View style={[styles.statusDot, { backgroundColor: tx.status === 'CLEARED' ? tokens.colors.green : tokens.colors.warning }]} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>{tx.status}</Text>
        </View>
      </View>
      
      <View style={styles.amountCol}>
        <Text style={[
          styles.amountText, 
          { color: tx.amount < 0 ? tokens.colors.danger : tokens.colors.green }
        ]} numberOfLines={1}>
          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
        </Text>
      </View>
    </View>
  );
});

export const RecentActivity = memo(({ data, isLoading, style }) => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    statuses: [],
    minAmount: '',
    maxAmount: ''
  });
  const debouncedSearch = useDebounce(searchValue, 300);

  React.useEffect(() => {
    if (debouncedSearch) {
      trackEvent('RecentActivity', 'filter_apply', debouncedSearch);
    }
  }, [debouncedSearch, trackEvent]);

  const handleApplyAdvancedFilters = React.useCallback((filters) => {
    setAdvancedFilters(filters);
    trackEvent('RecentActivity', 'advanced_filter_apply', JSON.stringify(filters));
  }, [trackEvent]);

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter(tx => {
      const matchSearch = tx.merchant.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                          tx.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchCategory = advancedFilters.categories.length === 0 || 
                            advancedFilters.categories.some(c => c.toLowerCase() === tx.category.toLowerCase());
      
      const matchStatus = advancedFilters.statuses.length === 0 || 
                          advancedFilters.statuses.some(s => s.toLowerCase() === tx.status.toLowerCase());
      
      const amt = Math.abs(tx.amount);
      const min = parseFloat(advancedFilters.minAmount);
      const max = parseFloat(advancedFilters.maxAmount);
      
      const matchMin = isNaN(min) || amt >= min;
      const matchMax = isNaN(max) || amt <= max;

      return matchSearch && matchCategory && matchStatus && matchMin && matchMax;
    });
  }, [data, debouncedSearch, advancedFilters]);

  const handleExport = React.useCallback(() => {
    trackEvent('RecentActivity', 'export', 'csv', filteredData.length);
    exportCSV(filteredData);
    showToast('CSV exported successfully', 'success');
  }, [trackEvent, filteredData, showToast]);

  const renderRow = React.useCallback(({ index, style: rowStyle }) => {
    const tx = filteredData[index];
    return <TransactionRow tx={tx} rowStyle={rowStyle} colors={colors} trackEvent={trackEvent} />;
  }, [filteredData, colors, trackEvent]);

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Skeleton width={150} height={24} />
        </View>
        <Card style={{ padding: 0 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={{ padding: tokens.spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Skeleton width="100%" height={40} />
            </View>
          ))}
        </Card>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.panelTitle, { color: colors.textPrimary }]}>Recent Activity</Text>
        <View style={styles.actions}>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border2 }]}
            placeholder="Search..."
            placeholderTextColor={colors.textMuted}
            value={searchValue}
            onChangeText={setSearchValue}
            accessibilityLabel="Search transactions"
          />
          <TransactionFilter onApplyFilters={handleApplyAdvancedFilters} />
          <Pressable 
            style={[styles.btn, { borderColor: colors.border }]} 
            onPress={handleExport}
            accessibilityLabel="Export CSV"
          >
            <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>Export CSV</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.tableHeader, { backgroundColor: colors.surfaceElevated, borderBottomColor: colors.border }]}>
          <View style={[styles.merchantCol, { paddingLeft: 56 }]}><Text style={[styles.thText, { color: colors.textMuted }]}>MERCHANT</Text></View>
          <View style={styles.badgeCol}><Text style={[styles.thText, { color: colors.textMuted }]}>CATEGORY</Text></View>
          <View style={styles.statusCol}><Text style={[styles.thText, { color: colors.textMuted }]}>STATUS</Text></View>
          <View style={styles.amountCol}><Text style={[styles.thText, { color: colors.textMuted, textAlign: 'right' }]}>AMOUNT</Text></View>
        </View>

        {filteredData.length > 0 ? (
          filteredData.length > 50 ? (
            <FixedSizeList
              height={400}
              width="100%"
              itemSize={72}
              itemCount={filteredData.length}
            >
              {renderRow}
            </FixedSizeList>
          ) : (
            <View style={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredData.map((tx, index) => (
                <View key={tx.id}>
                  {renderRow({ index, style: { height: 72 } })}
                </View>
              ))}
            </View>
          )
        ) : (
          <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textMuted }}>No transactions found.</Text>
          </View>
        )}
      </View>
    </View>
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
    flexWrap: 'wrap',
    gap: 8,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    width: 150,
    fontSize: 12.5,
    outlineStyle: 'none',
  },
  btn: {
    height: 32,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  card: {
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  thText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  merchantCol: {
    flex: 2,
    justifyContent: 'center',
  },
  badgeCol: {
    flex: 1.5,
    justifyContent: 'center',
  },
  statusCol: {
    flex: 1,
    justifyContent: 'center',
  },
  amountCol: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  merchantText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    fontFamily: tokens.typography.mono.fontFamily,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: tokens.typography.mono.fontFamily,
  }
});
