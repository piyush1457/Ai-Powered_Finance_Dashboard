import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { useFetch } from '../hooks/useFetch';
import { mockData } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { tokens } from '../styles/tokens';
import { useTheme } from '../context/ThemeContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Zap, ShieldAlert, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

export const Insights = () => {
  useAnalytics('Insights');
  const { data: rawData, loading } = useFetch(null, { mockData });
  const { theme, colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  const [timeframe, setTimeframe] = useState('1Y');

  const data = rawData?.insights;
  const sectors = rawData?.sectorAllocation;

  const filteredPerformance = useMemo(() => {
    if (!data?.portfolioPerformance) return [];
    switch (timeframe) {
      case '1M':
        return data.portfolioPerformance.slice(-2);
      case '3M':
        return data.portfolioPerformance.slice(-4);
      case '1Y':
      case 'ALL':
      default:
        return data.portfolioPerformance;
    }
  }, [data?.portfolioPerformance, timeframe]);

  if (loading || !data) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Skeleton width={120} height={12} style={{ marginBottom: 8 }} />
          <Skeleton width={200} height={28} />
        </View>

        <View style={[styles.topRow, isMobile && styles.mobileTopRow]}>
          <Card style={[styles.signalCard, isMobile && styles.colFull]}>
            <View style={styles.signalHeader}>
              <Skeleton width={100} height={16} />
              <Skeleton width={80} height={14} />
            </View>
            <Skeleton width="60%" height={32} style={{ marginTop: 16 }} />
            <Skeleton width="40%" height={24} style={{ marginTop: 8 }} />
            <Skeleton width="100%" height={40} style={{ marginTop: 16 }} />
          </Card>

          <Card style={[styles.sentimentCard, isMobile && styles.colFull]}>
            <Skeleton width={120} height={18} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Skeleton width={140} height={140} radius={70} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Skeleton width={100} height={18} style={{ alignSelf: 'center' }} />
          </Card>
        </View>

        <View style={[styles.middleRow, isTablet && styles.mobileTopRow]}>
          <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Skeleton width={180} height={20} />
              <Skeleton width={140} height={32} />
            </View>
            <Skeleton width="100%" height={260} style={{ marginTop: 24 }} />
          </Card>

          <Card style={styles.sectorCard}>
            <Skeleton width={120} height={20} style={{ marginBottom: 24 }} />
            <View style={styles.sectorList}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={styles.sectorRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Skeleton width={10} height={10} radius={5} style={{ marginRight: 12 }} />
                    <Skeleton width={80} height={16} />
                  </View>
                  <Skeleton width={40} height={16} />
                </View>
              ))}
            </View>
          </Card>
        </View>

        <Skeleton width={180} height={20} style={{ marginTop: 8, marginBottom: 16 }} />

        <View style={[styles.bottomRow, isMobile && styles.mobileBottomRow]}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={styles.cfCard}>
              <Skeleton width={48} height={48} radius={tokens.radius.md} style={{ marginBottom: 16 }} />
              <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={44} />
            </Card>
          ))}
        </View>
      </ScrollView>
    );
  }

  const pieData = [
    { name: 'Score', value: data.marketSentiment.score },
    { name: 'Remaining', value: 100 - data.marketSentiment.score }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Helmet>
        <title>Proton Finance | Wealth Curator | Insights</title>
        <meta name="description" content="AI-powered insights for your portfolio." />
        <meta property="og:title" content="Proton Finance | Wealth Curator | Insights" />
        <meta property="og:type" content="website" />
      </Helmet>
      <View style={styles.header}>
        <Text style={[tokens.typography.label, { color: colors.textSecondary, marginBottom: 4 }]}>WEALTH INTELLIGENCE</Text>
        <Text style={[tokens.typography.h1, { color: colors.textPrimary }]}>Portfolio Insights</Text>
      </View>

      <View style={[styles.topRow, isMobile && styles.mobileTopRow]}>
        <Card style={[styles.signalCard, isMobile && styles.colFull]}>
          <View style={styles.signalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AlertTriangle size={20} color={colors.warning} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.warning, fontSize: 14, fontWeight: '700', letterSpacing: 0.5 }}>ACTIVE SIGNAL</Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{data.activeSignal.confidence}% Confidence</Text>
          </View>
          <Text style={[tokens.typography.display, { color: colors.textPrimary, marginTop: 16 }]}>{data.activeSignal.title}</Text>
          <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginTop: 4 }]}>{data.activeSignal.asset}</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 16, marginTop: 12, lineHeight: 24 }}>
            {data.activeSignal.description}
          </Text>
        </Card>

        <Card style={[styles.sentimentCard, isMobile && styles.colFull]}>
          <Text style={[tokens.typography.h3, { color: colors.textPrimary, textAlign: 'center' }]}>Market Sentiment</Text>
          <View style={{ height: 160, width: '100%', marginTop: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={100}
                  outerRadius={120}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={colors.success} />
                  <Cell fill={colors.border} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <View style={{ position: 'absolute', bottom: 10, alignItems: 'center' }}>
              <Text style={[tokens.typography.display, { color: colors.textPrimary }]}>{data.marketSentiment.score}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '600' }}>{data.marketSentiment.label}</Text>
            <Text style={{ color: colors.success, fontSize: 14, fontWeight: '500', marginTop: 4 }}>↗ {data.marketSentiment.trend}</Text>
          </View>
        </Card>
      </View>

      <View style={[styles.middleRow, isTablet && styles.mobileTopRow]}>
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={[tokens.typography.h3, { color: colors.textPrimary }]}>Portfolio Performance</Text>
            <View style={styles.tabs}>
              {['1M', '3M', '1Y', 'ALL'].map(t => (
                <Pressable key={t} onPress={() => setTimeframe(t)} style={[styles.tab, timeframe === t && { backgroundColor: colors.primary + '1A' }]}>
                  <Text style={[styles.tabText, { color: timeframe === t ? colors.primary : colors.textSecondary }]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={{ height: 300, width: '100%', marginTop: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredPerformance} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke={colors.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={colors.textMuted} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} orientation="right" />
                <RechartsTooltip 
                  cursor={{ stroke: colors.border, strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: 8 }}
                  itemStyle={{ color: colors.textPrimary }}
                  labelStyle={{ color: colors.textSecondary, marginBottom: 4 }}
                  formatter={(value) => [formatCurrency(value), 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke={colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </View>
        </Card>

        <Card style={styles.sectorCard}>
          <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginBottom: 24 }]}>Sector Allocation</Text>
          <View style={styles.sectorList}>
            {sectors?.map((sector, idx) => {
              const itemColors = [colors.primary, colors.info, colors.success, colors.warning, colors.textMuted];
              const c = itemColors[idx % itemColors.length];
              return (
                <View key={sector.sector} style={styles.sectorRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.bullet, { backgroundColor: c }]} />
                    <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '500' }}>{sector.sector}</Text>
                  </View>
                  <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>{sector.percentage}%</Text>
                </View>
              );
            })}
          </View>
        </Card>
      </View>

      <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginTop: 32, marginBottom: 16 }]}>Cash Flow Intelligence</Text>
      
      <View style={[styles.bottomRow, isMobile && styles.mobileBottomRow]}>
        {data.cashFlow.map(cf => (
          <Card key={cf.id} style={styles.cfCard}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '1A', marginBottom: 16 }]}>
              {cf.id === 1 && <TrendingUp size={20} color={colors.primary} />}
              {cf.id === 2 && <ShieldAlert size={20} color={colors.primary} />}
              {cf.id === 3 && <Zap size={20} color={colors.primary} />}
            </View>
            <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginBottom: 8 }]}>{cf.title}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>{cf.desc}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: tokens.spacing.xl },
  header: { marginBottom: 32 },
  topRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  mobileTopRow: { flexDirection: 'column' },
  colFull: { flexBasis: '100%', width: '100%' },
  signalCard: { flex: 2 },
  signalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sentimentCard: { flex: 1 },
  middleRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  chartCard: { flex: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: tokens.radius.md, padding: 4 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: tokens.radius.sm },
  tabText: { fontSize: 13, fontWeight: '600' },
  sectorCard: { flex: 1 },
  sectorList: { gap: 20 },
  sectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bullet: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  bottomRow: { flexDirection: 'row', gap: 24 },
  mobileBottomRow: { flexDirection: 'column' },
  cfCard: { flex: 1 },
  iconBox: { width: 48, height: 48, borderRadius: tokens.radius.md, alignItems: 'center', justifyContent: 'center' }
});
