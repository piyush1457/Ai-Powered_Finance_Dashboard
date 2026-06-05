import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, TextInput } from 'react-native';
import { Dropdown } from '../ui/Dropdown';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const TransactionFilter = ({ onApplyFilters }) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    statuses: [],
    minAmount: '',
    maxAmount: ''
  });

  const CATEGORIES = ['Technology', 'Lifestyle', 'Utilities', 'Income', 'Entertainment', 'Transport', 'Travel'];
  const STATUSES = ['CLEARED', 'PENDING'];

  const toggleCategory = (cat) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleStatus = (status) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status) 
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const clearAll = () => {
    const emptyFilters = { categories: [], statuses: [], minAmount: '', maxAmount: '' };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    setIsOpen(false);
  };

  const triggerRef = React.useRef(null);
  const activeCount = filters.categories.length + filters.statuses.length + (filters.minAmount ? 1 : 0) + (filters.maxAmount ? 1 : 0);

  return (
    <View style={styles.container}>
      <Pressable 
        ref={triggerRef}
        style={[styles.trigger, { borderColor: colors.border }]} 
        onPress={() => setIsOpen(true)}
      >
        <Filter size={14} color={colors.textPrimary} />
        <Text style={[styles.triggerText, { color: colors.textPrimary }]}>
          Filter {activeCount > 0 ? `(${activeCount})` : ''}
        </Text>
      </Pressable>

      <Dropdown 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        triggerRef={triggerRef}
        position="bottom-right" 
        style={{ width: 320 }}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Filter Transactions</Text>
          <Pressable onPress={clearAll}>
            <Text style={[styles.clearText, { color: colors.textMuted }]}>Clear All</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Category</Text>
          <View style={styles.chipGroup}>
            {CATEGORIES.map(cat => {
              const isActive = filters.categories.includes(cat);
              return (
                <Pressable 
                  key={cat}
                  onPress={() => toggleCategory(cat)}
                  style={[
                    styles.chip, 
                    { borderColor: colors.border },
                    isActive && { backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary }
                  ]}
                >
                  <Text style={{ fontSize: 11, color: isActive ? '#fff' : colors.textPrimary }}>{cat}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Status</Text>
          <View style={styles.chipGroup}>
            {STATUSES.map(status => {
              const isActive = filters.statuses.includes(status);
              return (
                <Pressable 
                  key={status}
                  onPress={() => toggleStatus(status)}
                  style={[
                    styles.chip, 
                    { borderColor: colors.border },
                    isActive && { backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary }
                  ]}
                >
                  <Text style={{ fontSize: 11, color: isActive ? '#fff' : colors.textPrimary }}>{status}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Amount Range</Text>
          <View style={styles.row}>
            <TextInput 
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
              placeholder="Min $"
              placeholderTextColor={colors.textMuted}
              value={filters.minAmount}
              onChangeText={val => setFilters(f => ({ ...f, minAmount: val }))}
              keyboardType="numeric"
            />
            <Text style={{ color: colors.textMuted }}>-</Text>
            <TextInput 
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
              placeholder="Max $"
              placeholderTextColor={colors.textMuted}
              value={filters.maxAmount}
              onChangeText={val => setFilters(f => ({ ...f, maxAmount: val }))}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button variant="primary" style={{ width: '100%' }} onPress={handleApply}>
            Apply Filters
          </Button>
        </View>
      </Dropdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    outlineStyle: 'none',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  }
});
