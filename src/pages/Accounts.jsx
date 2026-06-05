import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, useWindowDimensions, TextInput } from 'react-native';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { tokens } from '../styles/tokens';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { mockData } from '../data/mockData';
import { CreditCard, TrendingUp, PiggyBank, Plus, Landmark, ShieldCheck, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { Helmet } from 'react-helmet-async';

const DEFAULT_ACCOUNTS = [
  { id: '1', name: 'HDFC Checking', type: 'cash', balance: 5420.50, color: '#1c3f94', icon: 'Landmark' },
  { id: '2', name: 'SBI Savings', type: 'cash', balance: 78700.00, color: '#0a83c5', icon: 'PiggyBank' },
  { id: '3', name: 'ICICI Coral Credit Card', type: 'credit', balance: 2450.00, limit: 12000, color: '#f37022', icon: 'CreditCard' },
  { id: '4', name: 'Axis Bank Credit Card', type: 'credit', balance: 1800.00, limit: 10000, color: '#ae1c4f', icon: 'CreditCard' },
  { id: '5', name: 'Zerodha Demat Account', type: 'investment', balance: 116200.00, change: 12.4, color: '#387ed1', icon: 'TrendingUp' }
];

const ICONS = { Landmark, PiggyBank, CreditCard, TrendingUp };

export const Accounts = () => {
  useAnalytics('Accounts');
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [appData, setAppData] = useLocalStorage('app-data', mockData);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkStep, setLinkStep] = useState(1); // 1: Select Bank, 2: Login Form, 3: Loading, 4: Success
  const [selectedBank, setSelectedBank] = useState(null);
  
  // Login input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState('5000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize accounts if they don't exist in app-data or have old US bank names
  const accounts = useMemo(() => {
    const hasOldAccounts = appData.accounts && appData.accounts.some(acc => 
      acc.name.includes('Chase') || acc.name.includes('Capital One') || acc.name.includes('Amex') || acc.name.includes('Vanguard')
    );
    if (!appData.accounts || hasOldAccounts) {
      // Seed default accounts
      setAppData(prev => ({ ...prev, accounts: DEFAULT_ACCOUNTS }));
      return DEFAULT_ACCOUNTS;
    }
    return appData.accounts;
  }, [appData.accounts, setAppData]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    let cashSum = 0;
    let investmentSum = 0;
    let debtSum = 0;
    let totalLimit = 0;

    accounts.forEach(acc => {
      if (acc.type === 'cash') cashSum += acc.balance;
      else if (acc.type === 'investment') investmentSum += acc.balance;
      else if (acc.type === 'credit') {
        debtSum += acc.balance;
        totalLimit += acc.limit;
      }
    });

    const netWorth = cashSum + investmentSum - debtSum;
    const utilizationRate = totalLimit > 0 ? Math.round((debtSum / totalLimit) * 100) : 0;

    // Sync Net Worth to dashboard summary value
    if (appData.summary && appData.summary.netWorth && appData.summary.netWorth.value !== netWorth) {
      setTimeout(() => {
        setAppData(prev => {
          if (!prev.summary) return prev;
          return {
            ...prev,
            summary: {
              ...prev.summary,
              netWorth: { ...prev.summary.netWorth, value: netWorth }
            }
          };
        });
      }, 0);
    }

    return { netWorth, cashSum, investmentSum, debtSum, totalLimit, utilizationRate };
  }, [accounts, appData.summary, setAppData]);

  const handleLinkBank = () => {
    if (!selectedBank) return;
    setIsSubmitting(true);
    setLinkStep(3); // Loading screen

    setTimeout(() => {
      // Mock account payload
      const bal = parseFloat(balance) || 5000.00;
      const isCredit = selectedBank.defaultType === 'credit';
      const isInvestment = selectedBank.defaultType === 'investment';
      const suffix = isCredit ? 'Credit Card' : (isInvestment ? 'Demat Account' : 'Savings');
      const newAccount = {
        id: Date.now().toString(),
        name: `${selectedBank.name} ${suffix}`,
        type: selectedBank.defaultType,
        balance: isCredit ? 0 : bal,
        ...(isCredit && { limit: 8000, balance: Math.round(bal * 0.15) }), // credit starts with 15% limit spent
        color: selectedBank.color,
        icon: isCredit ? 'CreditCard' : (isInvestment ? 'TrendingUp' : 'PiggyBank')
      };

      setAppData(prev => ({
        ...prev,
        accounts: [...(prev.accounts || DEFAULT_ACCOUNTS), newAccount]
      }));

      setLinkStep(4); // Success screen
      showToast(`${selectedBank.name} linked successfully!`, 'success');
      
      setTimeout(() => {
        setIsLinkModalOpen(false);
        // Reset states
        setLinkStep(1);
        setSelectedBank(null);
        setUsername('');
        setPassword('');
        setBalance('5000');
        setIsSubmitting(false);
      }, 2000);
    }, 2000);
  };

  const handleDeleteAccount = (id, name) => {
    setAppData(prev => ({
      ...prev,
      accounts: (prev.accounts || []).filter(a => a.id !== id)
    }));
    showToast(`Unlinked ${name} successfully.`, 'warning');
  };

  const BANK_LIST = [
    { name: 'HDFC Bank', color: '#1c3f94', defaultType: 'cash' },
    { name: 'State Bank of India', color: '#0a83c5', defaultType: 'cash' },
    { name: 'ICICI Bank', color: '#f37022', defaultType: 'cash' },
    { name: 'Axis Bank', color: '#ae1c4f', defaultType: 'credit' },
    { name: 'Kotak Mahindra Bank', color: '#ed1c24', defaultType: 'cash' },
    { name: 'Zerodha', color: '#387ed1', defaultType: 'investment' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Helmet>
        <title>Proton Finance — Wealth Curator | Accounts</title>
        <meta name="description" content="Manage and sync checking, credit, and investment accounts." />
      </Helmet>

      <View style={[styles.header, isMobile && styles.mobileHeader]}>
        <View>
          <Text style={[tokens.typography.label, { color: colors.textSecondary, marginBottom: 4 }]}>BALANCES & ASSETS</Text>
          <Text style={[tokens.typography.h1, { color: colors.textPrimary }]}>Linked Institutions</Text>
        </View>
        <Button variant="primary" icon={Plus} onPress={() => setIsLinkModalOpen(true)}>Link Bank Account</Button>
      </View>

      {/* Summary Cards */}
      <View style={[styles.statsRow, isMobile && styles.mobileStatsRow]}>
        <Card style={styles.statCard}>
          <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>NET WORTH</Text>
          <Text style={[tokens.typography.display, { color: colors.textPrimary, marginTop: 8 }]}>{formatCurrency(stats.netWorth)}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Aggregated cash & investments minus debt</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>TOTAL CREDIT DEBT</Text>
          <Text style={[tokens.typography.h1, { color: colors.textPrimary, marginTop: 8 }]}>{formatCurrency(stats.debtSum)}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Across {accounts.filter(a => a.type === 'credit').length} cards</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.utilHeader}>
            <Text style={[tokens.typography.label, { color: colors.textSecondary }]}>CREDIT UTILIZATION</Text>
            <Badge variant={stats.utilizationRate > 30 ? 'danger' : 'success'}>{stats.utilizationRate}%</Badge>
          </View>
          <ProgressBar 
            value={stats.utilizationRate} 
            color={stats.utilizationRate > 30 ? tokens.colors.danger : tokens.colors.green} 
            height={8} 
            style={{ marginVertical: 12, backgroundColor: colors.surfaceElevated }} 
          />
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Target utilization is under 30%</Text>
        </Card>
      </View>

      {/* Account Categories */}
      <Text style={[tokens.typography.h3, { color: colors.textPrimary, marginTop: 32, marginBottom: 16 }]}>Account List</Text>
      
      <View style={styles.grid}>
        {accounts.map(acc => {
          const IconComponent = ICONS[acc.icon] || Landmark;
          return (
            <Card key={acc.id} style={[styles.accCard, isMobile && styles.colFull]}>
              <View style={styles.accCardHeader}>
                <View style={[styles.iconBox, { backgroundColor: acc.color + '15' }]}>
                  <IconComponent size={20} color={acc.color} />
                </View>
                <Pressable onPress={() => handleDeleteAccount(acc.id, acc.name)} accessibilityLabel={`Unlink ${acc.name}`}>
                  <Trash2 size={16} color={colors.textMuted} hoverColor={tokens.colors.danger} />
                </Pressable>
              </View>

              <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginTop: 12 }]}>{acc.name}</Text>
              
              {acc.type === 'credit' ? (
                <>
                  <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4, marginBottom: 12 }}>
                    {formatCurrency(acc.balance)} spent of {formatCurrency(acc.limit)}
                  </Text>
                  <ProgressBar value={Math.round((acc.balance / acc.limit) * 100)} color={acc.color} height={4} style={{ backgroundColor: colors.surfaceElevated }} />
                </>
              ) : (
                <Text style={[tokens.typography.h2, { color: colors.textPrimary, marginTop: 8 }]}>
                  {formatCurrency(acc.balance)}
                </Text>
              )}

              {acc.type === 'investment' && acc.change && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ color: tokens.colors.green, fontSize: 12, fontWeight: '600' }}>↗ {acc.change}% this month</Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>

      {/* Link Account Plaid Simulation Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Link Bank Account via Plaid" size="md">
        {linkStep === 1 && (
          <View style={styles.modalBody}>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Securely connect your financial institution to aggregate balance metrics in real-time.
            </Text>
            <View style={styles.bankGrid}>
              {BANK_LIST.map(bank => (
                <Pressable 
                  key={bank.name} 
                  style={[
                    styles.bankChip, 
                    { borderColor: colors.border },
                    selectedBank?.name === bank.name && { borderColor: tokens.colors.primary, backgroundColor: colors.surfaceHighlight }
                  ]}
                  onPress={() => setSelectedBank(bank)}
                >
                  <View style={[styles.bankBullet, { backgroundColor: bank.color }]} />
                  <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>{bank.name}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button variant="ghost" onPress={() => setIsLinkModalOpen(false)}>Cancel</Button>
              <Button variant="primary" disabled={!selectedBank} onPress={() => setLinkStep(2)}>
                Continue
              </Button>
            </View>
          </View>
        )}

        {linkStep === 2 && (
          <View style={styles.modalBody}>
            <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
              Log in to {selectedBank?.name}
            </Text>
            <TextInput 
              placeholder="Username" 
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              style={[styles.webInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
            />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={[styles.webInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border, marginTop: 10 }]} 
            />
            
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>Simulate Initial Balance ($)</Text>
              <TextInput 
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
                style={[styles.webInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={[styles.modalActions, { marginTop: 20 }]}>
              <Button variant="ghost" onPress={() => setLinkStep(1)}>Back</Button>
              <Button variant="primary" disabled={!username || !password} onPress={handleLinkBank}>
                Authorize Link
              </Button>
            </View>
          </View>
        )}

        {linkStep === 3 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.primary} />
            <Text style={{ color: colors.textPrimary, marginTop: 16, fontWeight: '500' }}>Verifying credentials with your institution...</Text>
          </View>
        )}

        {linkStep === 4 && (
          <View style={styles.loadingContainer}>
            <ShieldCheck size={48} color={tokens.colors.green} />
            <Text style={{ color: colors.textPrimary, marginTop: 16, fontSize: 16, fontWeight: '600' }}>Connection Secure</Text>
            <Text style={{ color: colors.textSecondary, marginTop: 4, fontSize: 12 }}>Account synced. Importing ledger histories.</Text>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: tokens.spacing.xl },
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
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  mobileStatsRow: {
    flexDirection: 'column',
  },
  statCard: {
    flex: 1,
  },
  utilHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  accCard: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 260,
  },
  colFull: {
    flexBasis: '100%',
  },
  accCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 4,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  bankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: 8,
    cursor: 'pointer',
  },
  bankBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  webInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    borderStyle: 'solid',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  }
});
