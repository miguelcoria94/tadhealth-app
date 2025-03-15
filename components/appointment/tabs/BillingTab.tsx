import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Pressable, 
  Modal,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface BillingTabProps {
  appointment: any; // TODO: Replace with proper type
}

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

export const BillingTab: React.FC<BillingTabProps> = ({ appointment }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [selectedModalities, setSelectedModalities] = useState<Set<Modality>>(new Set());
  const [step, setStep] = useState<'initial' | 'modality' | 'claim-details'>('initial');
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const handleCreateClaim = () => {
    console.log('Create claim pressed');
    setStep('initial');
    setShowInitialMessage(true);
    setSelectedModalities(new Set());
    setSelectedThemes(new Set());
    setSelectedServices(new Set());
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleComplete = () => {
    setShowInitialMessage(false);
    setStep('modality');
  };

  const handleSave = () => {
    console.log('Saving modalities:', Array.from(selectedModalities));
    handleCloseModal();
  };

  const handleStartClaim = () => {
    console.log('Starting claim with modalities:', Array.from(selectedModalities));
    setStep('claim-details');
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

  const handleContinue = () => {
    // In a real app, this would submit the claim data to an API
    handleCloseModal();
  };

  const renderModalHeader = () => (
    <View style={styles.modalHeader}>
      <ThemedText style={styles.modalTitle}>
        {step === 'initial' ? 'Claim Eligibility' : 
         step === 'modality' ? 'Modality' : 
         'Prepare Reimbursement Claim'}
      </ThemedText>
      <Pressable 
        style={styles.closeButton}
        onPress={handleCloseModal}
      >
        <Feather name="x" size={24} color={Colors.light.textGray[300]} />
      </Pressable>
    </View>
  );

  const renderInitialMessage = () => (
    <View style={styles.modalContent}>
      <ThemedView variant="elevated" style={styles.messageCard}>
        <ThemedText style={styles.messageText}>
          This session might qualify for reimbursement. Answer a few quick questions to check eligibility and file your claim.
        </ThemedText>
        <Pressable 
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <ThemedText style={styles.buttonText}>Complete</ThemedText>
        </Pressable>
      </ThemedView>
    </View>
  );

  const renderModalitySelection = () => (
    <View style={styles.modalContent}>
      <ThemedView variant="elevated" style={styles.modalityCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Modality
        </ThemedText>
        <ScrollView style={styles.optionsContainer}>
          {MODALITY_OPTIONS.map((option) => (
            <Pressable
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
            </Pressable>
          ))}
        </ScrollView>

        <ThemedText style={styles.readyText}>
          Ready to submit a claim? Answer a few quick questions to find out and submit your information for reimbursement.
        </ThemedText>

        <Pressable 
          style={styles.startClaimButton}
          onPress={handleStartClaim}
        >
          <ThemedText style={styles.buttonText}>
            Save and Start a Claim
          </ThemedText>
        </Pressable>

        <View style={styles.bottomButtons}>
          <Pressable style={styles.moreOptionsButton}>
            <ThemedText style={styles.moreOptionsText}>More Options</ThemedText>
          </Pressable>
          <Pressable 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </View>
  );

  const renderClaimDetailsForm = () => {
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
            <Pressable
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
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Services you provided during the session</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Select the services you provided, and indicate how much time you spent on each
          </ThemedText>
          
          {services.map((service) => (
            <Pressable
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
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.startClaimButton}
          onPress={handleContinue}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <ThemedView variant="elevated" style={styles.emptyStateCard}>
        <ThemedText style={styles.emptyStateText}>
          No billing information found for this appointment.
        </ThemedText>
        <Pressable 
          style={styles.actionButton}
          onPress={handleCreateClaim}
        >
          <Feather name="file-plus" size={20} color={Colors.light.background} />
          <ThemedText style={styles.buttonText}>Create Claim</ThemedText>
        </Pressable>
      </ThemedView>

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
              {step === 'initial' && showInitialMessage && renderInitialMessage()}
              {step === 'modality' && renderModalitySelection()}
              {step === 'claim-details' && renderClaimDetailsForm()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  emptyStateCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyStateText: {
    color: Colors.light.textGray[300],
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 180,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
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
  closeButton: {
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
  // Initial message card
  messageCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  messageText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    textAlign: 'center',
    lineHeight: 22,
  },
  completeButton: {
    backgroundColor: Colors.light.green[200],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modality selection
  modalityCard: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  optionsContainer: {
    maxHeight: 300,
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
  startClaimButton: {
    backgroundColor: Colors.light.green[200],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreOptionsButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  moreOptionsText: {
    color: Colors.light.textGray[300],
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.light.green[200],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  // Add new styles for claim details
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