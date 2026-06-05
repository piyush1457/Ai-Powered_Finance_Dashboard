import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { AlertTriangle, PiggyBank, TrendingUp, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Skeleton } from '../ui/Skeleton';
import { AlertsModal } from '../modals/AlertsModal';
import { useToast } from '../../context/ToastContext';

const ICONS = { AlertTriangle, PiggyBank, TrendingUp };

export const ActiveAlerts = memo(({ data, isLoading, style }) => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const [dismissed, setDismissed] = useLocalStorage('dismissed-alerts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[tokens.typography.label, { color: colors.textSecondary, marginBottom: 16 }]}>ACTIVE ALERTS</Text>
        {[1, 2, 3].map(i => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Skeleton height={80} radius={12} />
          </View>
        ))}
      </View>
    );
  }

  if (!data) return null;

  const activeAlerts = data.filter(a => !dismissed.includes(a.id));

  const getColor = (type) => {
    switch(type) {
      case 'danger': return colors.danger;
      case 'warning': return colors.warning;
      case 'info': return colors.info;
      default: return colors.primary;
    }
  };

  const handleDismiss = (alertId) => {
    setDismissed(prev => [...prev, alertId]);
    trackEvent('Alerts', 'alert_dismiss', alertId);
    showToast('Alert dismissed', 'info');
  };

  const handleSeeAll = () => {
    trackEvent('Alerts', 'cta_click', 'See all');
    setIsModalOpen(true);
  };

  return (
    <>
      <View style={[styles.container, style, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityRole="alert">
        <View style={styles.panelHeader}>
          <Text style={[styles.panelTitle, { color: colors.textPrimary }]}>Active Alerts</Text>
          <Pressable onPress={handleSeeAll}><Text style={[styles.seeAll, { color: tokens.colors.primary }]}>See all</Text></Pressable>
        </View>
      
      {activeAlerts.length === 0 && (
        <Text style={{ color: colors.textMuted, fontSize: 14 }}>No active alerts.</Text>
      )}

      {activeAlerts.map((alert, index) => {
        const Icon = ICONS[alert.icon] || AlertTriangle;
        const color = getColor(alert.type);
        const isLast = index === activeAlerts.length - 1;

        return (
          <View key={alert.id} style={[styles.alertItem, !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }, isLast && { paddingBottom: 0 }]}>
            <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>
              <Icon size={16} color={color} />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{alert.title}</Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>{alert.body}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>{alert.time || '1h ago'}</Text>
            </View>

            <Pressable 
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.5 }]} 
              onPress={() => handleDismiss(alert.id)}
              accessibilityLabel="Dismiss alert"
            >
              <X size={14} color={colors.textMuted} />
            </Pressable>
          </View>
        );
      })}
      </View>
      <AlertsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} alerts={data} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  panelHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 11.5,
  },
  alertItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 11,
    alignItems: 'flex-start',
    position: 'relative',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    paddingRight: 24, // space for close btn
  },
  title: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  body: {
    fontSize: 11.5,
    lineHeight: 17,
  },
  time: {
    fontSize: 10,
    fontFamily: tokens.typography.mono.fontFamily,
    marginTop: 3,
  },
  closeBtn: {
    position: 'absolute',
    top: 11,
    right: 0,
    padding: 4,
  }
});
