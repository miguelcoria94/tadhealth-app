import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Text,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView as SafeAreaContext } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { appointments } from "@/assets/dummyData/appointments";
import { useRouter } from "expo-router";

// Define the Claim type
interface Claim {
  id: string;
  referenceNo: string;
  submissionDate: string;
  student: {
    id: number;
    name: string;
    age: number;
    grade: number;
    mentalState: string;
    consent: {
      studentConsent: boolean;
      parentConsent: boolean;
    };
  };
  appointment: {
    date: string;
    time: string;
  };
  status: string;
}

// Add Modality type and options
type Modality = 
  | 'non-therapeutic'
  | 'individual'
  | 'collateral'
  | 're-entry'
  | 'sarf'
  | 'check-in'
  | 'family-interview'
  | 'group'
  | 'observation'
  | 'threat-assessment'
  | 'rapid-referral'
  | 'family';

interface ModalityOption {
  id: Modality;
  label: string;
  code?: string;
}

const MODALITY_OPTIONS: ModalityOption[] = [
  { id: 'non-therapeutic', label: 'Non-therapeutic Session' },
  { id: 'individual', label: 'Individual', code: 'I' },
  { id: 'collateral', label: 'Collateral', code: 'C' },
  { id: 're-entry', label: 'Re-entry Meeting', code: 'RM' },
  { id: 'sarf', label: 'SARF' },
  { id: 'check-in', label: 'Check-in', code: 'CI' },
  { id: 'family-interview', label: 'Family Interview and Intake', code: 'FI' },
  { id: 'group', label: 'Group', code: 'G' },
  { id: 'observation', label: 'Observation', code: 'O' },
  { id: 'threat-assessment', label: 'Threat Assessment', code: 'TA' },
  { id: 'rapid-referral', label: 'Rapid Referral', code: 'RR' },
  { id: 'family', label: 'Family', code: 'F' },
];

