import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export type TabId = 'details' | 'activity' | 'forms' | 'referrals' | 'review' | 'billing';

interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

interface AppointmentTabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

// Tab configuration
const TABS: TabConfig[] = [
  { id: 'details', label: 'Details', icon: 'info' },
  { id: 'activity', label: 'Activity', icon: 'message-square' },
  { id: 'forms', label: 'Forms', icon: 'file-text' },
  { id: 'referrals', label: 'Referrals', icon: 'git-pull-request' },
  { id: 'review', label: 'Review', icon: 'check-square' },
  { id: 'billing', label: 'Billing', icon: 'dollar-sign' },
];

export function AppointmentTabs({ activeTab, onTabChange }: AppointmentTabsProps) {
  return (
    <View style={styles.tabsContainer}>
      {TABS.map((tab) => (
        <Pressable
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Feather 
            name={tab.icon as any} // Type assertion needed for Feather icons
            size={18} 
            color={activeTab === tab.id ? 
              Colors.light.green[200] : 
              Colors.light.textGray[300]
            } 
          />
          <ThemedText
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}
            numberOfLines={1}
          >
            {tab.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.green[200],
  },
  tabText: {
    fontSize: 12,
    color: Colors.light.textGray[300],
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.light.green[200],
    fontWeight: '600',
  },
}); 