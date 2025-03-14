import React from 'react';
import { StyleSheet, View, Pressable, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Appointment } from '@/types/appointment';

// Image assets - these would typically be imported from your assets directly
const boyImages = [
  require('@/assets/images/student-pp/boy1.jpg'),
  require('@/assets/images/student-pp/boy2.jpg'),
  require('@/assets/images/student-pp/boy3.jpg'),
  require('@/assets/images/student-pp/boy4.jpg'),
  require('@/assets/images/student-pp/boy5.jpg'),
];

const girlImages = [
  require('@/assets/images/student-pp/girl1.jpg'),
  require('@/assets/images/student-pp/girl2.jpg'),
  require('@/assets/images/student-pp/girl3.jpg'),
  require('@/assets/images/student-pp/girl4.jpg'),
  require('@/assets/images/student-pp/girl5.jpg'),
];

interface AppointmentHeaderProps {
  appointment: Appointment;
  onBackPress: () => void;
}

export function AppointmentHeader({ appointment, onBackPress }: AppointmentHeaderProps) {
  // Get profile image based on student ID
  const getProfileImage = (id: number) => {
    switch (id) {
      case 101: return boyImages[0];
      case 102: return girlImages[0];
      case 103: return boyImages[1];
      case 104: return girlImages[1];
      case 105: return boyImages[2];
      case 106: return girlImages[2];
      case 107: return boyImages[3];
      case 108: return girlImages[3];
      case 109: return boyImages[4];
      case 110: return girlImages[4];
      default: return null;
    }
  };
  
  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={Colors.light.background} />
      </Pressable>
      <View style={styles.headerContent}>
        <View style={styles.headerProfileContainer}>
          {appointment.student && (
            <Image
              source={getProfileImage(appointment.student.id)}
              style={styles.headerProfileImage}
            />
          )}
        </View>
        <ThemedText type="title" style={styles.headerTitle}>
          {appointment.student.name}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light.green[200],
    paddingTop: Platform.OS === 'ios' ? 20 : 8, 
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 5,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  headerTitle: {
    color: Colors.light.background,
    textAlign: "center",
  },
}); 