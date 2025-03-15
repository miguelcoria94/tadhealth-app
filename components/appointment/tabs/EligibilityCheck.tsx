import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

interface EligibilityCheckProps {
  appointment: any; // TODO: Replace with proper type
  onStartClaim: () => void;
  onClose: () => void;
}

export const EligibilityCheck: React.FC<EligibilityCheckProps> = ({
  appointment,
  onStartClaim,
  onClose,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const checkEligibility = async () => {
    setIsChecking(true);
    try {
      // TODO: Implement actual eligibility check with your insurance verification API
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsEligible(true);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setIsEligible(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.description}>
        Before creating a claim, let's verify the patient's insurance eligibility.
      </ThemedText>

      {!isEligible && !isChecking && (
        <Pressable
          style={styles.checkButton}
          onPress={checkEligibility}
        >
          <ThemedText style={styles.buttonText}>
            Check Eligibility
          </ThemedText>
        </Pressable>
      )}

      {isChecking && (
        <ThemedText style={styles.statusText}>
          Checking eligibility...
        </ThemedText>
      )}

      {isEligible && (
        <View style={styles.resultContainer}>
          <ThemedText style={styles.eligibleText}>
            ✓ Patient is eligible for insurance claims
          </ThemedText>
          <Pressable
            style={styles.proceedButton}
            onPress={onStartClaim}
          >
            <ThemedText style={styles.buttonText}>
              Proceed to Claim
            </ThemedText>
          </Pressable>
        </View>
      )}

      {isEligible === false && (
        <View style={styles.resultContainer}>
          <ThemedText style={styles.ineligibleText}>
            ✗ Patient is not eligible for insurance claims
          </ThemedText>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>
              Close
            </ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    color: Colors.light.textGray[400],
  },
  checkButton: {
    backgroundColor: Colors.light.green[200],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: Colors.light.green[200],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: Colors.light.textGray[300],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    color: Colors.light.textGray[400],
    textAlign: 'center',
    marginVertical: 16,
  },
  resultContainer: {
    marginTop: 16,
  },
  eligibleText: {
    fontSize: 16,
    color: Colors.light.green[200],
    textAlign: 'center',
    marginBottom: 16,
  },
  ineligibleText: {
    fontSize: 16,
    color: Colors.light.red[200],
    textAlign: 'center',
    marginBottom: 16,
  },
}); 