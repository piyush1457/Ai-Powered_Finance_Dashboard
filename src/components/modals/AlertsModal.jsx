import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const AlertsModal = ({ isOpen, onClose, alerts }) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Active');
  
  // Synchronize dismissed alert IDs with localStorage
  const [dismissedIds, setDismissedIds] = useLocalStorage('dismissed-alerts', []);

  const activeAlerts = useMemo(() => {
    return (alerts || []).filter(a => !dismissedIds.includes(a.id));
  }, [alerts, dismissedIds]);

  const dismissedAlerts = useMemo(() => {
    return (alerts || []).filter(a => dismissedIds.includes(a.id));
  }, [alerts, dismissedIds]);

  const visibleAlerts = useMemo(() => {
    if (activeTab === 'Active') return activeAlerts;
    if (activeTab === 'Dismissed') return dismissedAlerts;
    return alerts || [];
  }, [activeTab, activeAlerts, dismissedAlerts, alerts]);

  const handleDismiss = (id) => {
    setDismissedIds(prev => [...prev, id]);
    showToast('Alert dismissed.', 'info');
  };

  const handleRestore = (id) => {
    setDismissedIds(prev => prev.filter(x => x !== id));
    showToast('Alert restored to active alerts.', 'success');
  };

  const handleSnooze = (title) => {
    showToast(`Alert "${title}" snoozed for 1 day.`, 'info');
  };

  const handleReview = (title) => {
    showToast(`Auditing details for "${title}"...`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alert History" style={{ width: 600 }}>
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {['Active', 'Dismissed', 'All History'].map(tab => (
          <Pressable 
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && { borderBottomColor: tokens.colors.primary }]}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab ? tokens.colors.primary : colors.textSecondary }
            ]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.list}>
        {visibleAlerts.length === 0 ? (
          <View style={styles.empty}>
            <CheckCircle2 size={40} color={tokens.colors.green} style={{ marginBottom: 16 }} />
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '500' }}>
              {activeTab === 'Dismissed' ? 'No dismissed alerts' : 'No active alerts'}
            </Text>
            <Text style={{ color: colors.textMuted, marginTop: 8 }}>
              {activeTab === 'Dismissed' ? 'Your alerts history is clean.' : 'Your portfolio looks healthy.'}
            </Text>
          </View>
        ) : (
          visibleAlerts.map(alert => {
            const isDismissed = dismissedIds.includes(alert.id);
            return (
              <View key={alert.id} style={[styles.alertCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                <View style={styles.alertHeader}>
                  <AlertCircle size={16} color={alert.type === 'danger' ? tokens.colors.danger : tokens.colors.warning} />
                  <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>{alert.title}</Text>
                  {!isDismissed && (
                    <Pressable onPress={() => handleDismiss(alert.id)} style={styles.closeBtn} accessibilityLabel="Dismiss alert">
                      <X size={16} color={colors.textMuted} />
                    </Pressable>
                  )}
                </View>
                <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>{alert.body}</Text>
                
                <View style={styles.alertFooter}>
                  <View style={styles.timeBox}>
                    <Clock size={12} color={colors.textMuted} />
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>2 hours ago</Text>
                  </View>
                  <View style={styles.actions}>
                    {isDismissed ? (
                      <Pressable onPress={() => handleRestore(alert.id)}>
                        <Text style={[styles.actionLink, { color: tokens.colors.primary }]}>Restore</Text>
                      </Pressable>
                    ) : (
                      <>
                        <Pressable onPress={() => handleSnooze(alert.title)}>
                          <Text style={[styles.actionLink, { color: tokens.colors.primary }]}>Snooze 1d</Text>
                        </Pressable>
                        <Pressable onPress={() => handleReview(alert.title)}>
                          <Text style={[styles.actionLink, { color: tokens.colors.primary }]}>Review</Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: -10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    maxHeight: 450,
  },
  alertCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    paddingLeft: 24,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  }
});
