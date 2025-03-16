import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Text,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { appointments } from '@/assets/dummyData/appointments';

export default function ClaimCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const appointmentIdParam = params.appointmentId as string;
  const statusParam = params.status as string;
  
  // If status is "In Progress", skip to details
  const initialStep = 
    statusParam === "In Progress" ? 'details' :
    appointmentIdParam ? 'eligibility' : 'select-appointment';
  
  const [step, setStep] = useState<'select-appointment' | 'eligibility' | 'details'>(initialStep);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(
    appointmentIdParam ? Number(appointmentIdParam) : null
  );
  
  // Get completed appointments that don't have claims
  const eligibleAppointments = appointments.filter(apt => apt.status === 'Completed');

  // If we have an appointmentId from params, use it
  useEffect(() => {
    if (appointmentIdParam && step === 'select-appointment') {
      setSelectedAppointmentId(Number(appointmentIdParam));
      if (statusParam === "In Progress") {
        setStep('details');
      } else {
        setStep('eligibility');
      }
    }
  }, [appointmentIdParam, statusParam]);

  const handleAppointmentSelect = (id: number) => {
    setSelectedAppointmentId(id);
    setStep('eligibility');
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('eligibility');
    } else if (step === 'eligibility') {
      setStep('select-appointment');
    } else {
      router.back();
    }
  };

  const handleCheckEligibility = () => {
    // In a real app, this would actually check eligibility with an API
    // For demo purposes, we just move to the next step
    setStep('details');
  };

  const handleSubmitClaim = () => {
    // In a real app, this would submit the claim data to an API
    // For demo purposes, we just show a success message and go back
    alert('Claim submitted successfully!');
    router.back();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
      >
        <Feather name="arrow-left" size={24} color={Colors.light.textGray[300]} />
      </TouchableOpacity>
      <ThemedText style={styles.headerTitle}>
        {step === 'select-appointment' ? 'Create New Claim' : 
         step === 'eligibility' ? 'Check Eligibility' : 'Claim Details'}
      </ThemedText>
    </View>
  );

  const renderAppointmentSelection = () => (
    <View style={styles.content}>
      <ThemedText style={styles.sectionTitle}>Select an Appointment</ThemedText>
      <ThemedText style={styles.instructions}>
        Choose a completed appointment to create a claim for:
      </ThemedText>
      
      {eligibleAppointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="calendar" size={48} color={Colors.light.textGray[300]} />
          <ThemedText style={styles.emptyStateText}>
            No eligible appointments found. Complete an appointment first.
          </ThemedText>
        </View>
      ) : (
        <View style={styles.appointmentList}>
          {eligibleAppointments.map(appointment => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.appointmentCard}
              onPress={() => handleAppointmentSelect(appointment.id)}
            >
              <View style={styles.appointmentHeader}>
                <ThemedText style={styles.studentName}>
                  {appointment.student.name}
                </ThemedText>
                <ThemedText style={styles.appointmentDate}>
                  {new Date(appointment.time.date).toLocaleDateString()} at {appointment.time.time}
                </ThemedText>
              </View>
              <View style={styles.appointmentDetails}>
                <ThemedText style={styles.detailLabel}>Session Type:</ThemedText>
                <ThemedText style={styles.detailValue}>{appointment.type}</ThemedText>
              </View>
              <View style={styles.cardAction}>
                <ThemedText style={styles.selectText}>Select</ThemedText>
                <Feather name="chevron-right" size={20} color={Colors.light.green[200]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderEligibilityCheck = () => {
    const appointment = appointments.find(apt => apt.id === selectedAppointmentId);
    if (!appointment) return null;

    return (
      <View style={styles.content}>
        <ThemedText style={styles.sectionTitle}>Insurance Eligibility</ThemedText>
        <ThemedText style={styles.instructions}>
          Verify insurance eligibility before creating a claim.
        </ThemedText>
        
        <View style={styles.appointmentSummary}>
          <ThemedText style={styles.summaryTitle}>Appointment Summary</ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Student:</ThemedText>
            <ThemedText style={styles.summaryValue}>{appointment.student.name}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Date:</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {new Date(appointment.time.date).toLocaleDateString()}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Time:</ThemedText>
            <ThemedText style={styles.summaryValue}>{appointment.time.time}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Type:</ThemedText>
            <ThemedText style={styles.summaryValue}>{appointment.type}</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCheckEligibility}
        >
          <Feather name="check-circle" size={20} color={Colors.light.background} />
          <Text style={styles.buttonText}>Check Eligibility</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderClaimDetails = () => {
    const appointment = appointments.find(apt => apt.id === selectedAppointmentId);
    if (!appointment) return null;

    return (
      <View style={styles.content}>
        <View style={styles.eligibilityResult}>
          <View style={styles.eligibilityBadge}>
            <Feather name="check-circle" size={20} color="#fff" />
            <ThemedText style={styles.eligibilityText}>Eligible</ThemedText>
          </View>
          <ThemedText style={styles.eligibilityMessage}>
            This appointment is eligible for insurance claims.
          </ThemedText>
        </View>

        <ThemedText style={styles.sectionTitle}>Claim Information</ThemedText>
        <ThemedText style={styles.instructions}>
          Review and submit your claim.
        </ThemedText>
        
        <View style={styles.formSection}>
          <ThemedText style={styles.formSectionTitle}>Service Details</ThemedText>
          {/* This would be replaced with actual form inputs in a real app */}
          <View style={styles.formPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              Service details form would go here
            </ThemedText>
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.formSectionTitle}>Billing Codes</ThemedText>
          {/* This would be replaced with actual form inputs in a real app */}
          <View style={styles.formPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              Billing codes form would go here
            </ThemedText>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmitClaim}
        >
          <Feather name="check" size={20} color={Colors.light.background} />
          <Text style={styles.buttonText}>Submit Claim</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    switch (step) {
      case 'select-appointment':
        return renderAppointmentSelection();
      case 'eligibility':
        return renderEligibilityCheck();
      case 'details':
        return renderClaimDetails();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.scrollView}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    color: Colors.light.textGray[300],
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.light.textGray[500] + '20',
    borderRadius: 12,
    marginVertical: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textGray[300],
    textAlign: 'center',
    marginTop: 16,
  },
  appointmentList: {
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500],
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textGray[100],
  },
  appointmentDate: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  appointmentDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.textGray[200],
  },
  cardAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: Colors.light.green[200],
    marginRight: 8,
  },
  appointmentSummary: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500],
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    flex: 1,
  },
  primaryButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  eligibilityResult: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.green[200],
    marginBottom: 24,
    alignItems: 'center',
  },
  eligibilityBadge: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  eligibilityText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  eligibilityMessage: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    marginBottom: 12,
  },
  formPlaceholder: {
    backgroundColor: Colors.light.textGray[500] + '20',
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.light.textGray[300],
  },
}); 