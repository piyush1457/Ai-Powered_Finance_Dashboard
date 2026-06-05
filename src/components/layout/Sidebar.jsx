import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { tokens } from '../../styles/tokens';
import { 
  Building2, LayoutDashboard, Wallet, ArrowRightLeft, 
  PieChart, TrendingUp, HelpCircle, LogOut 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { HelpCenterModal } from '../modals/HelpCenterModal';
import { UpgradeModal } from '../modals/UpgradeModal';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accounts', label: 'Accounts', icon: Wallet },
  { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
  { path: '/insights', label: 'Insights', icon: TrendingUp },
];

export const Sidebar = () => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const location = useLocation();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const isMobile = width < 768;

  const [isPremium] = useState(() => {
    try {
      const saved = localStorage.getItem('app-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.user?.tier === 'Premium';
      }
    } catch (e) {
      // Fallback
    }
    return true; // Default to true since mockData defaults to Premium
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  if (isMobile) {
    return (
      <View 
        accessibilityRole="navigation" 
        accessibilityLabel="Main navigation"
        style={[styles.mobileTabBar, { backgroundColor: colors.surfaceElevated, borderTopColor: colors.border }]}
      >
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Pressable 
              key={item.path} 
              onPress={() => navigate(item.path)}
              style={styles.mobileTabItem}
            >
              <Icon size={24} color={isActive ? colors.primary : colors.textSecondary} />
              <Text style={{ fontSize: 10, color: isActive ? colors.primary : colors.textSecondary, marginTop: 4 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <>
      <View 
        accessibilityRole="navigation" 
        accessibilityLabel="Main navigation"
        style={[styles.sidebar, { backgroundColor: colors.surface, borderRightColor: colors.border }]}
      >
        <View style={[styles.sidebarLogo, { borderBottomColor: colors.border }]}>
          <View style={styles.logoIcon}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>P</Text>
          </View>
          <View style={styles.logoText}>
            <Text style={[styles.logoName, { color: colors.textPrimary }]}>Proton Finance</Text>
            <Text style={[styles.logoSub, { color: colors.textMuted }]}>WEALTH CURATOR</Text>
          </View>
        </View>

        <View style={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Pressable 
                key={item.path} 
                onPress={() => navigate(item.path)}
                style={({ pressed }) => [
                  styles.navItem, 
                  isActive && styles.navItemActive,
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Icon size={18} color={isActive ? colors.primary : colors.textSecondary} />
                <Text style={[
                  styles.navLabel, 
                  { color: isActive ? colors.primary : colors.textSecondary, fontWeight: isActive ? '500' : '400' }
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.sidebarBottom, { borderTopColor: colors.border }]}>
          {!isPremium && (
            <View style={[styles.upgradeCard, { borderColor: `${colors.purple}30` }]}>
              <Text style={styles.upgradeLabel}>PRO ACCESS</Text>
              <Text style={[styles.upgradeTitle, { color: colors.textPrimary }]}>Unlock AI Strategy Insights</Text>
              <Pressable 
                style={({ pressed }) => [styles.upgradeBtn, pressed && { opacity: 0.85 }]}
                onPress={() => {
                  trackEvent('Sidebar', 'cta_click', 'Upgrade Now');
                  setIsUpgradeOpen(true);
                }}
              >
                <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.sidebarUtils}>
            <Pressable 
              style={({ pressed }) => [styles.utilItem, pressed && { backgroundColor: colors.surfaceElevated }]}
              onPress={() => setIsHelpOpen(true)}
            >
              <HelpCircle size={15} color={colors.textMuted} />
              <Text style={[styles.utilText, { color: colors.textMuted }]}>Help Center</Text>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [styles.utilItem, pressed && { backgroundColor: colors.surfaceElevated }]}
              onPress={() => setIsLogoutOpen(true)}
            >
              <LogOut size={15} color={colors.textMuted} />
              <Text style={[styles.utilText, { color: colors.textMuted }]}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <HelpCenterModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <LogoutConfirmModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    borderRightWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 50,
  },
  mobileTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: tokens.spacing.sm,
    paddingBottom: 24, // Safe area
    borderTopWidth: 1,
  },
  mobileTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sidebarLogo: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#4f9cf9',
    backgroundImage: 'linear-gradient(135deg, #4f9cf9, #a78bfa)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    flexDirection: 'column',
  },
  logoName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  logoSub: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  navLinks: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
    gap: 10,
  },
  navItemActive: {
    backgroundColor: '#4f9cf920',
    backgroundImage: 'linear-gradient(135deg, rgba(79, 156, 249, 0.2), rgba(167, 139, 250, 0.15))',
  },
  navLabel: {
    fontSize: 13.5,
  },
  navBadge: {
    marginLeft: 'auto',
    backgroundColor: '#ff525230',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 20,
  },
  navBadgeText: {
    color: '#ff7878',
    fontSize: 10,
    fontFamily: tokens.typography.mono.fontFamily,
  },
  sidebarBottom: {
    padding: 12,
    borderTopWidth: 1,
  },
  upgradeCard: {
    backgroundColor: '#4f9cf915',
    backgroundImage: 'linear-gradient(135deg, rgba(79, 156, 249, 0.15), rgba(167, 139, 250, 0.15))',
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  upgradeLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: tokens.colors.purple,
    fontWeight: '600',
    marginBottom: 6,
  },
  upgradeTitle: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 10,
  },
  upgradeBtn: {
    width: '100%',
    backgroundColor: '#4f9cf9',
    backgroundImage: 'linear-gradient(135deg, #4f9cf9, #a78bfa)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sidebarUtils: {
    flexDirection: 'column',
    gap: 2,
  },
  utilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  utilText: {
    fontSize: 12.5,
  }
});
