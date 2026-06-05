import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TextInput } from 'react-native';
import { useFetch } from '../hooks/useFetch';
import { mockData } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { tokens } from '../styles/tokens';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { exportCSV } from '../utils/exportCSV';
import { Home, Utensils, Car, Zap, Tv, Download, Settings, BarChart2, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

import { Helmet } from 'react-helmet-async';

const ICONS = { Home, Utensils, Car, Zap, Tv };

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

const CategoryCard = React.memo(({ cat, isMobile, colors }) => {
  const Icon = ICONS[cat.icon] || Home;
  const percent = Math.round((cat.spent / cat.budget) * 100);
  return (
    <Card style={[styles.catCard, isMobile && styles.colFull]}>
      <View style={styles.catHeader}>
        <View style={[styles.iconBox, { backgroundColor: cat.color + '1A' }]}>
          <Icon size={20} color={cat.color} />
        </View>
        <BarChart2 size={16} color={colors.textMuted} />
      </View>
      <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginTop: 12 }]}>{cat.name}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4, marginBottom: 16 }}>
        {formatCurrency(cat.budget - cat.spent)} left of {formatCurrency(cat.budget)}
      </Text>
      <ProgressBar value={percent} color={cat.color} height={6} />
      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8, textAlign: 'right' }}>{percent}% Used</Text>
    </Card>
  );
});

