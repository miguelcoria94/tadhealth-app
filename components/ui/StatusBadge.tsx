import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

interface StatusBadgeProps {
  status: string;
  type: 'status' | 'priority';
  color?: string;
}

export function StatusBadge({ status, type, color }: StatusBadgeProps) {
  // Determine color based on status and type if not provided
  const badgeColor = color || getColorForBadge(status, type);
  
  return (
    <ThemedView 
      style={[
        styles.statusBadge, 
        { backgroundColor: badgeColor }
      ]}
    >
      <ThemedText style={styles.statusBadgeText}>{status.toUpperCase()}</ThemedText>
    </ThemedView>
  );
}

function getColorForBadge(status: string, type: 'status' | 'priority'): string {
  if (type === 'status') {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.light.success;
      case 'pending':
        return Colors.light.warning;
      case 'missed':
        return Colors.light.pink[100];
      default:
        return Colors.light.textGray[300];
    }
  } else {
    switch (status.toLowerCase()) {
      case 'high':
        return Colors.light.pink[100];
      case 'medium':
        return Colors.light.orange[100];
      case 'low':
        return Colors.light.mint[100];
      default:
        return Colors.light.textGray[300];
    }
  }
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    maxWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 