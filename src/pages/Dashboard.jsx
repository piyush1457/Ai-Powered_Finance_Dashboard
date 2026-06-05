import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useFetch } from '../hooks/useFetch';
import { mockData } from '../data/mockData';
import { generateInsights } from '../utils/generateInsights';
import { tokens } from '../styles/tokens';
import { Helmet } from 'react-helmet-async';

import { SummaryCards } from '../components/dashboard/SummaryCards';
import { AIStrategyCard } from '../components/dashboard/AIStrategyCard';
import { ActiveAlerts } from '../components/dashboard/ActiveAlerts';
import { SpendingComposition } from '../components/dashboard/SpendingComposition';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Dashboard() {
  const { data, loading } = useFetch(null, { mockData });
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  useAnalytics('Dashboard');

  const insights = useMemo(() => generateInsights(data), [data]);

  return (
    <View style={styles.container}>
      <Helmet>
        <title>Proton Finance — Wealth Curator | Dashboard</title>
        <meta name="description" content="Premium AI-powered personal finance dashboard. Track net worth, optimize spending, and execute intelligent investment strategies." />
        <meta property="og:title" content="Proton Finance — Wealth Curator" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SummaryCards data={data?.summary} isLoading={loading} />

      <View style={[styles.row, isMobile && styles.mobileRow]}>
        <AIStrategyCard 
          data={insights?.heroStrategy} 
          isLoading={loading} 
          style={[styles.col2, isMobile && styles.colFull]} 
        />
        <ActiveAlerts 
          data={insights?.alerts} 
          isLoading={loading} 
          style={[styles.col1, isMobile && styles.colFull]} 
        />
      </View>

      <View style={[styles.row, isMobile && styles.mobileRow]}>
        <SpendingComposition 
          data={data?.spendingComposition} 
          editorsNote={insights?.editorsNote} 
          isLoading={loading} 
          style={[styles.col1, isMobile && styles.colFull]} 
        />
        <RecentActivity 
          data={data?.transactions} 
          isLoading={loading} 
          style={[styles.col2, isMobile && styles.colFull]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  mobileRow: {
    flexDirection: 'column',
  },
  col2: {
    flex: 2,
  },
  col1: {
    flex: 1,
  },
  colFull: {
    width: '100%',
    flex: undefined,
  }
});
