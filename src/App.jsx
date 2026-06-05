import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { View, Text, StyleSheet } from 'react-native';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { TestPrimitives } from './pages/TestPrimitives';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Budgets = React.lazy(() => import('./pages/Budgets').then(m => ({ default: m.Budgets })));
const Insights = React.lazy(() => import('./pages/Insights').then(m => ({ default: m.Insights })));
const Transactions = React.lazy(() => import('./pages/Transactions').then(m => ({ default: m.Transactions })));
const Accounts = React.lazy(() => import('./pages/Accounts').then(m => ({ default: m.Accounts })));

const PageSkeleton = () => <View style={styles.page}><Text>Loading...</Text></View>;

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <View style={styles.appContainer}>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/budgets" element={<Budgets />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/test" element={<TestPrimitives />} />
                </Route>
              </Routes>
            </Suspense>
          </View>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    height: '100%',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