export const Budgets = () => {
  const { trackEvent } = useAnalytics('Budgets');
  const { data: rawData, loading, refetch } = useFetch(null, { mockData });
  const { theme, colors } = useTheme();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const data = rawData?.budgets;
  const history = rawData?.spendingHistory;

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState({});

  const handleExport = useCallback(() => {
    trackEvent('Budgets', 'cta_click', 'Export CSV');
    if (rawData && rawData.transactions) {
      exportCSV(rawData.transactions);
      showToast('CSV report exported successfully!', 'success');
    } else {
      showToast('No transaction data to export.', 'warning');
    }
  }, [rawData, trackEvent, showToast]);

  const openAdjustModal = () => {
    if (!data) return;
    setNewTotalBudget(String(data.totalBudget));
    const cats = {};
    data.categories.forEach(c => {
      cats[c.name] = String(c.budget);
    });
    setCategoryBudgets(cats);
    setIsAdjustOpen(true);
  };

  const handleSaveBudget = () => {
    const total = parseFloat(newTotalBudget);
    if (isNaN(total) || total <= 0) {
      showToast('Please enter a valid total budget', 'warning');
      return;
    }

    const updatedCategories = data.categories.map(c => {
      const b = parseFloat(categoryBudgets[c.name]) || c.budget;
      return {
        ...c,
        budget: b
      };
    });

    const updatedSpent = data.spent;
    const updatedRemaining = total - updatedSpent;
    const updatedUtil = Math.round((updatedSpent / total) * 100);

    const updatedData = {
      ...rawData,
      budgets: {
        ...data,
        totalBudget: total,
        remaining: updatedRemaining,
        utilizationPercent: updatedUtil,
        categories: updatedCategories
      }
    };

    localStorage.setItem('app-data', JSON.stringify(updatedData));
    refetch();
    setIsAdjustOpen(false);
    showToast('Budget updated successfully!', 'success');
  };

  if (loading || !data) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.header, isMobile && styles.mobileHeader]}>
          <View>
            <Skeleton width={120} height={12} style={{ marginBottom: 8 }} />
            <Skeleton width={240} height={28} />
          </View>
          <View style={styles.headerActions}>
            <Skeleton width={100} height={36} />
            <Skeleton width={120} height={36} />
          </View>
        </View>

        <Card style={styles.bigStatCard}>
          <View style={styles.statRow}>
            <View>
              <Skeleton width={80} height={12} style={{ marginBottom: 8 }} />
              <Skeleton width={160} height={32} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Skeleton width={100} height={12} style={{ marginBottom: 8 }} />
              <Skeleton width={120} height={24} />
            </View>
          </View>
          <Skeleton width="100%" height={12} style={{ marginVertical: 16 }} />
          <View style={styles.progressLabels}>
            <Skeleton width={30} height={12} />
            <Skeleton width={30} height={12} />
            <Skeleton width={30} height={12} />
          </View>
        </Card>

        <View style={[styles.pillRow, isMobile && styles.mobilePillRow]}>
          <Card style={[styles.pillCard, isMobile && styles.mobilePillCard]}>
            <Skeleton width={80} height={12} style={{ marginBottom: 8 }} />
            <Skeleton width={120} height={24} />
          </Card>
          <Card style={[styles.pillCard, isMobile && styles.mobilePillCard]}>
            <Skeleton width={80} height={12} style={{ marginBottom: 8 }} />
            <Skeleton width={120} height={24} />
          </Card>
        </View>

        <Skeleton width={160} height={20} style={{ marginTop: 8, marginBottom: 16 }} />
        
        <View style={styles.grid}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={[styles.catCard, isMobile && styles.colFull]}>
              <View style={styles.catHeader}>
                <Skeleton width={40} height={40} radius={tokens.radius.md} />
                <Skeleton width={16} height={16} />
              </View>
              <Skeleton width={100} height={16} style={{ marginTop: 12 }} />
              <Skeleton width={140} height={14} style={{ marginTop: 8, marginBottom: 16 }} />
              <Skeleton width="100%" height={6} />
              <Skeleton width={40} height={12} style={{ marginTop: 8, alignSelf: 'flex-end' }} />
            </Card>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Helmet>
        <title>Proton Finance — Wealth Curator | Budgets</title>
        <meta name="description" content="Manage your monthly budget and view spending history." />
        <meta property="og:title" content="Proton Finance — Wealth Curator | Budgets" />
        <meta property="og:type" content="website" />
      </Helmet>
      <View style={[styles.header, isMobile && styles.mobileHeader]}>
        <View>
          <Text style={[tokens.typography.label, { color: colors.textSecondary, marginBottom: 4 }]}>BUDGET OVERVIEW</Text>
          <Text style={[tokens.typography.h1, { color: colors.textPrimary }]}>Wealth Curator Summary</Text>
        </View>
        <View style={styles.headerActions}>
          <Button variant="ghost" icon={Download} onPress={handleExport}>Export Report</Button>
          <Button variant="primary" icon={Settings} onPress={openAdjustModal}>Adjust Budget</Button>
        </View>
      </View>

      <Card style={styles.bigStatCard}>
        <View style={styles.statRow}>
          <View>
            <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>Spent So Far</Text>
            <Text style={[tokens.typography.display, { color: colors.textPrimary, marginTop: 4 }]}>{formatCurrency(data.spent)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>Total Monthly Budget</Text>
            <Text style={[tokens.typography.h2, { color: colors.textPrimary, marginTop: 4 }]}>{formatCurrency(data.totalBudget)}</Text>
          </View>
        </View>
        <ProgressBar value={data.utilizationPercent} height={12} color={colors.primary} style={{ marginVertical: 16 }} />
        <View style={styles.progressLabels}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>0%</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>{data.utilizationPercent}%</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>100%</Text>
        </View>
      </Card>

      <View style={[styles.pillRow, isMobile && styles.mobilePillRow]}>
        <Card style={[styles.pillCard, isMobile && styles.mobilePillCard]}>
          <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>REMAINING</Text>
          <Text style={[tokens.typography.h2, { color: colors.success, marginTop: 4 }]}>{formatCurrency(data.remaining)}</Text>
        </Card>
        <Card style={[styles.pillCard, isMobile && styles.mobilePillCard]}>
          <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>DAILY BURN</Text>
          <Text style={[tokens.typography.h2, { color: colors.warning, marginTop: 4 }]}>{formatCurrency(data.dailyBurn)}</Text>
        </Card>
      </View>

      <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginTop: 32, marginBottom: 16 }]}>Spending Categories</Text>
      
      <View style={styles.grid}>
        {data.categories.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} isMobile={isMobile} colors={colors} />
        ))}
      </View>

      <View style={[styles.bottomRow, isMobile && styles.mobileBottomRow]}>
        <Card style={styles.noteCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Info size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>CURATOR'S NOTE</Text>
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '600', lineHeight: 28, marginBottom: 16 }}>
            You've kept spending under budget for 3 consecutive months.
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22 }}>
            Consider increasing your automated investment contributions by $250/mo to accelerate your wealth building.
          </Text>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginBottom: 24 }]}>Budget History</Text>
          <View style={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke={colors.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={colors.textMuted} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip 
                  cursor={{ fill: colors.border }}
                  contentStyle={{ backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: 8 }}
                  itemStyle={{ color: colors.textPrimary }}
                  labelStyle={{ color: colors.textSecondary, marginBottom: 4 }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {history?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === history.length - 1 ? colors.primary : colors.primary + '66'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </View>
        </Card>
      </View>

      <Modal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} title="Adjust Monthly Budget" size="md">
        <ScrollView style={{ maxHeight: 450 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>Total Monthly Budget ($)</Text>
            <TextInput 
              value={newTotalBudget}
              onChangeText={setNewTotalBudget}
              keyboardType="numeric"
              style={[styles.webFieldInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 12, marginTop: 8 }}>Category Budgets</Text>

          {data?.categories.map(c => (
            <View key={c.name} style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 13, flex: 1 }}>{c.name}</Text>
              <TextInput 
                value={categoryBudgets[c.name] || ''}
                onChangeText={(val) => setCategoryBudgets(prev => ({ ...prev, [c.name]: val }))}
                keyboardType="numeric"
                style={[styles.webFieldInput, { width: 120, color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
                placeholderTextColor={colors.textMuted}
              />
            </View>
          ))}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button variant="ghost" onPress={() => setIsAdjustOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={handleSaveBudget}>Save Changes</Button>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  mobileHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bigStatCard: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  mobilePillRow: {
    flexDirection: 'column',
    gap: 16,
  },
  pillCard: {
    flex: 1,
  },
  mobilePillCard: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 32,
  },
  catCard: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 250,
  },
  colFull: {
    flexBasis: '100%',
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 24,
  },
  mobileBottomRow: {
    flexDirection: 'column',
  },
  chartCard: {
    flex: 1,
  },
  noteCard: {
    flex: 2,
    backgroundColor: tokens.colors.primary,
    backgroundImage: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryHover} 100%)`,
  },
  webFieldInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    borderStyle: 'solid',
  }
});
