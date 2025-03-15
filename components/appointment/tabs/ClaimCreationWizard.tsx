import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

interface ClaimCreationWizardProps {
  appointment: any; // TODO: Replace with proper type
  onComplete: () => void;
}

type Step = 'service' | 'diagnosis' | 'review';

export const ClaimCreationWizard: React.FC<ClaimCreationWizardProps> = ({
  appointment,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [formData, setFormData] = useState({
    service: '',
    diagnosis: '',
  });

  const handleNext = () => {
    switch (currentStep) {
      case 'service':
        setCurrentStep('diagnosis');
        break;
      case 'diagnosis':
        setCurrentStep('review');
        break;
      case 'review':
        handleSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'diagnosis':
        setCurrentStep('service');
        break;
      case 'review':
        setCurrentStep('diagnosis');
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement actual claim submission
      console.log('Submitting claim:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (error) {
      console.error('Error submitting claim:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'service':
        return (
          <View>
            <ThemedText style={styles.stepTitle}>Service Information</ThemedText>
            <ThemedText style={styles.description}>
              Please enter the service details for this claim.
            </ThemedText>
            {/* TODO: Add service form fields */}
          </View>
        );
      case 'diagnosis':
        return (
          <View>
            <ThemedText style={styles.stepTitle}>Diagnosis Codes</ThemedText>
            <ThemedText style={styles.description}>
              Enter the relevant diagnosis codes for this claim.
            </ThemedText>
            {/* TODO: Add diagnosis form fields */}
          </View>
        );
      case 'review':
        return (
          <View>
            <ThemedText style={styles.stepTitle}>Review Claim</ThemedText>
            <ThemedText style={styles.description}>
              Please review the claim information before submitting.
            </ThemedText>
            {/* TODO: Add claim review summary */}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
      
      <View style={styles.buttonContainer}>
        {currentStep !== 'service' && (
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>
              Back
            </ThemedText>
          </Pressable>
        )}
        
        <Pressable
          style={styles.nextButton}
          onPress={handleNext}
        >
          <ThemedText style={styles.buttonText}>
            {currentStep === 'review' ? 'Submit' : 'Next'}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.light.textGray[400],
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  nextButton: {
    backgroundColor: Colors.light.green[200],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  backButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonText: {
    color: Colors.light.textGray[400],
    fontSize: 16,
    fontWeight: '600',
  },
}); 