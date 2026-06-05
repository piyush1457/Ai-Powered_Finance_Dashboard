import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Dropdown } from '../ui/Dropdown';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { Bell, TrendingUp, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { mockData } from '../../data/mockData';
import { useAnalytics } from '../../hooks/useAnalytics';

const ICONS = { TrendingUp, AlertCircle, CheckCircle, Calendar };

export const NotificationsPanel = () => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : mockData.notifications;
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const triggerRef = React.useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      trackEvent('Notifications', 'view');
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    trackEvent('Notifications', 'mark_all_read');
  };

  const handleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    trackEvent('Notifications', 'read_single', id.toString());
  };

  return (
    <View style={styles.container}>
      <Pressable 
        ref={triggerRef}
        style={({ pressed }) => [styles.bellBtn, pressed && { backgroundColor: colors.surfaceHighlight }]}
        onPress={handleToggle}
        aria-label="Notifications"
      >
        <Bell size={20} color={colors.textSecondary} />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: tokens.colors.danger }]}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </Pressable>

      <Dropdown 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        position="bottom-right"
        style={{ width: 340 }}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          {unreadCount > 0 && (
            <Pressable onPress={markAllRead}>
              <Text style={[styles.markRead, { color: tokens.colors.primary }]}>Mark all as read</Text>
            </Pressable>
          )}
        </View>

        <ScrollView style={styles.list} contentContainerStyle={{ padding: 8 }}>
          {notifications.length === 0 || unreadCount === 0 && notifications.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>You're all caught up! ✨</Text>
            </View>
          ) : (
            notifications.map((notif) => {
              const Icon = ICONS[notif.icon] || Bell;
              return (
                <Pressable 
                  key={notif.id}
                  style={({ pressed }) => [
                    styles.item,
                    !notif.read && { backgroundColor: `${tokens.colors.primary}10` },
                    pressed && { opacity: 0.8 }
                  ]}
                  onPress={() => handleRead(notif.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
                    <Icon size={16} color={colors.textPrimary} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
                    <Text style={[styles.itemBody, { color: colors.textSecondary }]} numberOfLines={2}>{notif.body}</Text>
                    <Text style={[styles.itemTime, { color: colors.textMuted }]}>{notif.time}</Text>
                  </View>
                  {!notif.read && <View style={[styles.unreadDot, { backgroundColor: tokens.colors.primary }]} />}
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </Dropdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#111318', // should ideally use surface
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  markRead: {
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    maxHeight: 320,
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginBottom: 4,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  itemBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'center',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  }
});
