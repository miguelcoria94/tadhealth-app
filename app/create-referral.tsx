import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RELATIONSHIP_TYPES = [
  'Health Professional',
  'Parent/Guardian',
  'Staff Member',
  'Family Member',
  'Friend/Peer',
  'Other'
];

export default function ReferralCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const studentId = params.studentId;
  const studentName = params.studentName;

  // Form state
  const [selectedStudent, setSelectedStudent] = useState(studentName || '');
  const [relationship, setRelationship] = useState('Health Professional');
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const [comments, setComments] = useState('');
  const [referrerName, setReferrerName] = useState('Dr. Sarah Wilson');

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!selectedStudent || !relationship) {
        Alert.alert('Please fill in all required fields');
        return;
      }

      // Create referral object
      const newReferral = {
        id: Date.now(), // Simple way to generate unique ID
        studentId: studentId ? parseInt(studentId.toString(), 10) : null,
        studentName: selectedStudent,
        referrer: {
          name: referrerName || 'Anonymous',
          role: relationship
        },
        type: "Support Services",
        comment: comments,
        createdDate: new Date().toISOString(),
        status: 'Active'
      };

      // Get existing referrals
      const existingReferrals = await AsyncStorage.getItem('referrals');
      const referrals = existingReferrals ? JSON.parse(existingReferrals) : [];
      
      // Add new referral
      referrals.push(newReferral);
      
      // Save back to storage
      await AsyncStorage.setItem('referrals', JSON.stringify(referrals));

      Alert.alert(
        'Success', 
        'Referral submitted successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving referral:', error);
      Alert.alert('Failed to submit referral');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.light.background} />
          </Pressable>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.headerTitle}>
              Create a Referral
            </ThemedText>
          </View>
        </View>
  
        <View style={styles.content}>
          <ThemedText style={styles.introText}>
            Please provide information about the student who needs support services.
          </ThemedText>
          
          {/* Student Selection */}
          <ThemedView variant="elevated" style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Student of Interest *
            </ThemedText>
            <TextInput
              style={styles.input}
              value={selectedStudent}
              onChangeText={setSelectedStudent}
              placeholder="Student Name"
              placeholderTextColor={Colors.light.textGray[300]}
              editable={!studentName} // Disable if student is pre-selected
            />
          </ThemedView>
  
          {/* Referrer Information */}
          <ThemedView variant="elevated" style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Request made by
            </ThemedText>
            
            <ThemedText style={styles.label}>I am a... *</ThemedText>
            <Pressable 
              style={styles.dropdownButton}
              onPress={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
            >
              <ThemedText style={styles.dropdownButtonText}>
                {relationship || 'Select relationship'}
              </ThemedText>
              <Feather 
                name={showRelationshipDropdown ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={Colors.light.textGray[300]} 
              />
            </Pressable>
            
            {showRelationshipDropdown && (
              <View style={styles.dropdownContent}>
                {RELATIONSHIP_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setRelationship(type);
                      setShowRelationshipDropdown(false);
                    }}
                  >
                    <ThemedText style={styles.dropdownItemText}>{type}</ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
            
            {relationship && relationship !== 'Health Professional' && (
              <View style={styles.nameInputContainer}>
                <ThemedText style={styles.label}>Your Name</ThemedText>
                <TextInput
                  style={styles.input}
                  value={referrerName}
                  onChangeText={setReferrerName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.light.textGray[300]}
                />
              </View>
            )}
          </ThemedView>
  
          {/* Comments Section */}
          <ThemedView variant="elevated" style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Comments
            </ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={comments}
              onChangeText={(text) => {
                if (text.length <= 500) {
                  setComments(text);
                }
              }}
              placeholder="Please share your concerns or reason for referral..."
              placeholderTextColor={Colors.light.textGray[300]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <ThemedText style={styles.characterCounter}>
              {comments.length} / 500 characters
            </ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
  
      {/* Submit Button - Fixed at bottom */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText style={styles.submitButtonText}>Share concern</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.textGray[500] + '20',
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.green[200],
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: Colors.light.background,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  introText: {
    color: Colors.light.textGray[200],
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  label: {
    color: Colors.light.textGray[200],
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCounter: {
    alignSelf: 'flex-end',
    color: Colors.light.textGray[300],
    fontSize: 12,
    marginTop: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  dropdownContent: {
    marginTop: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + '20',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + '20',
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  nameInputContainer: {
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: Colors.light.green[200],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});