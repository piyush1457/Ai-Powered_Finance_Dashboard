import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { useNavigate } from 'react-router-dom';

export const LogoutConfirmModal = ({ isOpen, onClose }) => {
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage (except theme preference)
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme) localStorage.setItem('theme', theme);
    
    trackEvent('Auth', 'logout');
    showToast('Signed out successfully', 'success');
    onClose();
    // In a real app this would clear auth state, but for this demo we'll navigate
    navigate('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign out of Wealth Curator?">
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        You'll need to sign in again to access your portfolio.
      </Text>
      
      <View style={styles.actions}>
        <Button variant="ghost" onPress={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onPress={handleLogout}>
          Sign Out
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  }
});
