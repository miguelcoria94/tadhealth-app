import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Pressable, 
  Modal,
  ScrollView,
  Text,
  Platform,
  TextInput,
  FlatList,
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
  const [step, setStep] = useState<'initial' | 'themes-input' | 'modality' | 'claim-details'>('initial');
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [themesText, setThemesText] = useState('');
  const [selectedHBIFocus, setSelectedHBIFocus] = useState<Set<string>>(new Set());
  const [selectedTimeSpent, setSelectedTimeSpent] = useState<string>('15 minutes');
  const [selectedAdditionalDetails, setSelectedAdditionalDetails] = useState<Set<string>>(new Set());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isCommunityHealthWorker, setIsCommunityHealthWorker] = useState<boolean | null>(null);
  const [selectedTrainingFocus, setSelectedTrainingFocus] = useState<Set<string>>(new Set());
  const [selectedCaseManagementTypes, setSelectedCaseManagementTypes] = useState<Set<string>>(new Set());
  const [acesOutcome, setAcesOutcome] = useState<'High Risk' | 'Low Risk'>('High Risk');
  const [depressionOutcome, setDepressionOutcome] = useState<'Positive, Depression is present and follow-up plan is documented' | 'Negative, Depression is absent and a follow-up is not required'>('Positive, Depression is present and follow-up plan is documented');

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
    setStep('themes-input');
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
    // For radio button behavior (single selection)
    const newSelection = new Set<string>();
    // If the same option is clicked again, clear the selection
    if (!selectedAdditionalDetails.has(detail)) {
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
    const newSelection = new Set(selectedCaseManagementTypes);
    if (newSelection.has(type)) {
      newSelection.delete(type);
    } else {
      newSelection.add(type);
    }
    setSelectedCaseManagementTypes(newSelection);
  };

  const handleContinue = () => {
    // In a real app, this would submit the claim data to an API
    handleCloseModal();
  };

  const handleContinueFromThemes = () => {
    if (themesText.trim().length > 0) {
      setStep('modality');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSpent(time);
    setShowTimeDropdown(false);
  };

  const handleBack = () => {
    if (step === 'claim-details') {
      setStep('modality');
    } else if (step === 'modality') {
      setStep('themes-input');
    } else if (step === 'themes-input') {
      setStep('initial');
      setShowInitialMessage(true);
    } else {
      handleCloseModal();
    }
  };

  const renderModalHeader = () => (
    <View style={styles.modalHeader}>
      {step !== 'initial' && (
        <Pressable 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Feather name="arrow-left" size={24} color={Colors.light.textGray[300]} />
        </Pressable>
      )}
      <ThemedText style={styles.modalTitle}>
        {step === 'initial' ? 'Claim Eligibility' : 
         step === 'themes-input' ? 'Prepare Reimbursement Claim' :
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

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </Pressable>
          <Pressable 
            style={styles.continueButton}
            onPress={handleStartClaim}
          >
            <ThemedText style={styles.buttonText}>
              Continue
            </ThemedText>
          </Pressable>
        </View>

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

  const renderThemesInput = () => (
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
        <Pressable
          style={styles.backButtonBottom}
          onPress={handleBack}
        >
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.continueButton,
            themesText.trim().length > 0 ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={handleContinueFromThemes}
          disabled={themesText.trim().length === 0}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </Pressable>
      </View>
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
            <View key={service.name}>
              <Pressable
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

              {/* Conditional section for Health behavior intervention */}
              {selectedServices.has(service.name) && service.name === 'Health behavior intervention' && (
                <View style={styles.conditionalSection}>
                  <ThemedText style={styles.conditionalTitle}>
                    What was the focus of this service? (select all that apply)
                  </ThemedText>
                  
                  {hbiFocusOptions.map((focus) => (
                    <Pressable
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
                    </Pressable>
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
                    <Pressable
                      style={styles.dropdown}
                      onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                    >
                      <ThemedText style={styles.dropdownText}>
                        {selectedTimeSpent}
                      </ThemedText>
                      <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                    </Pressable>
                    
                    {showTimeDropdown && (
                      <View style={styles.dropdownList}>
                        {timeOptions.map((time) => (
                          <Pressable
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
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                    Additional details (select if applicable)
                  </ThemedText>
                  
                  <View style={styles.radioContainer}>
                    {additionalDetailOptions.map((detail) => (
                      <Pressable
                        key={detail}
                        style={styles.radioOption}
                        onPress={() => toggleAdditionalDetail(detail)}
                      >
                        <View style={[
                          styles.radioButton,
                          selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                        ]}>
                          {selectedAdditionalDetails.has(detail) && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <ThemedText style={styles.radioText}>
                          {detail}
                        </ThemedText>
                      </Pressable>
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
                    <Pressable
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
                    </Pressable>
                    
                    <Pressable
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
                    </Pressable>
                  </View>

                  {/* If they select Yes for community health worker */}
                  {isCommunityHealthWorker === true && (
                    <View style={styles.nestedSection}>
                      <ThemedText style={styles.conditionalTitle}>
                        Time spent on this service
                      </ThemedText>
                      
                      <View style={styles.dropdownContainer}>
                        <Pressable
                          style={styles.dropdown}
                          onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                        >
                          <ThemedText style={styles.dropdownText}>
                            {selectedTimeSpent}
                          </ThemedText>
                          <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                        </Pressable>
                        
                        {showTimeDropdown && (
                          <View style={styles.dropdownList}>
                            {timeOptions.map((time) => (
                              <Pressable
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
                              </Pressable>
                            ))}
                          </View>
                        )}
                      </View>

                      <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                        Additional details (select if applicable)
                      </ThemedText>
                      
                      <View style={styles.radioContainer}>
                        {additionalDetailOptions.map((detail) => (
                          <Pressable
                            key={detail}
                            style={styles.radioOption}
                            onPress={() => toggleAdditionalDetail(detail)}
                          >
                            <View style={[
                              styles.radioButton,
                              selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                            ]}>
                              {selectedAdditionalDetails.has(detail) && (
                                <View style={styles.radioButtonInner} />
                              )}
                            </View>
                            <ThemedText style={styles.radioText}>
                              {detail}
                            </ThemedText>
                          </Pressable>
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
                      
                      <Pressable
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
                      </Pressable>

                      <Pressable
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
                      </Pressable>
                    </View>
                  )}
                </View>
              )}

              {/* Conditional section for Case management */}
              {selectedServices.has(service.name) && service.name === 'Case management' && (
                <View style={styles.conditionalSection}>
                  <ThemedText style={styles.conditionalTitle}>
                    Was the care targeted or general?
                  </ThemedText>
                  
                  <View>
                    <Pressable
                      style={[
                        styles.optionButton,
                        selectedCaseManagementTypes.has('Targeted') && styles.selectedOption
                      ]}
                      onPress={() => toggleCaseManagementType('Targeted')}
                    >
                      <View style={styles.optionLeft}>
                        <View style={[
                          styles.checkbox,
                          selectedCaseManagementTypes.has('Targeted') && styles.checkedBox
                        ]}>
                          {selectedCaseManagementTypes.has('Targeted') && (
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
                            selectedCaseManagementTypes.has('Targeted') && styles.selectedOptionText
                          ]}>
                            Targeted
                          </ThemedText>
                          <ThemedText style={styles.serviceDescription}>
                            Focused and goal-oriented support to students with specific needs or challenges
                          </ThemedText>
                        </View>
                      </View>
                    </Pressable>
                    
                    {selectedCaseManagementTypes.has('Targeted') && (
                      <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                        <ThemedText style={styles.conditionalTitle}>
                          Time spent on this service
                        </ThemedText>
                        
                        <View style={styles.dropdownContainer}>
                          <Pressable
                            style={styles.dropdown}
                            onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                          >
                            <ThemedText style={styles.dropdownText}>
                              {selectedTimeSpent}
                            </ThemedText>
                            <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                          </Pressable>
                          
                          {showTimeDropdown && (
                            <View style={styles.dropdownList}>
                              {timeOptions.map((time) => (
                                <Pressable
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
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>

                        <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                          Additional details (select if applicable)
                        </ThemedText>
                        
                        <View style={styles.radioContainer}>
                          {additionalDetailOptions.map((detail) => (
                            <Pressable
                              key={detail}
                              style={styles.radioOption}
                              onPress={() => toggleAdditionalDetail(detail)}
                            >
                              <View style={[
                                styles.radioButton,
                                selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                              ]}>
                                {selectedAdditionalDetails.has(detail) && (
                                  <View style={styles.radioButtonInner} />
                                )}
                              </View>
                              <ThemedText style={styles.radioText}>
                                {detail}
                              </ThemedText>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                  
                  <View>
                    <Pressable
                      style={[
                        styles.optionButton,
                        selectedCaseManagementTypes.has('General with student or family present') && styles.selectedOption
                      ]}
                      onPress={() => toggleCaseManagementType('General with student or family present')}
                    >
                      <View style={styles.optionLeft}>
                        <View style={[
                          styles.checkbox,
                          selectedCaseManagementTypes.has('General with student or family present') && styles.checkedBox
                        ]}>
                          {selectedCaseManagementTypes.has('General with student or family present') && (
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
                            selectedCaseManagementTypes.has('General with student or family present') && styles.selectedOptionText
                          ]}>
                            General with student or family present
                          </ThemedText>
                          <ThemedText style={styles.serviceDescription}>
                            Help organize services and connect to support, <Text style={styles.underlinedText}>with</Text> the student or family present
                          </ThemedText>
                        </View>
                      </View>
                    </Pressable>
                    
                    {selectedCaseManagementTypes.has('General with student or family present') && (
                      <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                        <ThemedText style={styles.conditionalTitle}>
                          Time spent on this service
                        </ThemedText>
                        
                        <View style={styles.dropdownContainer}>
                          <Pressable
                            style={styles.dropdown}
                            onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                          >
                            <ThemedText style={styles.dropdownText}>
                              {selectedTimeSpent}
                            </ThemedText>
                            <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                          </Pressable>
                          
                          {showTimeDropdown && (
                            <View style={styles.dropdownList}>
                              {timeOptions.map((time) => (
                                <Pressable
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
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>

                        <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                          Additional details (select if applicable)
                        </ThemedText>
                        
                        <View style={styles.radioContainer}>
                          {additionalDetailOptions.map((detail) => (
                            <Pressable
                              key={detail}
                              style={styles.radioOption}
                              onPress={() => toggleAdditionalDetail(detail)}
                            >
                              <View style={[
                                styles.radioButton,
                                selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                              ]}>
                                {selectedAdditionalDetails.has(detail) && (
                                  <View style={styles.radioButtonInner} />
                                )}
                              </View>
                              <ThemedText style={styles.radioText}>
                                {detail}
                              </ThemedText>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                  
                  <View>
                    <Pressable
                      style={[
                        styles.optionButton,
                        selectedCaseManagementTypes.has('General without student or family present') && styles.selectedOption
                      ]}
                      onPress={() => toggleCaseManagementType('General without student or family present')}
                    >
                      <View style={styles.optionLeft}>
                        <View style={[
                          styles.checkbox,
                          selectedCaseManagementTypes.has('General without student or family present') && styles.checkedBox
                        ]}>
                          {selectedCaseManagementTypes.has('General without student or family present') && (
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
                            selectedCaseManagementTypes.has('General without student or family present') && styles.selectedOptionText
                          ]}>
                            General without student or family present
                          </ThemedText>
                          <ThemedText style={styles.serviceDescription}>
                            Help organize services and connect to support, <Text style={styles.underlinedText}>without</Text> the student or family present
                          </ThemedText>
                        </View>
                      </View>
                    </Pressable>
                    
                    {selectedCaseManagementTypes.has('General without student or family present') && (
                      <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                        <ThemedText style={styles.conditionalTitle}>
                          Time spent on this service
                        </ThemedText>
                        
                        <View style={styles.dropdownContainer}>
                          <Pressable
                            style={styles.dropdown}
                            onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                          >
                            <ThemedText style={styles.dropdownText}>
                              {selectedTimeSpent}
                            </ThemedText>
                            <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                          </Pressable>
                          
                          {showTimeDropdown && (
                            <View style={styles.dropdownList}>
                              {timeOptions.map((time) => (
                                <Pressable
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
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>

                        <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                          Additional details (select if applicable)
                        </ThemedText>
                        
                        <View style={styles.radioContainer}>
                          {additionalDetailOptions.map((detail) => (
                            <Pressable
                              key={detail}
                              style={styles.radioOption}
                              onPress={() => toggleAdditionalDetail(detail)}
                            >
                              <View style={[
                                styles.radioButton,
                                selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                              ]}>
                                {selectedAdditionalDetails.has(detail) && (
                                  <View style={styles.radioButtonInner} />
                                )}
                              </View>
                              <ThemedText style={styles.radioText}>
                                {detail}
                              </ThemedText>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
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
          
          <View>
            <Pressable
              key="Annual alcohol misuse"
              style={[
                styles.optionButton,
                selectedServices.has('Annual alcohol misuse') && styles.selectedOption
              ]}
              onPress={() => toggleService('Annual alcohol misuse')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Annual alcohol misuse') && styles.checkedBox
                ]}>
                  {selectedServices.has('Annual alcohol misuse') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Annual alcohol misuse') && styles.selectedOptionText
                ]}>
                  Annual alcohol misuse
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Annual alcohol misuse') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Alcohol and/or substance abuse structured screening"
              style={[
                styles.optionButton,
                selectedServices.has('Alcohol and/or substance abuse structured screening') && styles.selectedOption
              ]}
              onPress={() => toggleService('Alcohol and/or substance abuse structured screening')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Alcohol and/or substance abuse structured screening') && styles.checkedBox
                ]}>
                  {selectedServices.has('Alcohol and/or substance abuse structured screening') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Alcohol and/or substance abuse structured screening') && styles.selectedOptionText
                ]}>
                  Alcohol and/or substance abuse structured screening
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Alcohol and/or substance abuse structured screening') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Adverse childhood experiences (ACES) / trauma"
              style={[
                styles.optionButton,
                selectedServices.has('Adverse childhood experiences (ACES) / trauma') && styles.selectedOption
              ]}
              onPress={() => toggleService('Adverse childhood experiences (ACES) / trauma')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Adverse childhood experiences (ACES) / trauma') && styles.checkedBox
                ]}>
                  {selectedServices.has('Adverse childhood experiences (ACES) / trauma') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Adverse childhood experiences (ACES) / trauma') && styles.selectedOptionText
                ]}>
                  Adverse childhood experiences (ACES) / trauma
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Adverse childhood experiences (ACES) / trauma') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  What was the outcome?
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  <Pressable
                    style={styles.radioOption}
                    onPress={() => setAcesOutcome('High Risk')}
                  >
                    <View style={[
                      styles.radioButton,
                      acesOutcome === 'High Risk' && styles.radioButtonSelected
                    ]}>
                      {acesOutcome === 'High Risk' && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <ThemedText style={styles.radioText}>High Risk</ThemedText>
                  </Pressable>
                  
                  <Pressable
                    style={styles.radioOption}
                    onPress={() => setAcesOutcome('Low Risk')}
                  >
                    <View style={[
                      styles.radioButton,
                      acesOutcome === 'Low Risk' && styles.radioButtonSelected
                    ]}>
                      {acesOutcome === 'Low Risk' && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <ThemedText style={styles.radioText}>Low Risk</ThemedText>
                  </Pressable>
                </View>
                
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Depression"
              style={[
                styles.optionButton,
                selectedServices.has('Depression') && styles.selectedOption
              ]}
              onPress={() => toggleService('Depression')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Depression') && styles.checkedBox
                ]}>
                  {selectedServices.has('Depression') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Depression') && styles.selectedOptionText
                ]}>
                  Depression
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Depression') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  What was the outcome?
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  <Pressable
                    style={styles.radioOption}
                    onPress={() => setDepressionOutcome('Positive, Depression is present and follow-up plan is documented')}
                  >
                    <View style={[
                      styles.radioButton,
                      depressionOutcome === 'Positive, Depression is present and follow-up plan is documented' && styles.radioButtonSelected
                    ]}>
                      {depressionOutcome === 'Positive, Depression is present and follow-up plan is documented' && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <ThemedText style={styles.radioText}>Positive, Depression is present and follow-up plan is documented</ThemedText>
                  </Pressable>
                  
                  <Pressable
                    style={styles.radioOption}
                    onPress={() => setDepressionOutcome('Negative, Depression is absent and a follow-up is not required')}
                  >
                    <View style={[
                      styles.radioButton,
                      depressionOutcome === 'Negative, Depression is absent and a follow-up is not required' && styles.radioButtonSelected
                    ]}>
                      {depressionOutcome === 'Negative, Depression is absent and a follow-up is not required' && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <ThemedText style={styles.radioText}>Negative, Depression is absent and a follow-up is not required</ThemedText>
                  </Pressable>
                </View>
                
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Testing or Assessment</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Detailed evaluations to better understand a student's mental, emotional, or cognitive functioning
          </ThemedText>
          
          <View>
            <Pressable
              key="Alcohol and/or substance abuse structured assessment"
              style={[
                styles.optionButton,
                selectedServices.has('Alcohol and/or substance abuse structured assessment') && styles.selectedOption
              ]}
              onPress={() => toggleService('Alcohol and/or substance abuse structured assessment')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Alcohol and/or substance abuse structured assessment') && styles.checkedBox
                ]}>
                  {selectedServices.has('Alcohol and/or substance abuse structured assessment') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Alcohol and/or substance abuse structured assessment') && styles.selectedOptionText
                ]}>
                  Alcohol and/or substance abuse structured assessment
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Alcohol and/or substance abuse structured assessment') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Psychosocial status assessment"
              style={[
                styles.optionButton,
                selectedServices.has('Psychosocial status assessment') && styles.selectedOption
              ]}
              onPress={() => toggleService('Psychosocial status assessment')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Psychosocial status assessment') && styles.checkedBox
                ]}>
                  {selectedServices.has('Psychosocial status assessment') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Psychosocial status assessment') && styles.selectedOptionText
                ]}>
                  Psychosocial status assessment
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Psychosocial status assessment') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Psychological"
              style={[
                styles.optionButton,
                selectedServices.has('Psychological') && styles.selectedOption
              ]}
              onPress={() => toggleService('Psychological')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Psychological') && styles.checkedBox
                ]}>
                  {selectedServices.has('Psychological') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Psychological') && styles.selectedOptionText
                ]}>
                  Psychological
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Psychological') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Neuropsychological"
              style={[
                styles.optionButton,
                selectedServices.has('Neuropsychological') && styles.selectedOption
              ]}
              onPress={() => toggleService('Neuropsychological')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Neuropsychological') && styles.checkedBox
                ]}>
                  {selectedServices.has('Neuropsychological') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Neuropsychological') && styles.selectedOptionText
                ]}>
                  Neuropsychological
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Neuropsychological') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Psychiatric Diagnostic Evaluation"
              style={[
                styles.optionButton,
                selectedServices.has('Psychiatric Diagnostic Evaluation') && styles.selectedOption
              ]}
              onPress={() => toggleService('Psychiatric Diagnostic Evaluation')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Psychiatric Diagnostic Evaluation') && styles.checkedBox
                ]}>
                  {selectedServices.has('Psychiatric Diagnostic Evaluation') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Psychiatric Diagnostic Evaluation') && styles.selectedOptionText
                ]}>
                  Psychiatric Diagnostic Evaluation
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Psychiatric Diagnostic Evaluation') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Brief emotional behavioral assessment"
              style={[
                styles.optionButton,
                selectedServices.has('Brief emotional behavioral assessment') && styles.selectedOption
              ]}
              onPress={() => toggleService('Brief emotional behavioral assessment')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Brief emotional behavioral assessment') && styles.checkedBox
                ]}>
                  {selectedServices.has('Brief emotional behavioral assessment') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Brief emotional behavioral assessment') && styles.selectedOptionText
                ]}>
                  Brief emotional behavioral assessment
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Brief emotional behavioral assessment') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Neurobehavioral status examination"
              style={[
                styles.optionButton,
                selectedServices.has('Neurobehavioral status examination') && styles.selectedOption
              ]}
              onPress={() => toggleService('Neurobehavioral status examination')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Neurobehavioral status examination') && styles.checkedBox
                ]}>
                  {selectedServices.has('Neurobehavioral status examination') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Neurobehavioral status examination') && styles.selectedOptionText
                ]}>
                  Neurobehavioral status examination
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Neurobehavioral status examination') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Psychotherapy</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Individual and/or group therapy to address emotional and mental health challenges
          </ThemedText>
          
          <View>
            <Pressable
              key="Therapeutic Session"
              style={[
                styles.optionButton,
                selectedServices.has('Therapeutic Session') && styles.selectedOption
              ]}
              onPress={() => toggleService('Therapeutic Session')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Therapeutic Session') && styles.checkedBox
                ]}>
                  {selectedServices.has('Therapeutic Session') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Therapeutic Session') && styles.selectedOptionText
                ]}>
                  Therapeutic Session
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Therapeutic Session') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Crisis"
              style={[
                styles.optionButton,
                selectedServices.has('Crisis') && styles.selectedOption
              ]}
              onPress={() => toggleService('Crisis')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Crisis') && styles.checkedBox
                ]}>
                  {selectedServices.has('Crisis') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Crisis') && styles.selectedOptionText
                ]}>
                  Crisis
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Crisis') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View>
            <Pressable
              key="Family"
              style={[
                styles.optionButton,
                selectedServices.has('Family') && styles.selectedOption
              ]}
              onPress={() => toggleService('Family')}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.checkbox,
                  selectedServices.has('Family') && styles.checkedBox
                ]}>
                  {selectedServices.has('Family') && (
                    <Feather 
                      name="check" 
                      size={14} 
                      color={Colors.light.background} 
                    />
                  )}
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedServices.has('Family') && styles.selectedOptionText
                ]}>
                  Family
                </ThemedText>
              </View>
            </Pressable>
            
            {selectedServices.has('Family') && (
              <View style={[styles.nestedSection, { marginLeft: 32, borderLeftWidth: 2, borderLeftColor: Colors.light.textGray[500], paddingLeft: 12 }]}>
                <ThemedText style={styles.conditionalTitle}>
                  Time spent on this service
                </ThemedText>
                
                <View style={styles.dropdownContainer}>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <ThemedText style={styles.dropdownText}>
                      {selectedTimeSpent}
                    </ThemedText>
                    <Feather name="chevron-down" size={20} color={Colors.light.textGray[300]} />
                  </Pressable>
                  
                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      {timeOptions.map((time) => (
                        <Pressable
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.conditionalTitle, { marginTop: 16 }]}>
                  Additional details (select if applicable)
                </ThemedText>
                
                <View style={styles.radioContainer}>
                  {additionalDetailOptions.map((detail) => (
                    <Pressable
                      key={detail}
                      style={styles.radioOption}
                      onPress={() => toggleAdditionalDetail(detail)}
                    >
                      <View style={[
                        styles.radioButton,
                        selectedAdditionalDetails.has(detail) && styles.radioButtonSelected
                      ]}>
                        {selectedAdditionalDetails.has(detail) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <ThemedText style={styles.radioText}>
                        {detail}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </Pressable>
          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </Pressable>
        </View>
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
              {step === 'themes-input' && renderThemesInput()}
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
  backButton: {
    padding: 12,
    marginLeft: 4,
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
  activeButton: {
    backgroundColor: Colors.light.green[200],
    opacity: 1,
  },
  inactiveButton: {
    backgroundColor: Colors.light.textGray[300],
    opacity: 0.7,
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
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + '20',
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
    borderColor: Colors.light.textGray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: Colors.light.green[200],
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
}); 