import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { InfoCard, InfoRow } from '@/components/ui/InfoCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/Colors';
import { Appointment } from '@/types/appointment';
import { formatDate } from '@/utils/formatters';

interface DetailsTabProps {
  appointment: Appointment;
}

export function DetailsTab({ appointment }: DetailsTabProps) {
  return (
    <>
      <InfoCard title="Appointment Information">
        <InfoRow label="Type">
          <ThemedText style={styles.value}>{appointment.type}</ThemedText>
        </InfoRow>
        <InfoRow label="Date">
          <ThemedText style={styles.value}>
            {formatDate(appointment.time.date)}
          </ThemedText>
        </InfoRow>
        <InfoRow label="Time">
          <ThemedText style={styles.value}>{appointment.time.time}</ThemedText>
        </InfoRow>
        <InfoRow label="Location">
          <ThemedText style={styles.value}>{appointment.time.location}</ThemedText>
        </InfoRow>
        <InfoRow label="Status">
          <StatusBadge status={appointment.status} type="status" />
        </InfoRow>
        <InfoRow label="Priority">
          <StatusBadge status={appointment.priority} type="priority" />
        </InfoRow>
      </InfoCard>

      <InfoCard title="Student Information">
        <InfoRow label="Name">
          <ThemedText style={styles.value}>{appointment.student.name}</ThemedText>
        </InfoRow>
        <InfoRow label="ID">
          <ThemedText style={styles.value}>{appointment.student.id}</ThemedText>
        </InfoRow>
      </InfoCard>

      <InfoCard title="Professional Information">
        <InfoRow label="Name">
          <ThemedText style={styles.value}>{appointment.counselor.name}</ThemedText>
        </InfoRow>
        <InfoRow label="Specialization">
          <ThemedText style={styles.value}>{appointment.counselor.specialization}</ThemedText>
        </InfoRow>
      </InfoCard>

      {appointment.notes && appointment.notes.length > 0 && (
        <InfoCard title="Notes">
          {appointment.notes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <ThemedText style={styles.noteTitle}>{note.title}</ThemedText>
              <ThemedText style={styles.noteBody}>{note.body}</ThemedText>
            </View>
          ))}
        </InfoCard>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.textGray[100],
  },
  noteItem: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.textGray[500] + "20",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  noteBody: {
    color: Colors.light.textGray[100],
    fontSize: 14,
    lineHeight: 20,
  },
}); 