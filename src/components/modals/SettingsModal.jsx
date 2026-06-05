import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Switch } from 'react-native';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useToast } from '../../context/ToastContext';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('General');

  // Dummy state for settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.displayName === 'Alexander Vogt') {
        parsed.displayName = 'Piyush Sodhi';
        parsed.email = 'piyush@example.com';
      }
      return parsed;
    }
    return {
      language: 'English',
      currency: 'USD',
      emailNotif: true,
      pushNotif: true,
      smsNotif: false,
      twoFactor: true,
      displayName: 'Piyush Sodhi',
      email: 'piyush@example.com'
    };
  });

  useEffect(() => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('user_settings_changed'));
  }, [settings]);

  const handleSave = () => {
    trackEvent('Settings', 'save');
    showToast('Settings saved successfully', 'success');
    onClose();
  };

  const updateSetting = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" style={{ width: 600 }}>
      <View style={styles.content}>
        <View style={[styles.sidebar, { borderRightColor: colors.border }]}>
          {['General', 'Notifications', 'Privacy', 'Account'].map(tab => (
            <Pressable 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && { backgroundColor: colors.surfaceHighlight }]}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary, fontWeight: activeTab === tab ? '600' : '400' }]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.main}>
          {activeTab === 'General' && (
            <View style={styles.section}>
              <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>General Settings</Text>
              
              <View style={styles.row}>
                <Text style={{ color: colors.textPrimary }}>Dark Mode</Text>
                <Switch 
                  value={theme === 'dark'} 
                  onValueChange={toggleTheme} 
                  trackColor={{ true: tokens.colors.primary, false: colors.border }}
                />
              </View>
            </View>
          )}

          {activeTab === 'Notifications' && (
            <View style={styles.section}>
              <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>Notification Preferences</Text>
              
              <View style={styles.row}>
                <Text style={{ color: colors.textPrimary }}>Email Notifications</Text>
                <Switch 
                  value={settings.emailNotif} 
                  onValueChange={(val) => updateSetting('emailNotif', val)} 
                  trackColor={{ true: tokens.colors.primary, false: colors.border }}
                />
              </View>
              <View style={styles.row}>
                <Text style={{ color: colors.textPrimary }}>Push Notifications</Text>
                <Switch 
                  value={settings.pushNotif} 
                  onValueChange={(val) => updateSetting('pushNotif', val)} 
                  trackColor={{ true: tokens.colors.primary, false: colors.border }}
                />
              </View>
              <View style={styles.row}>
                <Text style={{ color: colors.textPrimary }}>SMS Alerts</Text>
                <Switch 
                  value={settings.smsNotif} 
                  onValueChange={(val) => updateSetting('smsNotif', val)} 
                  trackColor={{ true: tokens.colors.primary, false: colors.border }}
                />
              </View>
            </View>
          )}

          {activeTab === 'Privacy' && (
            <View style={styles.section}>
              <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>Privacy & Security</Text>
              
              <View style={styles.row}>
                <Text style={{ color: colors.textPrimary }}>Two-Factor Authentication</Text>
                <Switch 
                  value={settings.twoFactor} 
                  onValueChange={(val) => updateSetting('twoFactor', val)} 
                  trackColor={{ true: tokens.colors.primary, false: colors.border }}
                />
              </View>
              
              <View style={{ marginTop: 24 }}>
                <Button variant="ghost" onPress={() => { trackEvent('Settings', 'data_export'); showToast('Data export started', 'info'); }}>
                  Export Account Data
                </Button>
              </View>
            </View>
          )}

          {activeTab === 'Account' && (
            <View style={styles.section}>
              <Text style={[tokens.typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>Account Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Display Name</Text>
                <TextInput 
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]} 
                  value={settings.displayName}
                  onChangeText={(val) => updateSetting('displayName', val)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                <TextInput 
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]} 
                  value={settings.email}
                  onChangeText={(val) => updateSetting('email', val)}
                  keyboardType="email-address"
                />
              </View>
            </View>
          )}
        </View>
      </View>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button variant="ghost" onPress={onClose}>Cancel</Button>
        <Button variant="primary" onPress={handleSave}>Save Changes</Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    height: 400,
    marginHorizontal: -20, // offset modal padding
    marginTop: -20,
  },
  sidebar: {
    width: 160,
    borderRightWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 14,
  },
  main: {
    flex: 1,
    padding: 24,
  },
  section: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    marginHorizontal: -20,
    marginBottom: -20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  }
});
