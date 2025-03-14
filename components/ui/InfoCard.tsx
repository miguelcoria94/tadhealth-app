import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  style?: object;
}

export function InfoCard({ title, children, style }: InfoCardProps) {
  return (
    <ThemedView variant="elevated" style={[styles.infoCard, style]}>
      <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
      {children}
    </ThemedView>
  );
}

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
}

export function InfoRow({ label, children }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    marginBottom: 12,
    color: Colors.light.textGray[100],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
}); 