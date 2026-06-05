import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDebounce } from '../hooks/useDebounce';
import { tokens } from '../styles/tokens';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';
import { mockData } from '../data/mockData';
import { 
  ArrowUpDown, Plus, Search, Trash2, Eye, ChevronLeft, ChevronRight, 
  Calendar, CheckCircle, Clock, ShoppingBag, Utensils, Zap, DollarSign, 
  ShoppingCart, Tv, Car, Music, Plane, Cloud, Circle 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ICONS = { ShoppingBag, Utensils, Zap, DollarSign, ShoppingCart, Tv, Car, Music, Plane, Cloud, Circle };

const CATEGORIES = ['ALL', 'TECHNOLOGY', 'LIFESTYLE', 'UTILITIES', 'INCOME', 'ENTERTAINMENT', 'TRANSPORT', 'TRAVEL'];
const STATUSES = ['ALL', 'CLEARED', 'PENDING'];

export const Transactions = () => {
  useAnalytics('Transactions');
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const location = useLocation();

  const [appData, setAppData] = useLocalStorage('app-data', mockData);
  
  // Filtering states
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialSearch = queryParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const searchVal = queryParams.get('search');
    if (searchVal !== null) {
      setSearch(searchVal);
    }
  }, [queryParams]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL'); // ALL, 30DAYS, THISMONTH

  // Sorting states
  const [sortField, setSortField] = useState('date'); // date, merchant, category, amount
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTx, setActiveTx] = useState(null);

  // New Transaction Form states
  const [newMerchant, setNewMerchant] = useState('');
  const [newCategory, setNewCategory] = useState('LIFESTYLE');
  const [newStatus, setNewStatus] = useState('CLEARED');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('expense'); // expense, income

  // Safety list wrapper
  const transactionsList = useMemo(() => {
    return appData?.transactions || mockData.transactions;
  }, [appData?.transactions]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filtered & Sorted list
  const processedData = useMemo(() => {
    let filtered = [...transactionsList];

    // Search query match
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.merchant.toLowerCase().includes(q) || 
        tx.category.toLowerCase().includes(q)
      );
    }

    // Category match
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(tx => tx.category.toUpperCase() === selectedCategory);
    }

    // Status match
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(tx => tx.status.toUpperCase() === selectedStatus);
    }

    // Date range match
    if (dateRange !== 'ALL') {
      const today = new Date();
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        const diffTime = Math.abs(today - txDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateRange === '30DAYS') {
          return diffDays <= 30;
        } else if (dateRange === 'THISMONTH') {
          return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
        }
        return true;
      });
    }

    // Sort operations
    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactionsList, debouncedSearch, selectedCategory, selectedStatus, dateRange, sortField, sortDirection]);

  // Paginated items
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;

  // Form submit handler
  const handleAddTransaction = () => {
    if (!newMerchant || !newAmount) {
      showToast('Please fill out all fields', 'warning');
      return;
    }

    const amt = parseFloat(newAmount);
    if (isNaN(amt)) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }

    const today = new Date();
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${shortMonths[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    const newTx = {
      id: Date.now(),
      merchant: newMerchant,
      date: formattedDate,
      time: formattedTime,
      category: newCategory.toUpperCase(),
      status: newStatus.toUpperCase(),
      amount: newType === 'expense' ? -Math.abs(amt) : Math.abs(amt),
      icon: newType === 'income' ? 'DollarSign' : 'ShoppingBag'
    };

    setAppData(prev => ({
      ...prev,
      transactions: [newTx, ...(prev.transactions || mockData.transactions)]
    }));

    setIsAddModalOpen(false);
    showToast('Transaction added successfully!', 'success');
    
    // Reset Form
    setNewMerchant('');
    setNewAmount('');
    setNewCategory('LIFESTYLE');
    setNewStatus('CLEARED');
    setNewType('expense');
    setCurrentPage(1);
  };

  // Delete handler
  const handleDeleteTransaction = () => {
    if (!activeTx) return;

    setAppData(prev => ({
      ...prev,
      transactions: (prev.transactions || mockData.transactions).filter(tx => tx.id !== activeTx.id)
    }));

    setIsDeleteConfirmOpen(false);
    setActiveTx(null);
    showToast('Transaction deleted successfully.', 'warning');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Helmet>
        <title>Proton Finance — Wealth Curator | Transactions</title>
        <meta name="description" content="Search, filter, and audit your personal finance transactional ledger histories." />
      </Helmet>

      <View style={[styles.header, isMobile && styles.mobileHeader]}>
        <View>
          <Text style={[tokens.typography.label, { color: colors.textSecondary, marginBottom: 4 }]}>LEGER LOGS</Text>
          <Text style={[tokens.typography.h1, { color: colors.textPrimary }]}>Financial Ledger</Text>
        </View>
        <Button variant="primary" icon={Plus} onPress={() => setIsAddModalOpen(true)}>Add Transaction</Button>
      </View>

      {/* Filter Options */}
      <Card style={styles.filterCard}>
        <View style={[styles.searchRow, isMobile && styles.mobileSearchRow]}>
          <View style={[styles.searchBox, { borderColor: colors.border2, backgroundColor: colors.surfaceElevated }]}>
            <Search size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput 
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search merchants, categories..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Quick Dates */}
          <View style={styles.tabRow}>
            {[
              { label: 'All Time', value: 'ALL' },
              { label: 'Last 30 Days', value: '30DAYS' },
              { label: 'This Month', value: 'THISMONTH' }
            ].map(item => (
              <Pressable 
                key={item.value} 
                onPress={() => { setDateRange(item.value); setCurrentPage(1); }} 
                style={[styles.tab, dateRange === item.value && { backgroundColor: colors.surfaceHighlight }]}
              >
                <Text style={{ fontSize: 12, color: dateRange === item.value ? colors.textPrimary : colors.textSecondary, fontWeight: '500' }}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.selectorsRow, isMobile && styles.mobileSelectorsRow]}>
          {/* Category Selector */}
          <View style={styles.selectCol}>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 4, fontWeight: '600' }}>CATEGORY</Text>
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              style={StyleSheet.flatten([styles.selectBox, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceElevated }])}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </View>

          {/* Status Selector */}
          <View style={styles.selectCol}>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 4, fontWeight: '600' }}>STATUS</Text>
            <select
              value={selectedStatus}
              onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              style={StyleSheet.flatten([styles.selectBox, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceElevated }])}
            >
              {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </View>
        </View>
      </Card>

      {/* Ledger Table */}
      <Card style={{ padding: 0, overflow: 'hidden', marginTop: 20 }}>
        {/* Table Headers */}
        <View style={[styles.tableHeader, { backgroundColor: colors.surfaceElevated, borderBottomColor: colors.border }]}>
          <Pressable style={styles.merchantCol} onPress={() => handleSort('merchant')}>
            <View style={styles.thContent}>
              <Text style={[styles.thText, { color: colors.textMuted }]}>MERCHANT</Text>
              <ArrowUpDown size={10} color={colors.textMuted} />
            </View>
          </Pressable>

          <Pressable style={styles.categoryCol} onPress={() => handleSort('category')}>
            <View style={styles.thContent}>
              <Text style={[styles.thText, { color: colors.textMuted }]}>CATEGORY</Text>
              <ArrowUpDown size={10} color={colors.textMuted} />
            </View>
          </Pressable>

          <Pressable style={styles.statusCol} onPress={() => handleSort('status')}>
            <View style={styles.thContent}>
              <Text style={[styles.thText, { color: colors.textMuted }]}>STATUS</Text>
              <ArrowUpDown size={10} color={colors.textMuted} />
            </View>
          </Pressable>

          <Pressable style={styles.amountCol} onPress={() => handleSort('amount')}>
            <View style={[styles.thContent, { justifyContent: 'flex-end' }]}>
              <Text style={[styles.thText, { color: colors.textMuted }]}>AMOUNT</Text>
              <ArrowUpDown size={10} color={colors.textMuted} />
            </View>
          </Pressable>

          <View style={styles.actionsCol}>
            <Text style={[styles.thText, { color: colors.textMuted, textAlign: 'center' }]}>ACTIONS</Text>
          </View>
        </View>

        {/* Table Rows */}
        {paginatedData.length > 0 ? (
          paginatedData.map(tx => {
            const Icon = ICONS[tx.icon] || Circle;
            return (
              <View key={tx.id} style={[styles.txRow, { borderBottomColor: colors.border }]}>
                <View style={styles.merchantCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
                      <Icon size={15} color={colors.textSecondary} />
                    </View>
                    <View style={{ flexShrink: 1 }}>
                      <Text style={[styles.merchantText, { color: colors.textPrimary }]} numberOfLines={1}>{tx.merchant}</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 11, fontFamily: tokens.typography.mono.fontFamily }}>{tx.date} • {tx.time}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.categoryCol}>
                  <View style={[styles.badge, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={{ fontSize: 9.5, fontWeight: '600', color: colors.textSecondary }}>{tx.category}</Text>
                  </View>
                </View>

                <View style={styles.statusCol}>
                  <View style={styles.statusWrap}>
                    {tx.status === 'CLEARED' ? (
                      <CheckCircle size={12} color={tokens.colors.green} />
                    ) : (
                      <Clock size={12} color={tokens.colors.warning} />
                    )}
                    <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '500' }}>{tx.status}</Text>
                  </View>
                </View>

                <View style={styles.amountCol}>
                  <Text style={[
                    styles.amountText,
                    { color: tx.amount < 0 ? colors.textPrimary : tokens.colors.green }
                  ]}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </Text>
                </View>

                <View style={styles.actionsCol}>
                  <View style={styles.rowActions}>
                    <Pressable 
                      style={[styles.actionBtn, { backgroundColor: colors.surfaceElevated }]}
                      onPress={() => { setActiveTx(tx); setIsDetailsOpen(true); }}
                      accessibilityLabel="View details"
                    >
                      <Eye size={12} color={colors.textSecondary} />
                    </Pressable>
                    <Pressable 
                      style={[styles.actionBtn, { backgroundColor: colors.surfaceElevated }]}
                      onPress={() => { setActiveTx(tx); setIsDeleteConfirmOpen(true); }}
                      accessibilityLabel="Delete record"
                    >
                      <Trash2 size={12} color={tokens.colors.red} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textMuted }}>No transactions match your current filters.</Text>
          </View>
        )}

        {/* Pagination Footer */}
        <View style={[styles.paginationRow, { borderTopColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>
            Showing {processedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length} records
          </Text>
          
          <View style={styles.pagerControls}>
            <Pressable 
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(p => Math.max(p - 1, 1))}
              style={[styles.pagerBtn, currentPage === 1 && { opacity: 0.4 }]}
            >
              <ChevronLeft size={16} color={colors.textPrimary} />
            </Pressable>
            <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
              {currentPage} / {totalPages}
            </Text>
            <Pressable 
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              style={[styles.pagerBtn, currentPage === totalPages && { opacity: 0.4 }]}
            >
              <ChevronRight size={16} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>
      </Card>

      {/* Add Transaction Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Record New Transaction" size="md">
        <View style={styles.formContainer}>
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Type</Text>
            <View style={styles.typeSelector}>
              <Pressable 
                style={[styles.typeBtn, newType === 'expense' && { backgroundColor: tokens.colors.primary }]}
                onPress={() => setNewType('expense')}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: newType === 'expense' ? '#fff' : colors.textSecondary }}>Expense</Text>
              </Pressable>
              <Pressable 
                style={[styles.typeBtn, newType === 'income' && { backgroundColor: tokens.colors.primary }]}
                onPress={() => setNewType('income')}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: newType === 'income' ? '#fff' : colors.textSecondary }}>Income</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Merchant Name</Text>
            <TextInput 
              placeholder="e.g. Starbucks, Target"
              placeholderTextColor={colors.textMuted}
              value={newMerchant}
              onChangeText={setNewMerchant}
              style={[styles.webFieldInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
            />
          </View>

          <View style={styles.formRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Category</Text>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                style={StyleSheet.flatten([styles.webSelectInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }])}
              >
                {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Status</Text>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                style={StyleSheet.flatten([styles.webSelectInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }])}
              >
                <option value="CLEARED">CLEARED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Amount ($)</Text>
            <TextInput 
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
              style={[styles.webFieldInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
            />
          </View>

          <View style={styles.formActions}>
            <Button variant="ghost" onPress={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={handleAddTransaction}>Save Transaction</Button>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Delete Transaction?" size="sm">
        <View style={{ padding: 4 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 13.5, lineHeight: 19, marginBottom: 20 }}>
            Are you sure you want to permanently delete this transaction record for <Text style={{ fontWeight: '700', color: colors.textPrimary }}>"{activeTx?.merchant}"</Text>? This operation cannot be undone.
          </Text>
          <View style={styles.formActions}>
            <Button variant="ghost" onPress={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onPress={handleDeleteTransaction}>Confirm Delete</Button>
          </View>
        </View>
      </Modal>

      {/* Inspect Detail Drawer Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Audit Transaction Details" size="md">
        {activeTx && (
          <View style={{ padding: 4 }}>
            <View style={[styles.detailCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <View style={styles.detailCardHeader}>
                <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700' }}>TRANSACTION LOG ID: #{activeTx.id}</Text>
                <Badge variant={activeTx.status === 'CLEARED' ? 'success' : 'warning'}>{activeTx.status}</Badge>
              </View>
              
              <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginVertical: 12 }}>
                {activeTx.merchant}
              </Text>
              
              <Text style={{ fontSize: 22, fontWeight: '700', color: activeTx.amount < 0 ? colors.textPrimary : tokens.colors.green }}>
                {activeTx.amount > 0 ? '+' : ''}{formatCurrency(activeTx.amount)}
              </Text>
            </View>

            <View style={styles.metadataGrid}>
              <View style={[styles.metaRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Processing Date</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>{activeTx.date} at {activeTx.time}</Text>
              </View>
              <View style={[styles.metaRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Budget Category</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>{activeTx.category}</Text>
              </View>
              <View style={[styles.metaRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Base Currency</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>USD ($)</Text>
              </View>
              <View style={[styles.metaRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Clearing Institution</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>Chase Bank Clearing Center</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>System Routing ID</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12.5, fontFamily: tokens.typography.mono.fontFamily }}>
                  tx_ref_{String(activeTx.id).slice(-6)}
                </Text>
              </View>
            </View>

            <View style={[styles.formActions, { marginTop: 24 }]}>
              <Button variant="primary" style={{ width: '100%' }} onPress={() => setIsDetailsOpen(false)}>
                Close Auditor
              </Button>
            </View>
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
  filterCard: {
    padding: 20,
    gap: 16,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  mobileSearchRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 240,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    borderWidth: 0,
    outlineStyle: 'none',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    cursor: 'pointer',
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  mobileSelectorsRow: {
    flexDirection: 'column',
  },
  selectCol: {
    flex: 1,
  },
  selectBox: {
    width: '100%',
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 13,
    borderStyle: 'solid',
    outlineStyle: 'none',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  thContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  thText: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  merchantCol: { flex: 2, paddingRight: 10 },
  categoryCol: { flex: 1.2 },
  statusCol: { flex: 1.2 },
  amountCol: { flex: 1, alignItems: 'flex-end', paddingRight: 10 },
  actionsCol: { flex: 1, alignItems: 'center' },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  merchantText: {
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amountText: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: tokens.typography.mono.fontFamily,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  pagerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pagerBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  formContainer: {
    padding: 4,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 3,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    cursor: 'pointer',
  },
  webFieldInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    borderStyle: 'solid',
  },
  formRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  webSelectInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    borderStyle: 'solid',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  detailCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataGrid: {
    gap: 12,
    paddingHorizontal: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  }
});
