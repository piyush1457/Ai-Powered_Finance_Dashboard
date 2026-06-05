import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../styles/tokens';
import { MessageCircle, Search, Mail } from 'lucide-react';
import { Button } from '../ui/Button';

export const HelpCenterModal = ({ isOpen, onClose }) => {
  const { colors } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help Center" style={{ width: 450 }}>
      <ScrollView>
        <Text style={[styles.header, { color: colors.textSecondary }]}>
          How our support channels work:
        </Text>

        <View style={styles.gridContainer}>
          <View style={[styles.infoBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <View style={styles.boxHeader}>
              <Search size={18} color={tokens.colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.boxTitle, { color: colors.textPrimary }]}>Knowledge Base</Text>
            </View>
            <Text style={[styles.boxDesc, { color: colors.textSecondary }]}>
              Browse user guides and troubleshooting documentation at support.protonfinance.com.
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <View style={styles.boxHeader}>
              <MessageCircle size={18} color={tokens.colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.boxTitle, { color: colors.textPrimary }]}>Live Chat Support</Text>
            </View>
            <Text style={[styles.boxDesc, { color: colors.textSecondary }]}>
              Talk with a support representative instantly. Available Monday to Friday, 9:00 AM – 6:00 PM IST.
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <View style={styles.boxHeader}>
              <Mail size={18} color={tokens.colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.boxTitle, { color: colors.textPrimary }]}>Email Support</Text>
            </View>
            <Text style={[styles.boxDesc, { color: colors.textSecondary }]}>
              Send a message to support@protonfinance.com. Our team typically replies within 24 hours.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button variant="ghost" onPress={onClose}>Close</Button>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    borderStyle: 'solid',
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  boxDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    alignItems: 'flex-end',
  }
});
