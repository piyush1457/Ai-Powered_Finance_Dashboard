export const mockData = {
  user: { name: 'Piyush Sodhi', tier: 'Premium', avatar: null },
  
  summary: {
    netWorth: { value: 1248390, change: 12.4, period: 'vs last month' },
    monthlySpending: { value: 4250, change: 2.1, period: 'higher than avg' },
    totalSavings: { value: 84120, status: 'On track for Q4 goal' },
  },
  
  heroStrategy: {
    badge: 'PRO STRATEGY INSIGHT',
    title: 'Optimizing your portfolio for the upcoming Q3 market shift.',
    description: 'Our AI analyzed your current allocation and identified 3 key rebalancing opportunities to increase yield by 2.4%.',
    primaryCTA: 'Execute Strategy',
    secondaryCTA: 'Review Audit',
  },
  
  alerts: [
    { id: 1, type: 'danger', icon: 'AlertTriangle', title: 'Subscription Spike', body: '3 new recurring charges detected from "Cloud SaaS" in the last 48h.' },
    { id: 2, type: 'warning', icon: 'PiggyBank', title: 'Emergency Fund Cap', body: 'Your "Rainy Day" fund has reached its target of $20k. Redirecting flows?' },
    { id: 3, type: 'info', icon: 'TrendingUp', title: 'Dividend Reinvestment', body: 'AAPL and MSFT paid dividends today. Automatic reinvestment pending.' },
  ],
  
  spendingComposition: [
    { category: 'Housing & Utilities', percentage: 42, amount: 1785, color: '#6366F1' },
    { category: 'Dining & Leisure', percentage: 18, amount: 765, color: '#F97316' },
    { category: 'Investments', percentage: 25, amount: 1062, color: '#10B981' },
    { category: 'Transportation', percentage: 15, amount: 638, color: '#60A5FA' },
  ],
  
  editorsNote: "Your discretionary spending on 'Dining & Leisure' is down 12% this month. This surplus has been automatically moved to your 'S&P 500' bucket.",
  
  transactions: [
    { id: 1, merchant: 'Apple Store Soho', date: 'Oct 24, 2023', time: '14:20', category: 'TECHNOLOGY', status: 'CLEARED', amount: -1299.00, icon: 'ShoppingBag' },
    { id: 2, merchant: 'Blue Hill Farm', date: 'Oct 23, 2023', time: '20:15', category: 'LIFESTYLE', status: 'CLEARED', amount: -485.20, icon: 'Utensils' },
    { id: 3, merchant: 'ConEd Utility Bill', date: 'Oct 22, 2023', time: '09:00', category: 'UTILITIES', status: 'PENDING', amount: -214.10, icon: 'Zap' },
    { id: 4, merchant: 'Monthly Salary Deposit', date: 'Oct 21, 2023', time: '12:00', category: 'INCOME', status: 'CLEARED', amount: 12500.00, icon: 'DollarSign' },
    { id: 5, merchant: 'Whole Foods Market', date: 'Oct 20, 2023', time: '18:30', category: 'LIFESTYLE', status: 'CLEARED', amount: -156.75, icon: 'ShoppingCart' },
    { id: 6, merchant: 'Netflix Subscription', date: 'Oct 19, 2023', time: '00:00', category: 'ENTERTAINMENT', status: 'CLEARED', amount: -19.99, icon: 'Tv' },
    { id: 7, merchant: 'Uber Ride', date: 'Oct 18, 2023', time: '22:45', category: 'TRANSPORT', status: 'CLEARED', amount: -34.50, icon: 'Car' },
    { id: 8, merchant: 'Goldman Sachs Dividend', date: 'Oct 17, 2023', time: '09:00', category: 'INCOME', status: 'CLEARED', amount: 240.50, icon: 'DollarSign' },
    { id: 9, merchant: 'Spotify Premium', date: 'Oct 16, 2023', time: '00:00', category: 'ENTERTAINMENT', status: 'CLEARED', amount: -9.99, icon: 'Music' },
    { id: 10, merchant: 'Delta Air Lines', date: 'Oct 15, 2023', time: '11:20', category: 'TRAVEL', status: 'CLEARED', amount: -842.10, icon: 'Plane' },
    { id: 11, merchant: 'Le Coucou NYC', date: 'Oct 14, 2023', time: '20:00', category: 'LIFESTYLE', status: 'CLEARED', amount: -312.50, icon: 'Utensils' },
    { id: 12, merchant: 'AWS Cloud Services', date: 'Oct 13, 2023', time: '03:00', category: 'TECHNOLOGY', status: 'CLEARED', amount: -184.00, icon: 'Cloud' },
  ],
  
  spendingHistory: [
    { month: 'May', amount: 3800 }, { month: 'Jun', amount: 4100 },
    { month: 'Jul', amount: 3950 }, { month: 'Aug', amount: 4300 },
    { month: 'Sep', amount: 4180 }, { month: 'Oct', amount: 4250 },
  ],
  
  sectorAllocation: [
    { sector: 'Technology', percentage: 42, change: 14.2 },
    { sector: 'Financials', percentage: 18, change: 2.1 },
    { sector: 'Healthcare', percentage: 15, change: -0.5 },
    { sector: 'Real Estate', percentage: 12, change: 2.4 },
    { sector: 'Other', percentage: 13, change: 1.0 },
  ],
  
  budgets: {
    totalBudget: 4500,
    spent: 3120,
    remaining: 1380,
    daysLeft: 10,
    utilizationPercent: 69,
    dailyBurn: 104,
    categories: [
      { name: 'Housing', budget: 2000, spent: 1800, color: '#6366F1', icon: 'Home' },
      { name: 'Food & Dining', budget: 800, spent: 650, color: '#F59E0B', icon: 'Utensils' },
      { name: 'Transportation', budget: 400, spent: 220, color: '#10B981', icon: 'Car' },
      { name: 'Utilities', budget: 300, spent: 280, color: '#8B5CF6', icon: 'Zap' },
      { name: 'Entertainment', budget: 500, spent: 170, color: '#EF4444', icon: 'Tv' },
    ],
  },
  
  notifications: [
    { id: 1, icon: 'TrendingUp', title: 'Portfolio up 2.4%', body: 'Your investments gained $4,280 today', time: '5m ago', read: false },
    { id: 2, icon: 'AlertCircle', title: 'Unusual spending detected', body: 'Transaction at "Cloud SaaS" needs review', time: '1h ago', read: false },
    { id: 3, icon: 'CheckCircle', title: 'Dividend received', body: 'AAPL paid $240.50 in dividends', time: '3h ago', read: true },
    { id: 4, icon: 'Calendar', title: 'Bill reminder', body: 'ConEd Utility Bill due in 3 days', time: '1d ago', read: true },
  ],
  
  insights: {
    activeSignal: { title: 'REDUCE EXPOSURE', asset: 'Tech Equities', confidence: 84, description: 'High volatility anticipated in upcoming earnings season.' },
    marketSentiment: { score: 62, label: 'Cautiously Optimistic', trend: '+4 pts' },
    portfolioPerformance: [
      { date: 'Jan', value: 1100000 }, { date: 'Feb', value: 1115000 }, { date: 'Mar', value: 1108000 },
      { date: 'Apr', value: 1130000 }, { date: 'May', value: 1150000 }, { date: 'Jun', value: 1185000 },
      { date: 'Jul', value: 1210000 }, { date: 'Aug', value: 1205000 }, { date: 'Sep', value: 1235000 },
      { date: 'Oct', value: 1248390 }
    ],
    cashFlow: [
      { id: 1, title: 'Surplus Opportunity', desc: '$450 monthly surplus identified. Recommend sweeping to High-Yield Savings.', action: 'Transfer Now' },
      { id: 2, title: 'Recurring Audit', desc: '3 idle subscriptions detected ($42/mo). Last used > 90 days ago.', action: 'Cancel Subs' },
      { id: 3, title: 'Tax-Loss Harvesting', desc: 'Realize $3,200 in losses on Emerging Markets ETF to offset gains.', action: 'Review Trade' },
    ]
  },
};
