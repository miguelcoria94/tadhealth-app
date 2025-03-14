import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Dropdown } from '@/components/ui/Dropdown';
import { Appointment } from '@/types/appointment';

interface ReviewTabProps {
  appointment: Appointment;
  onSaveReview?: (attendance: string, sessionPurpose: string, progressNote: string, noteTitle: string) => Promise<void>;
}

export function ReviewTab({ appointment, onSaveReview }: ReviewTabProps) {
  const [attendance, setAttendance] = useState(appointment.attendance || 'present');
  const [sessionPurpose, setSessionPurpose] = useState(appointment.sessionPurpose || 'Ongoing');
  const [progressNote, setProgressNote] = useState(appointment.progressNote || '');
  const [noteTitle, setNoteTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveReview = async () => {
    if (!onSaveReview) return;
    
    setIsLoading(true);
    try {
      await onSaveReview(attendance, sessionPurpose, progressNote, noteTitle);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dropdown
        label="Attendance"
        value={attendance}
        options={['present', 'absent', 'late', 'excused']}
        onChange={setAttendance}
      />

      <Dropdown
        label="Session Purpose"
        value={sessionPurpose}
        options={['Initial Assessment', 'Ongoing', 'Crisis Intervention', 'Follow-up', 'Termination']}
        onChange={setSessionPurpose}
      />

      <ThemedView variant="elevated" style={styles.reviewCard}>
        <ThemedText type="subtitle">Note Title</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter a title for this note..."
          placeholderTextColor={Colors.light.textGray[300]}
          value={noteTitle}
          onChangeText={setNoteTitle}
        />
      </ThemedView>

      <ThemedView variant="elevated" style={styles.reviewCard}>
        <ThemedText type="subtitle">Progress Note</ThemedText>
        <TextInput
          style={styles.textArea}
          placeholder="Add progress notes for this session..."
          placeholderTextColor={Colors.light.textGray[300]}
          value={progressNote}
          onChangeText={setProgressNote}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </ThemedView>
      
      <Pressable 
        style={styles.saveButton}
        onPress={handleSaveReview}
        disabled={isLoading || !noteTitle.trim() || !progressNote.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.light.background} />
        ) : (
          <>
            <Feather name="save" size={20} color={Colors.light.background} />
            <ThemedText style={styles.buttonText}>Save Review</ThemedText>
          </>
        )}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
    marginTop: 12,
  },
  textArea: {
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    textAlignVertical: 'top',
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  saveButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
}); 