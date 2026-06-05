import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton } from '../components/ui/Skeleton';
import { tokens } from '../styles/tokens';
import { Settings } from 'lucide-react';

export const TestPrimitives = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[tokens.typography.h1, { color: colors.textPrimary }]}>
          Design Primitives
        </Text>
        <Button onPress={toggleTheme} variant="secondary">
          Toggle Theme ({theme})
        </Button>
      </View>

      <Card style={styles.section}>
        <Text style={[tokens.typography.h2, { color: colors.textPrimary, marginBottom: 16 }]}>Buttons</Text>
        <View style={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </View>
        <View style={[styles.row, { marginTop: 16 }]}>
          <Button variant="primary" icon={Settings}>With Icon</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
        </View>
      </Card>

      <Card elevated style={styles.section}>
        <Text style={[tokens.typography.h2, { color: colors.textPrimary, marginBottom: 16 }]}>Badges</Text>
        <View style={styles.row}>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={[tokens.typography.h2, { color: colors.textPrimary, marginBottom: 16 }]}>ProgressBar</Text>
        <ProgressBar value={75} color={colors.primary} style={{ marginBottom: 16 }} />
        <ProgressBar value={40} color={colors.warning} />
      </Card>

      <Card style={styles.section}>
        <Text style={[tokens.typography.h2, { color: colors.textPrimary, marginBottom: 16 }]}>Skeleton</Text>
        <Skeleton height={32} width="50%" style={{ marginBottom: 16 }} />
        <Skeleton height={20} style={{ marginBottom: 8 }} />
        <Skeleton height={20} style={{ marginBottom: 8 }} />
        <Skeleton height={20} width="80%" />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  section: {
    marginBottom: tokens.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  }
});
