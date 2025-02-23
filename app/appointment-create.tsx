import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants from your appointment data
const COUNSELORS = [
  {
    id: 201,
    name: "Dr. Smith",
    specialization: "Mental Health",
  },
  {
    id: 202,
    name: "Ms. Johnson",
    specialization: "Career Counseling",
  },
  {
    id: 203,
    name: "Mr. Thompson",
    specialization: "Mental Health",
  },
  {
    id: 204,
    name: "Mrs. Davis",
    specialization: "Academic Counseling",
  },
  {
    id: 205,
    name: "Mr. Peterson",
    specialization: "Mental Health",
  },
  {
    id: 206,
    name: "Ms. Lee",
    specialization: "Career Counseling",
  },
];

const ROOMS = [
  'Room 101, School Building A',
  'Room 103, School Building A',
  'Room 209, School Building A',
  'Room 305, School Building A',
  'Room 402, School Building B',
  'Room 405, School Building B',
  'Room 101, School Building C',
  'Room 502, School Building C',
  'Room 204, School Building D',
  'Room 307, School Building E',
  'Room 305, School Building F',
];

const APPOINTMENT_TYPES = [
  'Mental Health',
  'Career Counseling',
  'Academic Counseling',
];

const PRIORITY_LEVELS = [
  'low',
  'medium', 
  'high'
];