export default function ClaimsScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState<'select-appointment' | 'modality' | 'claim-details' | 'eligibility' | 'details'>('select-appointment');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedModalities, setSelectedModalities] = useState<Set<Modality>>(new Set());
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  // Mock claims data (in reality, this would come from appointments)
  const claims = appointments.map((apt) => ({
    id: `CLAIM-${apt.id}`,
    referenceNo: `IS9JY${Math.floor(Math.random() * 90000) + 10000}`,
    submissionDate: new Date().toLocaleDateString(),
    student: apt.student,
    appointment: {
      date: apt.time.date,
      time: apt.time.time,
    },
    status: Math.random() > 0.5 ? "Submitted" : "In Progress",
  }));

  const analytics = {
    monthlyEarnings: 4850.0,
    pendingClaims: claims.filter((c) => c.status === "In Progress").length,
    submittedClaims: claims.filter((c) => c.status === "Submitted").length,
    averagePerSession: 125.0,
    unbilledSessions: 3,
    projectedEarnings: 5750.0,
  };

  // Get completed appointments that don't have claims
  const eligibleAppointments = appointments.filter(apt => 
    apt.status === 'Completed' || 
    new Date(apt.time.date) < new Date() // Include past appointments
  );

  const handleCreateClaim = () => {
    console.log("Create claim pressed - opening modal");
    setStep('select-appointment');
    setSelectedAppointmentId(null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAppointmentSelect = (id: number) => {
    setSelectedAppointmentId(id);
    setStep('modality');
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('eligibility');
    } else if (step === 'eligibility') {
      setStep('claim-details');
    } else if (step === 'claim-details') {
      setStep('modality');
    } else if (step === 'modality') {
      setStep('select-appointment');
    } else {
      handleCloseModal();
    }
  };

  const toggleModality = (modality: Modality) => {
    const newSelection = new Set(selectedModalities);
    if (newSelection.has(modality)) {
      newSelection.delete(modality);
    } else {
      newSelection.add(modality);
    }
    setSelectedModalities(newSelection);
  };

  const toggleTheme = (theme: string) => {
    const newSelection = new Set(selectedThemes);
    if (newSelection.has(theme)) {
      newSelection.delete(theme);
    } else {
      newSelection.add(theme);
    }
    setSelectedThemes(newSelection);
  };

  const toggleService = (service: string) => {
    const newSelection = new Set(selectedServices);
    if (newSelection.has(service)) {
      newSelection.delete(service);
    } else {
      newSelection.add(service);
    }
    setSelectedServices(newSelection);
  };

  const handleCheckEligibility = () => {
    // In a real app, this would actually check eligibility with an API
    // For demo purposes, we just move to the next step
    console.log('Moving to claim details screen with selected modalities:', Array.from(selectedModalities));
    setStep('claim-details');
  };

  const handleSubmitClaim = () => {
    // In a real app, this would submit the claim data to an API
    // For demo purposes, we just show a success message and close the modal
    alert('Claim submitted successfully!');
    handleCloseModal();
  };

  const renderAnalyticsCards = () => (
    <View style={styles.analyticsContainer}>
      {/* Main Earnings Card */}
      <View style={styles.mainAnalyticsCard}>
        <ThemedText type="label">Monthly Earnings</ThemedText>
        <Text style={styles.earningsText}>
          ${analytics.monthlyEarnings.toLocaleString()}
        </Text>
        <View style={styles.projectionRow}>
          <Feather name="trending-up" size={16} color={Colors.light.success} />
          <Text style={styles.projectionText}>
            Projected: ${analytics.projectedEarnings.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Claims Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>${analytics.averagePerSession}</Text>
          <ThemedText type="caption">Avg. per Session</ThemedText>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>{analytics.pendingClaims}</Text>
          <ThemedText type="caption">Pending Claims</ThemedText>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>{analytics.unbilledSessions}</Text>
          <ThemedText type="caption">Unbilled Sessions</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderClaimCard = (claim: Claim) => (
    <View key={claim.id} style={styles.claimCard}>
      <View style={styles.claimHeader}>
        <View>
          <Text style={styles.studentName}>{claim.student.name}</Text>
          <Text style={styles.studentId}>Student ID: {claim.student.id}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                claim.status === "Submitted"
                  ? Colors.light.success
                  : Colors.light.textGray[300],
            },
          ]}
        >
          <Text style={styles.statusText}>{claim.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.claimDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Reference No.</Text>
          <Text style={styles.value}>{claim.referenceNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Submission Date</Text>
          <Text style={styles.value}>{claim.submissionDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Appointment</Text>
          <Text style={styles.value}>
            {new Date(claim.appointment.date).toLocaleDateString()} at{" "}
            {claim.appointment.time}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderModalHeader = () => (
    <View style={styles.modalHeader}>
      <TouchableOpacity 
        style={styles.modalBackButton}
        onPress={handleBack}
      >
        <Feather name="arrow-left" size={24} color={Colors.light.textGray[300]} />
      </TouchableOpacity>
      <ThemedText style={styles.modalTitle}>
        {step === 'select-appointment' ? 'Create New Claim' : 
         step === 'modality' ? 'Modality' :
         step === 'claim-details' ? 'Prepare Reimbursement Claim' :
         step === 'eligibility' ? 'Check Eligibility' : 'Claim Details'}
      </ThemedText>
      <TouchableOpacity 
        style={styles.modalCloseButton}
        onPress={handleCloseModal}
      >
        <Feather name="x" size={24} color={Colors.light.textGray[300]} />
      </TouchableOpacity>
    </View>
  );

  const renderAppointmentSelection = () => (
    <View style={styles.modalContent}>
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
                <ThemedText style={styles.appointmentName}>
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

  const renderModalitySelection = () => {
    const appointment = appointments.find(apt => apt.id === selectedAppointmentId);
    if (!appointment) return null;

    return (
      <View style={styles.modalContent}>
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
        </View>

        <ThemedText style={styles.sectionTitle}>Modality</ThemedText>
        <View style={styles.optionsContainer}>
          {MODALITY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedModalities.has(option.id) && styles.selectedOption
              ]}
              onPress={() => toggleModality(option.id)}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedModalities.has(option.id) && styles.checkedBox
                ]}>
                  {selectedModalities.has(option.id) && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedModalities.has(option.id) && styles.selectedOptionText
                ]}>
                  {option.label}
                </ThemedText>
              </View>
              {option.code && (
                <ThemedText style={[
                  styles.codeText,
                  selectedModalities.has(option.id) && styles.selectedCodeText
                ]}>
                  ({option.code})
                </ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText style={styles.readyText}>
          Ready to submit a claim? Answer a few quick questions to find out and submit your information for reimbursement.
        </ThemedText>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCheckEligibility}
        >
          <Text style={styles.buttonText}>Save and Start a Claim</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEligibilityCheck = () => {
    const appointment = appointments.find(apt => apt.id === selectedAppointmentId);
    if (!appointment) return null;

    return (
      <View style={styles.modalContent}>
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

  const renderClaimDetailsForm = () => {
    const appointment = appointments.find(apt => apt.id === selectedAppointmentId);
    if (!appointment) return null;

    const sessionThemes = [
      'Stress, worry, or anxiety',
      'Adjusting to challenges or change',
      'General emotional or behavioral concerns',
      'Low mood or depression',
      'Behavioral challenges or support',
      'Crisis support or intervention'
    ];

    const services = [
      {
        name: 'Health behavior intervention',
        description: 'Helping students develop healthy habits to support their physical and mental well-being'
      },
      {
        name: 'Preventative medicine',
        description: 'Guidance and strategies to keep students healthy and prevent potential health issues'
      },
      {
        name: 'Training',
        description: 'Skills development and education for students, families, or caregivers to address health goals'
      },
      {
        name: 'Case management',
        description: 'Coordinating care and resources for students, ex. consultation and collaboration with administrators, teachers, mental health professionals, and outside agencies'
      }
    ];

    return (
      <View style={styles.modalContent}>
        <ThemedText style={styles.claimDetailsTitle}>
          Prepare your reimbursement claim
        </ThemedText>
        <ThemedText style={styles.claimDetailsSubtitle}>
          Complete the details below to ensure your session is eligible for reimbursement
        </ThemedText>

        <View style={styles.appointmentSummary}>
          <ThemedText style={styles.summaryTitle}>Associated Session</ThemedText>
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
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Session Themes & Topics</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Select the option(s) that best describe the focus of this session
          </ThemedText>
          
          {sessionThemes.map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.optionButton,
                selectedThemes.has(theme) && styles.selectedOption
              ]}
              onPress={() => toggleTheme(theme)}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedThemes.has(theme) && styles.checkedBox
                ]}>
                  {selectedThemes.has(theme) && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedThemes.has(theme) && styles.selectedOptionText
                ]}>
                  {theme}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Services you provided during the session</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Select the services you provided, and indicate how much time you spent on each
          </ThemedText>
          
          {services.map((service) => (
            <TouchableOpacity
              key={service.name}
              style={[
                styles.optionButton,
                selectedServices.has(service.name) && styles.selectedOption
              ]}
              onPress={() => toggleService(service.name)}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has(service.name) && styles.checkedBox
                ]}>
                  {selectedServices.has(service.name) && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <View style={styles.serviceTextContainer}>
                  <ThemedText style={[
                    styles.optionText,
                    selectedServices.has(service.name) && styles.selectedOptionText
                  ]}>
                    {service.name}
                  </ThemedText>
                  <ThemedText style={styles.serviceDescription}>
                    {service.description}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setStep('eligibility')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderModalContent = () => {
    switch (step) {
      case 'select-appointment':
        return renderAppointmentSelection();
      case 'modality':
        return renderModalitySelection();
      case 'claim-details':
        return renderClaimDetailsForm();
      case 'eligibility':
        return renderEligibilityCheck();
      case 'details':
        return renderClaimDetailsForm();
      default:
        return null;
    }
  };

  return (
    <SafeAreaContext style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Analytics Section */}
          {renderAnalyticsCards()}

          {/* Create Claim Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateClaim}
          >
            <Feather name="plus" size={20} color={Colors.light.background} />
            <Text style={styles.createButtonText}>Create Claim</Text>
          </TouchableOpacity>

          {/* Claims List */}
          <View style={styles.claimsList}>{claims.map(renderClaimCard)}</View>
        </View>
      </ScrollView>

      {/* Claim Creation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalWrapper}>
            {renderModalHeader()}
            <ScrollView style={styles.modalScrollView}>
              {renderModalContent()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaContext>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    backgroundColor: Colors.light.background,
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    alignItems: "flex-start",
  },
  headerTitle: {
    color: Colors.light.background,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 20,
    tintColor: Colors.light.background,
  },
  analyticsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  mainAnalyticsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
  },
  earningsText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.green[200],
    marginVertical: 8,
  },
  projectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  projectionText: {
    color: Colors.light.success,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statsCard: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  createButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  createButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  claimsList: {
    gap: 12,
  },
  claimCard: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.light.textGray[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  claimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  studentName: {
    color: Colors.light.textGray[100],
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  studentId: {
    color: Colors.light.textGray[300],
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.background,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500] + "10",
    marginVertical: 12,
  },
  claimDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  value: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    fontWeight: "500",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    width: '100%',
    height: '90%',
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500],
    paddingTop: Platform.OS === 'ios' ? 16 : 16,
  },
  modalBackButton: {
    padding: 12,
    marginLeft: 4,
  },
  modalCloseButton: {
    padding: 12,
    marginRight: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    flex: 1,
    textAlign: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
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
  appointmentName: {
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
  optionsContainer: {
    marginTop: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: Colors.light.textGray[500] + '10',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.textGray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.light.green[200],
    borderColor: Colors.light.green[200],
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  selectedOptionText: {
    color: Colors.light.green[200],
    fontWeight: '500',
  },
  codeText: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  selectedCodeText: {
    color: Colors.light.green[200],
  },
  readyText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 24,
    marginBottom: 16,
  },
  claimDetailsTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    marginBottom: 8,
  },
  claimDetailsSubtitle: {
    fontSize: 16,
    color: Colors.light.textGray[300],
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginBottom: 16,
    lineHeight: 20,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginTop: 4,
    lineHeight: 18,
  },
});
