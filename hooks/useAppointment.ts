import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '@/types/appointment';
import { appointments } from '@/assets/dummyData/appointments';
import { Alert } from 'react-native';

export function useAppointment(appointmentId: number | string) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert to a number if it's a string
  const idNumber = typeof appointmentId === 'string' 
    ? parseInt(appointmentId, 10) 
    : appointmentId;

  // Fetch appointment data
  useEffect(() => {
    if (isNaN(idNumber)) {
      return;
    }

    // In a real app, this would be an API call
    const foundAppointment = appointments.find((a) => a.id === idNumber);
    setAppointment(foundAppointment as Appointment || null);
  }, [idNumber]);

  // Function to update appointment status
  const updateAppointmentStatus = useCallback(async (status: string) => {
    if (!appointment) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setAppointment(prev => prev ? { ...prev, status } : null);
      
      Alert.alert('Success', 'Appointment status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment status');
    } finally {
      setIsLoading(false);
    }
  }, [appointment]);

  // Save appointment review
  const saveAppointmentReview = useCallback(async (
    attendance: string,
    sessionPurpose: string, 
    progressNote: string,
    noteTitle: string
  ) => {
    if (!appointment) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this data to your API
      console.log('Saving review with title:', noteTitle);
      
      // Update local state
      setAppointment(prev => prev ? { 
        ...prev, 
        attendance,
        sessionPurpose,
        progressNote,
        notes: [
          ...(prev.notes || []),
          { title: noteTitle, body: progressNote, date: new Date().toISOString() }
        ]
      } : null);
      
      Alert.alert(
        'Success', 
        'Review notes have been saved successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [appointment]);

  return {
    appointment,
    isLoading,
    updateAppointmentStatus,
    saveAppointmentReview
  };
} 