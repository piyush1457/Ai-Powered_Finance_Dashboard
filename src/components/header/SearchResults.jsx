import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { Search, ArrowRight, Tag, Clock } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../../data/mockData';

export const SearchResults = ({ isOpen, onClose, query, triggerRef }) => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [results, setResults] = useState({ transactions: [], categories: [] });

  const handleItemClick = (searchQuery) => {
    onClose();
    navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    if (!query) {
      setResults({ transactions: [], categories: [] });
      return;
    }

    const q = query.toLowerCase();
    
    // Search transactions
    const txMatch = mockData.transactions.filter(t => 
      t.merchant.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q)
    ).slice(0, 4);

    // Search categories
    const catMatch = mockData.spendingComposition.filter(c => 
      c.category.toLowerCase().includes(q)
    ).slice(0, 2);

    setResults({ transactions: txMatch, categories: catMatch });
  }, [query]);

  return (
    <Dropdown 
      isOpen={isOpen} 
      onClose={onClose}
      triggerRef={triggerRef}
      position="bottom-left"
      style={{ width: 340, marginTop: 4 }}
    >
      <ScrollView style={styles.container}>
        {!query ? null : (results.transactions.length === 0 && results.categories.length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No matches found for "{query}"</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try searching for merchants or categories</Text>
          </View>
        ) : (
          <View style={styles.resultsList}>
            {results.categories.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CATEGORIES</Text>
                {results.categories.map(c => (
                  <Pressable 
                    key={c.category} 
                    onPress={() => handleItemClick(c.category)}
                    style={({ pressed }) => [styles.resultItem, pressed && { backgroundColor: colors.surfaceHighlight }]}
                  >
                    <Tag size={14} color={colors.textSecondary} />
                    <Text style={[styles.resultText, { color: colors.textPrimary }]}>{c.category}</Text>
                    <ArrowRight size={14} color={colors.textMuted} style={styles.resultArrow} />
                  </Pressable>
                ))}
              </View>
            )}

            {results.transactions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>TRANSACTIONS</Text>
                {results.transactions.map(t => (
                  <Pressable 
                    key={t.id} 
                    onPress={() => handleItemClick(t.merchant)}
                    style={({ pressed }) => [styles.resultItem, pressed && { backgroundColor: colors.surfaceHighlight }]}
                  >
                    <Clock size={14} color={colors.textSecondary} />
                    <View style={styles.txContent}>
                      <Text style={[styles.resultText, { color: colors.textPrimary }]}>{t.merchant}</Text>
                      <Text style={[styles.txDate, { color: colors.textMuted }]}>{t.date}</Text>
                    </View>
                    <Text style={[styles.txAmount, { color: colors.textPrimary }]}>{t.amount > 0 ? '+' : ''}${Math.abs(t.amount)}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Dropdown>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 12,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
  },
  resultsList: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '500',
  },
  resultArrow: {
    marginLeft: 'auto',
  },
  txContent: {
    flex: 1,
  },
  txDate: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 'auto',
  }
});
