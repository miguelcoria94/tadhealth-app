import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator,
  View,
  Pressable,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { AppointmentHeader } from '@/components/appointment/AppointmentHeader';
import { AppointmentTabs, TabId } from '@/components/appointment/AppointmentTabs';
import { DetailsTab } from '@/components/appointment/tabs/DetailsTab';
import { ActivityTab } from '@/components/appointment/tabs/ActivityTab';
import { ReviewTab } from '@/components/appointment/tabs/ReviewTab';
import { BillingTab } from '@/components/appointment/tabs/BillingTab';
import { useAppointment } from '@/hooks/useAppointment';

// Import other components as needed

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>('details');
  
  // Get appointment data with our custom hook
  const { 
    appointment, 
    isLoading, 
    saveAppointmentReview 
  } = useAppointment(appointmentId as string);

  if (!appointment) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <ThemedText>No appointment found.</ThemedText>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Render the active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab appointment={appointment} />;
      case 'activity':
        return <ActivityTab initialActivities={appointment.activity || []} />;
      case 'review':
        return <ReviewTab appointment={appointment} onSaveReview={saveAppointmentReview} />;
      case 'billing':
        return <BillingTab appointment={appointment} />;
      // Add other tabs as they are implemented
      default:
        return <DetailsTab appointment={appointment} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <AppointmentHeader appointment={appointment} onBackPress={() => router.back()} />

      {/* Tabs */}
      <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.green[200]} />
          </View>
        ) : (
          renderActiveTabContent()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: Colors.light.green[200],
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
});