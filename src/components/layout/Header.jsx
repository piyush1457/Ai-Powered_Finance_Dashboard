import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { View, Text, StyleSheet, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { Search, Sun, Moon, Settings, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ProfileDropdown } from '../header/ProfileDropdown';
import { NotificationsPanel } from '../header/NotificationsPanel';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import { SettingsModal } from '../modals/SettingsModal';
import { SearchResults } from '../header/SearchResults';

export const Header = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { trackEvent } = useAnalytics();
  
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 400);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/insights')) return 'Analysis';
    return 'Portfolio'; // default for dashboard and others
  };

  const activeTab = getActiveTab();
  const searchRef = React.useRef(null);

  useEffect(() => {
    if (debouncedSearch) {
      trackEvent('Search', 'Input', debouncedSearch);
    }
  }, [debouncedSearch, trackEvent]);

  const handleThemeToggle = () => {
    toggleTheme();
    trackEvent('Header', 'theme_toggle', theme === 'dark' ? 'light' : 'dark');
  };

  const handleTabChange = (tab) => {
    trackEvent('Header', 'tab_change', tab.toLowerCase());
    if (tab === 'Portfolio') navigate('/dashboard');
    else if (tab === 'Analysis') navigate('/insights');
  };

  return (
    <>
      <View 
        accessibilityRole="banner"
        style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        <View style={styles.searchContainer} ref={searchRef}>
          <Search size={14} color={colors.textMuted} style={styles.searchIcon} aria-hidden="true" />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, backgroundColor: colors.surfaceElevated, borderColor: colors.border2, paddingRight: searchValue ? 32 : 12 }]}
            placeholder="Search portfolio or markets..."
            placeholderTextColor={colors.textMuted}
            value={searchValue}
            onChangeText={setSearchValue}
            onFocus={() => setIsSearchFocused(true)}
            accessibilityLabel="Search portfolio or markets"
          />
          {!!searchValue && (
            <Pressable 
              onPress={() => setSearchValue('')} 
              style={styles.clearIcon}
              accessibilityLabel="Clear search"
            >
              <X size={14} color={colors.textMuted} />
            </Pressable>
          )}
          <SearchResults 
            isOpen={isSearchFocused && !!searchValue} 
            onClose={() => setIsSearchFocused(false)} 
            query={debouncedSearch} 
            triggerRef={searchRef}
          />
        </View>

        {!isMobile && (
          <View style={styles.tabs} accessibilityRole="navigation" aria-label="Header tabs">
            {['Portfolio', 'Analysis'].map(tab => (
              <Pressable key={tab} onPress={() => handleTabChange(tab)}>
                <Text style={[
                  styles.tab, 
                  activeTab === tab && styles.activeTab, 
                  activeTab === tab ? { backgroundColor: colors.surfaceElevated, color: colors.textPrimary } : { color: colors.textSecondary }
                ]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable 
            onPress={handleThemeToggle} 
            style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }, pressed && { backgroundColor: colors.surfaceHighlight }]} 
            accessibilityLabel="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} color={colors.textSecondary} /> : <Moon size={16} color={colors.textSecondary} />}
          </Pressable>

          <NotificationsPanel />

          {!isMobile && (
            <Pressable 
              onPress={() => setIsSettingsModalOpen(true)}
              style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }, pressed && { backgroundColor: colors.surfaceHighlight }]} 
              accessibilityLabel="Settings"
            >
              <Settings size={16} color={colors.textSecondary} />
            </Pressable>
          )}

          <ProfileDropdown onLogout={() => setIsLogoutModalOpen(true)} />
        </View>
      </View>

      <LogoutConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  searchContainer: {
    flex: 1,
    maxWidth: 340,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    paddingLeft: 34,
    paddingRight: 12,
    paddingVertical: 8,
    borderWidth: 1,
    fontSize: 13,
    outlineStyle: 'none',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  tab: {
    fontSize: 13,
    fontWeight: '400',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeTab: {
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f9cf9',
    backgroundImage: 'linear-gradient(135deg, #4f9cf9, #a78bfa)',
    flexShrink: 0,
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 2,
    padding: 4,
  }
});
