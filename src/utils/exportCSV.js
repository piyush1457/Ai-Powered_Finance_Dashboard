export const exportCSV = (transactions) => {
  const csv = [
    ['Date', 'Merchant', 'Category', 'Status', 'Amount'].join(','),
    ...transactions.map(t => [
      t.date, 
      `"${t.merchant}"`, 
      t.category, 
      t.status, 
      t.amount
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  // Use a standard web approach since we're in react-native-web
  if (typeof document !== 'undefined') {
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
