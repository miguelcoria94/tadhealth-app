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
  TextInput,
  FlatList,
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
  const [step, setStep] = useState<'select-appointment' | 'themes-input' | 'modality' | 'claim-details' | 'eligibility' | 'details'>('select-appointment');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedModalities, setSelectedModalities] = useState<Set<Modality>>(new Set());
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [themesText, setThemesText] = useState('');
  const [selectedHBIFocus, setSelectedHBIFocus] = useState<Set<string>>(new Set());
  const [selectedTimeSpent, setSelectedTimeSpent] = useState<string>('15 minutes');
  const [selectedAdditionalDetails, setSelectedAdditionalDetails] = useState<Set<string>>(new Set());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isCommunityHealthWorker, setIsCommunityHealthWorker] = useState<boolean | null>(null);
  const [selectedTrainingFocus, setSelectedTrainingFocus] = useState<Set<string>>(new Set());
  const [selectedCaseManagementType, setSelectedCaseManagementType] = useState<string>('');

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
    setStep('themes-input');
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('eligibility');
    } else if (step === 'eligibility') {
      setStep('claim-details');
    } else if (step === 'claim-details') {
      setStep('modality');
    } else if (step === 'modality') {
      setStep('themes-input');
    } else if (step === 'themes-input') {
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

  const toggleHBIFocus = (focus: string) => {
    const newSelection = new Set(selectedHBIFocus);
    if (newSelection.has(focus)) {
      newSelection.delete(focus);
    } else {
      newSelection.add(focus);
    }
    setSelectedHBIFocus(newSelection);
  };

  const toggleAdditionalDetail = (detail: string) => {
    const newSelection = new Set(selectedAdditionalDetails);
    if (newSelection.has(detail)) {
      newSelection.delete(detail);
    } else {
      newSelection.add(detail);
    }
    setSelectedAdditionalDetails(newSelection);
  };

  const toggleTrainingFocus = (focus: string) => {
    const newSelection = new Set(selectedTrainingFocus);
    if (newSelection.has(focus)) {
      newSelection.delete(focus);
    } else {
      newSelection.add(focus);
    }
    setSelectedTrainingFocus(newSelection);
  };

  const toggleCaseManagementType = (type: string) => {
    setSelectedCaseManagementType(type);
  };

  const handleCheckEligibility = () => {
    // In a real app, this would actually check eligibility with an API
    // For demo purposes, we just move to the next step
    console.log('Moving to claim details screen with selected modalities:', Array.from(selectedModalities));
    setStep('claim-details');
  };

  const handleContinueFromThemes = () => {
    if (themesText.trim().length > 0) {
      setStep('modality');
    }
  };

  const handleSubmitClaim = () => {
    // In a real app, this would submit the claim data to an API
    // For demo purposes, we just show a success message and close the modal
    alert('Claim submitted successfully!');
    handleCloseModal();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSpent(time);
    setShowTimeDropdown(false);
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
         step === 'themes-input' ? 'Prepare Reimbursement Claim' :
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
              style={[
                styles.appointmentCard,
                selectedAppointmentId === appointment.id && styles.selectedAppointmentCard
              ]}
              onPress={() => handleAppointmentSelect(appointment.id)}
            >
              <View style={styles.appointmentCardContent}>
                <View style={styles.appointmentInfo}>
                  <ThemedText style={styles.appointmentStudent}>
                    {appointment.student.name}
                  </ThemedText>
                  <ThemedText style={styles.appointmentDate}>
                    {new Date(appointment.time.date).toLocaleDateString()} at {appointment.time.time}
                  </ThemedText>
                  <ThemedText style={styles.appointmentType}>
                    {appointment.type}
                  </ThemedText>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedAppointmentId === appointment.id && styles.checkedBox
                ]}>
                  {selectedAppointmentId === appointment.id && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButtonBottom}
          onPress={handleCloseModal}
        >
          <ThemedText style={styles.backButtonText}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedAppointmentId ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={() => selectedAppointmentId && handleAppointmentSelect(selectedAppointmentId)}
          disabled={!selectedAppointmentId}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleCheckEligibility}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
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
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleCheckEligibility}
          >
            <Feather name="check-circle" size={20} color={Colors.light.background} />
            <Text style={styles.buttonText}>Check Eligibility</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderThemesInput = () => {
    const appointment = appointments.find(apt => apt.id === selectedAppointmentId);
    if (!appointment) return null;

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
          <TextInput
            style={styles.themesInput}
            multiline
            placeholder="Describe the themes and topics covered in this session..."
            value={themesText}
            onChangeText={setThemesText}
            maxLength={800}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {themesText.length}/800 characters
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.continueButton,
              themesText.trim().length > 0 ? styles.activeButton : styles.inactiveButton
            ]}
            onPress={handleContinueFromThemes}
            disabled={themesText.trim().length === 0}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
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

    const hbiFocusOptions = [
      {
        name: 'Counseling',
        description: 'Provides personalized guidance to help students address specific challenges or barriers to healthy behaviors'
      },
      {
        name: 'Psychoeducation',
        description: 'Teaching about health topics like stress, habits to build awareness and make informed choices'
      }
    ];

    const timeOptions = [
      '15 minutes',
      '30 minutes',
      '45 minutes',
      '60 minutes',
      '75 minutes',
      '90 minutes'
    ];

    const additionalDetailOptions = [
      'Audio telehealth',
      'Video telehealth',
      'Part of dyadic care'
    ];

    const screenings = [
      'Annual alcohol misuse',
      'Adverse childhood experiences (ACES) / trauma',
      'Depression',
      'Alcohol and/or substance abuse structured screening'
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
            <View key={service.name}>
              <TouchableOpacity
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

              {/* Conditional section for Health behavior intervention */}
              {selectedServices.has(service.name) && service.name === 'Health behavior intervention' && (
                <View style={styles.conditionalSection}>
                  <ThemedText style={styles.conditionalTitle}>
                    What was the focus of this service? (select all that apply)
                  </ThemedText>
                  
                  {hbiFocusOptions.map((focus) => (
                    <TouchableOpacity
                      key={focus.name}
                      style={[
                        styles.optionButton,
                        selectedHBIFocus.has(focus.name) && styles.selectedOption
                      ]}
                      onPress={() => toggleHBIFocus(focus.name)}
                    >
                      <View style={styles.optionLeft}>
                        <View style={[
                          styles.checkbox,
                          selectedHBIFocus.has(focus.name) && styles.checkedBox
                        ]}>
                          {selectedHBIFocus.has(focus.name) && (
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
                            selectedHBIFocus.has(focus.name) && styles.selectedOptionText
                          ]}>
                            {focus.name}
                          </ThemedText>
                          <ThemedText style={styles.serviceDescription}>
                            {focus.description}
                          </ThemedText>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Conditional section for Preventative medicine */}
              {selectedServices.has(service.name) && service.name === 'Preventative medicine' && (
                <View style={styles.conditionalSection}>
                  <ThemedText style={styles.conditionalTitle}>
                    Time spent on this service
                  </ThemedText>
                  
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                    >
                      <ThemedText style={styles.dropdownText}>
                        {selectedTimeSpent}
                      </ThemedText>
                      <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                    </TouchableOpacity>
                    
                    {showTimeDropdown && (
                      <View style={styles.dropdownList}>
                        {timeOptions.map((time) => (
                          <TouchableOpacity
                            key={time}
                            style={[
                              styles.dropdownItem,
                              selectedTimeSpent === time && styles.selectedDropdownItem
                            ]}
                            onPress={() => handleTimeSelect(time)}
                          >
                            <ThemedText style={[
                              styles.dropdownItemText,
                              selectedTimeSpent === time && styles.selectedDropdownItemText
                            ]}>
                              {time}
                            </ThemedText>
                            {selectedTimeSpent === time && (
                              <Feather name="check" size={16} color={Colors.light.green[200]} />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                    Additional details (select if applicable)
                  </ThemedText>
                  
                  <View>
                    {additionalDetailOptions.map((detail) => (
                      <TouchableOpacity
                        key={detail}
                        style={[
                          styles.optionButton,
                          selectedAdditionalDetails.has(detail) && styles.selectedOption
                        ]}
                        onPress={() => toggleAdditionalDetail(detail)}
                      >
                        <View style={styles.optionLeft}>
                          <View style={[
                            styles.checkbox,
                            selectedAdditionalDetails.has(detail) && styles.checkedBox
                          ]}>
                            {selectedAdditionalDetails.has(detail) && (
                              <Feather 
                                name="check" 
                                size={14} 
                                color={Colors.light.background} 
                              />
                            )}
                          </View>
                          <ThemedText style={[
                            styles.optionText,
                            selectedAdditionalDetails.has(detail) && styles.selectedOptionText
                          ]}>
                            {detail}
                          </ThemedText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Conditional section for Training */}
              {selectedServices.has(service.name) && service.name === 'Training' && (
                <View style={styles.conditionalSection}>
                  <ThemedText style={styles.conditionalTitle}>
                    Are you a community health worker?
                  </ThemedText>
                  
                  <View style={styles.radioContainer}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setIsCommunityHealthWorker(true)}
                    >
                      <View style={[
                        styles.radioButton,
                        isCommunityHealthWorker === true && styles.radioButtonSelected
                      ]}>
                        {isCommunityHealthWorker === true && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>Yes</ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setIsCommunityHealthWorker(false)}
                    >
                      <View style={[
                        styles.radioButton,
                        isCommunityHealthWorker === false && styles.radioButtonSelected
                      ]}>
                        {isCommunityHealthWorker === false && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>No</ThemedText>
                    </TouchableOpacity>
                  </View>

                  {/* If they select Yes for community health worker */}
                  {isCommunityHealthWorker === true && (
                    <View style={styles.nestedSection}>
                      <ThemedText style={styles.conditionalTitle}>
                        Time spent on this service
                      </ThemedText>
                      
                      <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                          style={styles.dropdown}
                          onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                        >
                          <ThemedText style={styles.dropdownText}>
                            {selectedTimeSpent}
                          </ThemedText>
                          <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                        </TouchableOpacity>
                        
                        {showTimeDropdown && (
                          <View style={styles.dropdownList}>
                            {timeOptions.map((time) => (
                              <TouchableOpacity
                                key={time}
                                style={[
                                  styles.dropdownItem,
                                  selectedTimeSpent === time && styles.selectedDropdownItem
                                ]}
                                onPress={() => handleTimeSelect(time)}
                              >
                                <ThemedText style={[
                                  styles.dropdownItemText,
                                  selectedTimeSpent === time && styles.selectedDropdownItemText
                                ]}>
                                  {time}
                                </ThemedText>
                                {selectedTimeSpent === time && (
                                  <Feather name="check" size={16} color={Colors.light.green[200]} />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                        Additional details (select if applicable)
                      </ThemedText>
                      
                      <View>
                        {additionalDetailOptions.map((detail) => (
                          <TouchableOpacity
                            key={detail}
                            style={[
                              styles.optionButton,
                              selectedAdditionalDetails.has(detail) && styles.selectedOption
                            ]}
                            onPress={() => toggleAdditionalDetail(detail)}
                          >
                            <View style={styles.optionLeft}>
                              <View style={[
                                styles.checkbox,
                                selectedAdditionalDetails.has(detail) && styles.checkedBox
                              ]}>
                                {selectedAdditionalDetails.has(detail) && (
                                  <Feather 
                                    name="check" 
                                    size={14} 
                                    color={Colors.light.background} 
                                  />
                                )}
                              </View>
                              <ThemedText style={[
                                styles.optionText,
                                selectedAdditionalDetails.has(detail) && styles.selectedOptionText
                              ]}>
                                {detail}
                              </ThemedText>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* If they select No for community health worker */}
                  {isCommunityHealthWorker === false && (
                    <View style={styles.nestedSection}>
                      <ThemedText style={styles.conditionalTitle}>
                        What was the focus of this service? (select all that apply)
                      </ThemedText>
                      
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          selectedTrainingFocus.has('General Skills Training and Development') && styles.selectedOption
                        ]}
                        onPress={() => toggleTrainingFocus('General Skills Training and Development')}
                      >
                        <View style={styles.optionLeft}>
                          <View style={[
                            styles.checkbox,
                            selectedTrainingFocus.has('General Skills Training and Development') && styles.checkedBox
                          ]}>
                            {selectedTrainingFocus.has('General Skills Training and Development') && (
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
                              selectedTrainingFocus.has('General Skills Training and Development') && styles.selectedOptionText
                            ]}>
                              General Skills Training and Development
                            </ThemedText>
                            <ThemedText style={styles.serviceDescription}>
                              Teaching practical skills and providing psychoeducation to help students manage challenges
                            </ThemedText>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          selectedTrainingFocus.has('Targeted Skills Training and Development') && styles.selectedOption
                        ]}
                        onPress={() => toggleTrainingFocus('Targeted Skills Training and Development')}
                      >
                        <View style={styles.optionLeft}>
                          <View style={[
                            styles.checkbox,
                            selectedTrainingFocus.has('Targeted Skills Training and Development') && styles.checkedBox
                          ]}>
                            {selectedTrainingFocus.has('Targeted Skills Training and Development') && (
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
                              selectedTrainingFocus.has('Targeted Skills Training and Development') && styles.selectedOptionText
                            ]}>
                              Targeted Skills Training and Development
                            </ThemedText>
                            <ThemedText style={styles.serviceDescription}>
                              Teaching specific skills to address particular challenges or conditions
                            </ThemedText>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Conditional section for Case management */}
              {selectedServices.has(service.name) && service.name === 'Case management' && (
                <View style={styles.conditionalSection}>
                  <ThemedText style={styles.conditionalTitle}>
                    What type of case management service did you provide?
                  </ThemedText>
                  
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedCaseManagementType === 'Care coordination' && styles.selectedOption
                    ]}
                    onPress={() => setSelectedCaseManagementType('Care coordination')}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.radioButton,
                        selectedCaseManagementType === 'Care coordination' && styles.radioButtonSelected
                      ]}>
                        {selectedCaseManagementType === 'Care coordination' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <View style={styles.serviceTextContainer}>
                        <ThemedText style={[
                          styles.optionText,
                          selectedCaseManagementType === 'Care coordination' && styles.selectedOptionText
                        ]}>
                          Care coordination
                        </ThemedText>
                        <ThemedText style={styles.serviceDescription}>
                          Coordinating care between providers, making referrals, and ensuring continuity of care
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedCaseManagementType === 'Service planning' && styles.selectedOption
                    ]}
                    onPress={() => setSelectedCaseManagementType('Service planning')}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.radioButton,
                        selectedCaseManagementType === 'Service planning' && styles.radioButtonSelected
                      ]}>
                        {selectedCaseManagementType === 'Service planning' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <View style={styles.serviceTextContainer}>
                        <ThemedText style={[
                          styles.optionText,
                          selectedCaseManagementType === 'Service planning' && styles.selectedOptionText
                        ]}>
                          Service planning
                        </ThemedText>
                        <ThemedText style={styles.serviceDescription}>
                          Developing and implementing service plans to address student needs
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedCaseManagementType === 'Monitoring and follow-up' && styles.selectedOption
                    ]}
                    onPress={() => setSelectedCaseManagementType('Monitoring and follow-up')}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.radioButton,
                        selectedCaseManagementType === 'Monitoring and follow-up' && styles.radioButtonSelected
                      ]}>
                        {selectedCaseManagementType === 'Monitoring and follow-up' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <View style={styles.serviceTextContainer}>
                        <ThemedText style={[
                          styles.optionText,
                          selectedCaseManagementType === 'Monitoring and follow-up' && styles.selectedOptionText
                        ]}>
                          Monitoring and follow-up
                        </ThemedText>
                        <ThemedText style={styles.serviceDescription}>
                          Tracking progress, adjusting plans, and ensuring services are meeting student needs
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Screening</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Identification of potential health, emotional, or behavioral concerns
          </ThemedText>
          
          {screenings.map((screening) => (
            <TouchableOpacity
              key={screening}
              style={[
                styles.optionButton,
                selectedServices.has(screening) && styles.selectedOption
              ]}
              onPress={() => toggleService(screening)}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has(screening) && styles.checkedBox
                ]}>
                  {selectedServices.has(screening) && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has(screening) && styles.selectedOptionText
                ]}>
                  {screening}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setStep('eligibility')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderModalContent = () => {
    switch (step) {
      case 'select-appointment':
        return renderAppointmentSelection();
      case 'themes-input':
        return renderThemesInput();
      case 'modality':
        return renderModalitySelection();
      case 'claim-details':
        return renderClaimDetailsForm();
      case 'eligibility':
        return renderEligibilityCheck();
      case 'details':
        return renderClaimDetailsForm();
      default:
        return renderAppointmentSelection();
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
  appointmentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentStudent: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textGray[100],
  },
  appointmentDate: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  appointmentType: {
    fontSize: 14,
    color: Colors.light.textGray[300],
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
  selectedAppointmentCard: {
    backgroundColor: Colors.light.textGray[500] + '10',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  backButtonBottom: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.textGray[300],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backButtonText: {
    color: Colors.light.textGray[100],
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    flex: 2,
    backgroundColor: Colors.light.green[200],
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  activeButton: {
    backgroundColor: Colors.light.green[200],
    opacity: 1,
  },
  inactiveButton: {
    backgroundColor: Colors.light.textGray[300],
    opacity: 0.7,
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
  themesInput: {
    borderWidth: 1,
    borderColor: Colors.light.textGray[500],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
    minHeight: 150,
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.light.textGray[300],
    textAlign: 'right',
    marginTop: 4,
  },
  conditionalSection: {
    marginLeft: 32,
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.textGray[500],
    backgroundColor: Colors.light.textGray[500] + '08',
    borderRadius: 8,
  },
  conditionalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textGray[100],
    marginBottom: 12,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.textGray[500],
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.light.background,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500],
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  selectedDropdownItem: {
    backgroundColor: Colors.light.textGray[500] + '20',
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  selectedDropdownItemText: {
    color: Colors.light.green[200],
    fontWeight: '500',
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.tint,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.green[200],
  },
  radioText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  nestedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.textGray[500] + '30',
  },
  underlinedText: {
    textDecorationLine: 'underline',
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
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
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + '20',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedCheckboxContainer: {
    backgroundColor: Colors.light.textGray[500] + '20',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionSubtext: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginTop: 4,
    lineHeight: 18,
  },
});
