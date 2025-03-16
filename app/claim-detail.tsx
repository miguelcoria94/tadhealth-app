import { View, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { appointments } from '@/assets/dummyData/appointments';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';

// Define interfaces
interface ClaimDetail {
  id: string;
  referenceNo: string;
  submissionDate: string;
  student: {
    id: string;
    name: string;
  };
  appointment: {
    id: string;
    date: string;
    time: string;
    service: string;
  };
  status: 'Submitted' | 'In Progress' | 'Not Started';
  details?: {
    timeSpent: string;
    additionalInfo: string;
    amount: number;
    modalitiesUsed: string[];
  };
}

// Generate mock data for claims based on appointments
const generateMockClaims = (): ClaimDetail[] => {
  // Get specific appointments for our demo with different students
  const appointment1 = appointments.find(a => a.id === 3); // John Doe (completed appointment)
  const appointment2 = appointments.find(a => a.id === 6); // Jane Smith (completed appointment)
  const appointment3 = appointments.find(a => a.id === 7); // Samuel Green
  
  if (!appointment1 || !appointment2 || !appointment3) {
    // Fallback if appointments not found
    return [
      // First claim: Completed
      {
        id: 'claim-1',
        referenceNo: 'REF100001',
        submissionDate: new Date().toISOString().split('T')[0],
        student: {
          id: '1001',
          name: 'Emma Johnson',
        },
        appointment: {
          id: '2001',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          service: 'Therapy Session',
        },
        status: 'Submitted',
        details: {
          timeSpent: '45 min',
          additionalInfo: 'Regular session with good progress. Student showed improvement in coping strategies.',
          amount: 85.75,
          modalitiesUsed: ['Cognitive Behavioral Therapy', 'Talk Therapy'],
        },
      },
      // Second claim: In Progress
      {
        id: 'claim-2',
        referenceNo: 'REF100002',
        submissionDate: '',
        student: {
          id: '1002',
          name: 'Michael Smith',
        },
        appointment: {
          id: '2002',
          date: new Date().toISOString().split('T')[0],
          time: '11:30 AM',
          service: 'Initial Assessment',
        },
        status: 'In Progress',
        details: {
          timeSpent: '30 min',
          additionalInfo: '',
          amount: 0,
          modalitiesUsed: ['Talk Therapy'],
        },
      },
      // Third claim: Not Started
      {
        id: 'claim-3',
        referenceNo: 'REF100003',
        submissionDate: '',
        student: {
          id: '1003',
          name: 'Sophia Williams',
        },
        appointment: {
          id: '2003',
          date: new Date().toISOString().split('T')[0],
          time: '2:00 PM',
          service: 'Therapy Session',
        },
        status: 'Not Started',
        details: undefined,
      },
    ];
  }
  
  return [
    // First claim: Completed
    {
      id: 'claim-1',
      referenceNo: 'REF100001',
      submissionDate: new Date().toISOString().split('T')[0],
      student: {
        id: String(appointment1.student.id),
        name: appointment1.student.name,
      },
      appointment: {
        id: String(appointment1.id),
        date: appointment1.time.date,
        time: appointment1.time.time,
        service: appointment1.type,
      },
      status: 'Submitted',
      details: {
        timeSpent: '45 min',
        additionalInfo: 'Regular session with good progress. Student showed improvement in coping strategies.',
        amount: 85.75,
        modalitiesUsed: ['Cognitive Behavioral Therapy', 'Talk Therapy'],
      },
    },
    // Second claim: In Progress
    {
      id: 'claim-2',
      referenceNo: 'REF100002',
      submissionDate: '',
      student: {
        id: String(appointment2.student.id),
        name: appointment2.student.name,
      },
      appointment: {
        id: String(appointment2.id),
        date: appointment2.time.date,
        time: appointment2.time.time,
        service: appointment2.type,
      },
      status: 'In Progress',
      details: {
        timeSpent: '30 min',
        additionalInfo: '',
        amount: 0,
        modalitiesUsed: ['Talk Therapy'],
      },
    },
    // Third claim: Not Started
    {
      id: 'claim-3',
      referenceNo: 'REF100003',
      submissionDate: '',
      student: {
        id: String(appointment3.student.id),
        name: appointment3.student.name,
      },
      appointment: {
        id: String(appointment3.id),
        date: appointment3.time.date,
        time: appointment3.time.time,
        service: appointment3.type,
      },
      status: 'Not Started',
      details: undefined,
    },
  ];
};

const mockClaims = generateMockClaims();

export default function ClaimDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Custom back button component
  const CustomBackButton = () => (
    <TouchableOpacity 
      onPress={() => router.back()} 
      style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}
    >
      <Ionicons name="chevron-back" size={24} color={Colors.light.tint} />
    </TouchableOpacity>
  );
  
  const claim = mockClaims.find((c) => c.id === id);
  
  if (!claim) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ 
          title: 'Claim Details',
          headerLeft: () => <CustomBackButton />,
          headerTintColor: Colors.light.tint
        }} />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Claim not found</ThemedText>
          <Pressable 
            style={styles.button}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Go Back</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }
  
  // Handle "Not Started" status
  if (claim.status === 'Not Started') {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Claim Details',
            headerLeft: () => <CustomBackButton />,
            headerTintColor: Colors.light.tint,
            headerRight: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                <ThemedText style={{ color: Colors.light.tint }}>Close</ThemedText>
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.notStartedContainer}>
          <FontAwesome name="file-text-o" size={64} color={Colors.light.textGray[400]} style={styles.notStartedIcon} />
          <ThemedText style={styles.notStartedTitle}>No Claim Created Yet</ThemedText>
          <ThemedText style={styles.notStartedDescription}>
            This appointment is eligible for billing, but a claim has not been created yet.
          </ThemedText>
          <Pressable 
            style={styles.createClaimButton}
            onPress={() => router.push(`/claims-create?appointmentId=${claim.appointment.id}`)}
          >
            <ThemedText style={styles.createClaimButtonText}>Create Claim</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }
  
  // Special handling for In Progress claims
  const isInProgress = claim.status === 'In Progress';
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Claim Details',
          headerLeft: () => <CustomBackButton />,
          headerTintColor: Colors.light.tint,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
              <ThemedText style={{ color: Colors.light.tint }}>Close</ThemedText>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>
            Claim {claim.referenceNo}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  claim.status === "Submitted"
                    ? Colors.light.success
                    : claim.status === "In Progress"
                    ? Colors.light.textGray[300]
                    : Colors.light.textGray[500],
              },
            ]}
          >
            <ThemedText style={styles.statusText}>{claim.status}</ThemedText>
          </View>
        </View>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Student Information</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>{claim.student.name}</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.label}>ID:</ThemedText>
            <ThemedText style={styles.value}>{claim.student.id}</ThemedText>
          </View>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Appointment Information</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Date:</ThemedText>
            <ThemedText style={styles.value}>{claim.appointment.date}</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Time:</ThemedText>
            <ThemedText style={styles.value}>{claim.appointment.time}</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Service:</ThemedText>
            <ThemedText style={styles.value}>{claim.appointment.service}</ThemedText>
          </View>
        </ThemedView>
        
        {claim.details && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Claim Details</ThemedText>
            
            <View style={styles.row}>
              <ThemedText style={styles.label}>Time Spent:</ThemedText>
              <ThemedText style={styles.value}>{claim.details.timeSpent}</ThemedText>
            </View>
            
            {isInProgress ? (
              <>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Additional Info:</ThemedText>
                  <View style={styles.missingDataContainer}>
                    <ThemedText style={styles.missingDataText}>Missing Information</ThemedText>
                  </View>
                </View>
                
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Amount:</ThemedText>
                  <View style={styles.missingDataContainer}>
                    <ThemedText style={styles.missingDataText}>Not Set</ThemedText>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Additional Info:</ThemedText>
                  <ThemedText style={styles.value}>{claim.details.additionalInfo}</ThemedText>
                </View>
                
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Amount:</ThemedText>
                  <ThemedText style={styles.value}>${claim.details.amount.toFixed(2)}</ThemedText>
                </View>
              </>
            )}
            
            <View style={styles.row}>
              <ThemedText style={styles.label}>Modalities Used:</ThemedText>
              <View style={styles.tagsContainer}>
                {claim.details.modalitiesUsed.map((modality, index) => (
                  <View key={index} style={[
                    styles.tag,
                    { backgroundColor: claim.status === 'Submitted' ? Colors.light.green[100] : Colors.light.textGray[100] }
                  ]}>
                    <ThemedText style={[
                      styles.tagText,
                      { color: claim.status === 'Submitted' ? Colors.light.green[200] : Colors.light.textGray[300] }
                    ]}>{modality}</ThemedText>
                  </View>
                ))}
                {isInProgress && (
                  <View style={styles.addMoreTag}>
                    <ThemedText style={styles.addMoreText}>+ Add More</ThemedText>
                  </View>
                )}
              </View>
            </View>
          </ThemedView>
        )}
        
        {isInProgress && (
          <View style={styles.inProgressActions}>
            <Pressable 
              style={styles.continueButton}
              onPress={() => router.push(`/claims-create?appointmentId=${claim.appointment.id}&status=${claim.status}`)}
            >
              <ThemedText style={styles.continueButtonText}>Continue Claim</ThemedText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: Colors.light.tint,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  label: {
    fontSize: 14,
    color: Colors.light.textGray[400],
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.textGray[500],
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  notStartedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notStartedIcon: {
    marginBottom: 16,
  },
  notStartedTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  notStartedDescription: {
    fontSize: 14,
    color: Colors.light.textGray[400],
    textAlign: 'center',
    marginBottom: 20,
  },
  createClaimButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  createClaimButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  missingDataContainer: {
    backgroundColor: Colors.light.textGray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.textGray[200],
    borderStyle: 'dashed',
  },
  missingDataText: {
    color: Colors.light.textGray[400],
    fontStyle: 'italic',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addMoreTag: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  addMoreText: {
    fontSize: 12,
    color: Colors.light.tint,
  },
  inProgressActions: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
}); 