export default function AppointmentCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const studentId = params.studentId;
  const studentName = params.studentName;

  // Form state
  const [selectedStudent, setSelectedStudent] = useState(studentName || '');
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [showCounselorDropdown, setShowCounselorDropdown] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [comments, setComments] = useState('');

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!selectedStudent || !selectedCounselor || !selectedRoom || !selectedType) {
        alert('Please fill in all required fields');
        return;
      }

      // Create appointment object
      const newAppointment = {
        id: Date.now(), // Simple way to generate unique ID
        student: {
          id: studentId || null,
          name: selectedStudent,
        },
        counselor: COUNSELORS.find(c => c.name === selectedCounselor) || {
          name: selectedCounselor,
          specialization: selectedType,
        },
        time: {
          date: date.toISOString().split('T')[0],
          time: startTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          endTime: endTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          location: selectedRoom,
        },
        type: selectedType,
        status: 'pending',
        priority: selectedPriority,
        notes: comments ? [{
          title: 'Initial Notes',
          body: comments,
          date: new Date().toISOString()
        }] : [],
      };

      // Get existing appointments
      const existingAppointments = await AsyncStorage.getItem('appointments');
      const appointments = existingAppointments ? JSON.parse(existingAppointments) : [];
      
      // Add new appointment
      appointments.push(newAppointment);
      
      // Save back to storage
      await AsyncStorage.setItem('appointments', JSON.stringify(appointments));

      // Navigate back
      router.back();
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Failed to save appointment');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.background} />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            New Appointment
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        {/* Student Selection */}
        <ThemedView variant="elevated" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Student Information
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

        {/* Counselor Selection */}
        <ThemedView variant="elevated" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Counselor
          </ThemedText>
          <Pressable 
            style={styles.dropdownButton}
            onPress={() => setShowCounselorDropdown(!showCounselorDropdown)}
          >
            <ThemedText style={styles.dropdownButtonText}>
              {selectedCounselor || 'Select Counselor'}
            </ThemedText>
            <Feather 
              name={showCounselorDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.light.textGray[300]} 
            />
          </Pressable>
          {showCounselorDropdown && (
            <View style={styles.dropdownContent}>
              {COUNSELORS.map((counselor) => (
                <Pressable
                  key={counselor.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCounselor(counselor.name);
                    setShowCounselorDropdown(false);
                  }}
                >
                  <ThemedText style={styles.dropdownItemText}>
                    {counselor.name} - {counselor.specialization}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </ThemedView>

        {/* Appointment Type */}
        <ThemedView variant="elevated" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Appointment Type
          </ThemedText>
          <Pressable 
            style={styles.dropdownButton}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            <ThemedText style={styles.dropdownButtonText}>
              {selectedType || 'Select Type'}
            </ThemedText>
            <Feather 
              name={showTypeDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.light.textGray[300]} 
            />
          </Pressable>
          {showTypeDropdown && (
            <View style={styles.dropdownContent}>
              {APPOINTMENT_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}
                >
                  <ThemedText style={styles.dropdownItemText}>{type}</ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </ThemedView>

        {/* Location Selection */}
        <ThemedView variant="elevated" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Location
          </ThemedText>
          <Pressable 
            style={styles.dropdownButton}
            onPress={() => setShowRoomDropdown(!showRoomDropdown)}
          >
            <ThemedText style={styles.dropdownButtonText}>
              {selectedRoom || 'Select Room'}
            </ThemedText>
            <Feather 
              name={showRoomDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.light.textGray[300]} 
            />
          </Pressable>
          {showRoomDropdown && (
            <View style={styles.dropdownContent}>
              {ROOMS.map((room) => (
                <Pressable
                  key={room}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedRoom(room);
                    setShowRoomDropdown(false);
                  }}
                >
                  <ThemedText style={styles.dropdownItemText}>{room}</ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </ThemedView>

        {/* Priority Selection */}
        <ThemedView variant="elevated" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Priority Level
          </ThemedText>
          <Pressable 
            style={styles.dropdownButton}
            onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
          >
            <ThemedText style={styles.dropdownButtonText}>
              {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
            </ThemedText>
            <Feather 
              name={showPriorityDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.light.textGray[300]} 
            />
          </Pressable>
          {showPriorityDropdown && (
            <View style={styles.dropdownContent}>
              {PRIORITY_LEVELS.map((priority) => (
                <Pressable
                  key={priority}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedPriority(priority);
                    setShowPriorityDropdown(false);
                  }}
                >
                  <ThemedText style={styles.dropdownItemText}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </ThemedView>

        {/* Date and Time Selection */}
        <ThemedView variant="elevated" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Date & Time
          </ThemedText>
          
          {/* Date Selection */}
          <Pressable 
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={20} color={Colors.light.textGray[300]} />
            <ThemedText style={styles.dateTimeButtonText}>
              {formatDate(date)}
            </ThemedText>
          </Pressable>

          {/* Start Time Selection */}
          <Pressable 
            style={styles.dateTimeButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Feather name="clock" size={20} color={Colors.light.textGray[300]} />
            <ThemedText style={styles.dateTimeButtonText}>
              Start: {formatTime(startTime)}
            </ThemedText>
          </Pressable>

          {/* End Time Selection */}
          <Pressable 
            style={styles.dateTimeButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Feather name="clock" size={20} color={Colors.light.textGray[300]} />
            <ThemedText style={styles.dateTimeButtonText}>
              End: {formatTime(endTime)}
            </ThemedText>
          </Pressable>

          {/* Date/Time Pickers */}
          {(showDatePicker || showStartTimePicker || showEndTimePicker) && (
            <DateTimePicker
              value={showDatePicker ? date : (showStartTimePicker ? startTime : endTime)}
              mode={showDatePicker ? 'date' : 'time'}
              is24Hour={false}
              onChange={(event, selectedDate) => {
                if (showDatePicker) {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                } else if (showStartTimePicker) {
                  setShowStartTimePicker(false);
                  if (selectedDate) setStartTime(selectedDate);
                } else {
                  setShowEndTimePicker(false);
                  if (selectedDate) setEndTime(selectedDate);
                }
              }}
            />
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
            onChangeText={setComments}
            placeholder="Add any comments or notes..."
            placeholderTextColor={Colors.light.textGray[300]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>

        {/* Save Button */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Create Appointment</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  saveButton: {
    backgroundColor: Colors.light.green[200],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});