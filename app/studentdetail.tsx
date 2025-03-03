import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  Pressable, 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { students, appointments } from "@/assets/dummyData/appointments";
import { extendedStudentInfo, referrals, forms } from "@/assets/dummyData/appointments";
import FileUploadForms from "@/components/FileUploadForms";  // Add this with your other imports

// Types
interface Note {
  title: string;
  body: string;
  date: string;
  appointmentId: number | null;
}

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
  gender: string;
  mentalState: string;
  appointments: number[];
  parentConsent: boolean;
  studentConsent: boolean;
  totalAppointments: number;
}

interface Appointment {
  id: number;
  student: {
    id: number;
    name: string;
  };
  counselor: {
    id: number;
    name: string;
    specialization: string;
  };
  time: {
    date: string;
    time: string;
    location: string;
  };
  type: string;
  status: string;
  priority: string;
  notes: {
    title: string;
    body: string;
    date?: string;
  }[];
}

// Image imports
const boyImages = [
  require("@/assets/images/student-pp/boy1.jpg"),
  require("@/assets/images/student-pp/boy2.jpg"),
  require("@/assets/images/student-pp/boy3.jpg"),
  require("@/assets/images/student-pp/boy4.jpg"),
  require("@/assets/images/student-pp/boy5.jpg"),
];

const girlImages = [
  require("@/assets/images/student-pp/girl1.jpg"),
  require("@/assets/images/student-pp/girl2.jpg"),
  require("@/assets/images/student-pp/girl3.jpg"),
  require("@/assets/images/student-pp/girl4.jpg"),
  require("@/assets/images/student-pp/girl5.jpg"),
];

function getProfileImage(student: { id: number; gender: string }) {
  switch (student.id) {
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
}

const TABS = [
  { id: 'details', label: 'Details', icon: 'user' },
  { id: 'referrals', label: 'Referrals', icon: 'git-pull-request' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar' },
  { id: 'progress-notes', label: 'Progress Notes', icon: 'file-text' },
  { id: 'forms', label: 'Forms', icon: 'file' },
] as const;

type TabId = typeof TABS[number]['id'];

// Mental state colors
const getMentalStateColor = (state: string) => {
  switch (state.toLowerCase()) {
    case 'green': return Colors.light.success;
    case 'yellow': return Colors.light.warning;
    case 'orange': return Colors.light.orange[100];
    case 'red': return Colors.light.pink[100];
    default: return Colors.light.textGray[300];
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return Colors.light.pink[100];
    case 'medium': return Colors.light.orange[100];
    case 'low': return Colors.light.mint[100];
    default: return Colors.light.textGray[300];
  }
};

export default function StudentDetailScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Convert to a number
  const idNumber = studentId ? parseInt(studentId.toString(), 10) : NaN;
  const student = students.find((s) => s.id === idNumber);
  const studentAppointments = appointments.filter(
    (apt) => apt.student.id === idNumber
  );

  // Get all notes from appointments and sort by date
  const allNotes = studentAppointments.reduce((acc, apt) => {
    return [...acc, ...apt.notes.map(note => ({
      ...note,
      appointmentId: apt.id,
      date: note.date || apt.time.date
    }))];
  }, [] as Note[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [localNotes, setLocalNotes] = useState<Note[]>(allNotes);

  const handleAddNote = useCallback(async () => {
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newNoteObj: Note = {
        title: "Counselor Note",
        body: newNote,
        date: new Date().toISOString(),
        appointmentId: null,
      };

      setLocalNotes(prev => [newNoteObj, ...prev]);
      setNewNote('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add note. Please try again.');
    } finally {
      setIsAddingNote(false);
    }
  }, [newNote]);

  if (!student) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <ThemedText>No student found.</ThemedText>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  const profileImage = getProfileImage(student);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderOverviewTab = () => (
    <View>
      {/* Mental State Indicator */}
      <ThemedView variant="elevated" style={styles.mentalStateCard}>
        <ThemedText type="subtitle">Mental State</ThemedText>
        <View style={styles.mentalStateContainer}>
          <View style={[
            styles.mentalStateIndicator,
            { backgroundColor: getMentalStateColor(student.mentalState) }
          ]} />
          <ThemedText style={styles.mentalStateText}>
            {student.mentalState.toUpperCase()}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{student.totalAppointments}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Sessions</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>
            {student.parentConsent && student.studentConsent ? 'Yes' : 'No'}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Consent Status</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{student.grade}</ThemedText>
          <ThemedText style={styles.statLabel}>Grade Level</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{student.age}</ThemedText>
          <ThemedText style={styles.statLabel}>Age</ThemedText>
        </View>
      </View>

      {/* Personal Information */}
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Personal Information</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Student ID</ThemedText>
          <ThemedText style={styles.value}>{student.id}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Gender</ThemedText>
          <ThemedText style={styles.value}>{student.gender}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Grade Level</ThemedText>
          <ThemedText style={styles.value}>{student.grade}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Consent Status</ThemedText>
          <ThemedText style={styles.value}>
            {student.parentConsent && student.studentConsent ? 'Complete' : 'Incomplete'}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Recent Activity */}
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Recent Activity</ThemedText>
        {studentAppointments.slice(0, 3).map((apt) => (
          <View key={apt.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Feather 
                name={apt.status === 'completed' ? 'check-circle' : 'clock'} 
                size={20} 
                color={apt.status === 'completed' ? Colors.light.success : Colors.light.warning}
              />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>{apt.type}</ThemedText>
              <ThemedText style={styles.activityTime}>
                {formatDate(apt.time.date)} at {apt.time.time}
              </ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>
    </View>
  );

  const renderAppointmentsTab = () => (
    <View>
      {/* Upcoming Sessions */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Sessions</ThemedText>
      {studentAppointments
        .filter(apt => apt.status === 'pending')
        .map((appointment) => (
          <Pressable 
            key={appointment.id} 
            onPress={() => router.push({
              pathname: "/appointment-detail",
              params: { appointmentId: appointment.id }
            })}
          >
            <ThemedView variant="elevated" style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View>
                  <ThemedText type="subtitle">{appointment.type}</ThemedText>
                  <ThemedText style={styles.sessionTime}>
                    {formatDate(appointment.time.date)} at {formatTime(appointment.time.time)}
                  </ThemedText>
                </View>
                <ThemedView 
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(appointment.priority) }
                  ]}
                >
                  <ThemedText style={styles.priorityText}>
                    {appointment.priority.toUpperCase()}
                  </ThemedText>
                </ThemedView>
              </View>
              <View style={styles.sessionDetails}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Location</ThemedText>
                  <ThemedText style={styles.value}>{appointment.time.location}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Counselor</ThemedText>
                  <ThemedText style={styles.value}>{appointment.counselor.name}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Specialization</ThemedText>
                  <ThemedText style={styles.value}>{appointment.counselor.specialization}</ThemedText>
                </View>
              </View>
            </ThemedView>
          </Pressable>
        ))}
  
      {/* Past Sessions */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>
        Past Sessions
      </ThemedText>
      {studentAppointments
        .filter(apt => apt.status === 'completed')
        .map((appointment) => (
          <Pressable 
            key={appointment.id} 
            onPress={() => router.push({
              pathname: "/appointment-detail",
              params: { appointmentId: appointment.id }
            })}
          >
            <ThemedView variant="elevated" style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View>
                  <ThemedText type="subtitle">{appointment.type}</ThemedText>
                  <ThemedText style={styles.sessionTime}>
                    {formatDate(appointment.time.date)} at {formatTime(appointment.time.time)}
                  </ThemedText>
                </View>
                <ThemedView 
                  style={[styles.statusBadge, { backgroundColor: Colors.light.success }]}
                >
                  <ThemedText style={styles.statusText}>Completed</ThemedText>
                </ThemedView>
              </View>
              <View style={styles.sessionDetails}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Location</ThemedText>
                  <ThemedText style={styles.value}>{appointment.time.location}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Counselor</ThemedText>
                  <ThemedText style={styles.value}>{appointment.counselor.name}</ThemedText>
                </View>
                {appointment.notes.length > 0 && (
                  <View style={styles.sessionNotes}>
                    <ThemedText style={styles.label}>Session Notes</ThemedText>
                    {appointment.notes.map((note, index) => (
                      <ThemedText key={index} style={styles.sessionNote}>
                        {note.body}
                      </ThemedText>
                    ))}
                  </View>
                )}
              </View>
            </ThemedView>
          </Pressable>
        ))}
    </View>
  );

  const renderAttendanceTab = () => (
    <View>
      {/* Attendance Overview */}
      <ThemedView variant="elevated" style={styles.attendanceCard}>
        <View style={styles.attendanceHeader}>
          <ThemedText type="subtitle">Attendance Overview</ThemedText>
          <View style={styles.attendanceRate}>
            <ThemedText style={styles.attendancePercentage}>
              {Math.round((studentAppointments.filter(apt => apt.status === 'completed').length / 
                studentAppointments.length) * 100)}%
            </ThemedText>
            <ThemedText style={styles.attendanceLabel}>Attendance Rate</ThemedText>
          </View>
        </View>
        
        <View style={styles.attendanceStats}>
          <View style={styles.attendanceStatItem}>
            <ThemedText style={styles.statValue}>
              {studentAppointments.filter(apt => apt.status === 'completed').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Attended</ThemedText>
          </View>
          <View style={styles.attendanceStatItem}>
            <ThemedText style={styles.statValue}>
              {studentAppointments.filter(apt => apt.status === 'pending').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Upcoming</ThemedText>
          </View>
          <View style={styles.attendanceStatItem}>
            <ThemedText style={styles.statValue}>
              {studentAppointments.filter(apt => apt.status === 'missed').length || 0}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Missed</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Monthly Breakdown */}
      <ThemedView variant="elevated" style={styles.monthlyBreakdown}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Monthly Breakdown</ThemedText>
        <View style={styles.monthlyStats}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.monthItem}>
              <ThemedText style={styles.monthName}>
                {new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000)
                  .toLocaleString('default', { month: 'short' })}
              </ThemedText>
              <View style={styles.monthBar}>
                <View 
                  style={[
                    styles.monthBarFill, 
                    { width: `${90 - index * 10}%` }
                  ]} 
                />
              </View>
              <ThemedText style={styles.monthPercentage}>
                {90 - index * 10}%
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Session History */}
      <ThemedView variant="elevated" style={styles.sessionHistory}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Session History</ThemedText>
        {studentAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.historyItem}>
            <View style={styles.historyDate}>
              <ThemedText style={styles.historyDay}>
                {new Date(appointment.time.date).getDate()}
              </ThemedText>
              <ThemedText style={styles.historyMonth}>
                {new Date(appointment.time.date).toLocaleString('default', { month: 'short' })}
              </ThemedText>
            </View>
            <View style={styles.historyDetails}>
              <ThemedText style={styles.historyType}>{appointment.type}</ThemedText>
              <ThemedText style={styles.historyTime}>{appointment.time.time}</ThemedText>
            </View>
            <View 
              style={[
                styles.historyStatus,
                { backgroundColor: appointment.status === 'completed' ? 
                  Colors.light.success : Colors.light.warning }
              ]}
            />
          </View>
        ))}
      </ThemedView>
    </View>
  );
  
  const renderProgressNotesTab = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.notesContainer}
    >
      {/* Add Note */}
      <ThemedView variant="elevated" style={styles.addNoteCard}>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a new note..."
          placeholderTextColor={Colors.light.textGray[300]}
          value={newNote}
          onChangeText={setNewNote}
          multiline
          numberOfLines={4}
        />
        <Pressable 
          style={[
            styles.addNoteButton,
            !newNote.trim() && styles.addNoteButtonDisabled
          ]}
          onPress={handleAddNote}
          disabled={!newNote.trim() || isAddingNote}
        >
          {isAddingNote ? (
            <ActivityIndicator color={Colors.light.background} />
          ) : (
            <>
              <Feather name="plus" size={20} color={Colors.light.background} />
              <ThemedText style={styles.addNoteButtonText}>Add Note</ThemedText>
            </>
          )}
        </Pressable>
      </ThemedView>

      {/* Notes List */}
      <ScrollView>
        {localNotes.map((note, index) => (
          <ThemedView key={index} variant="elevated" style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <ThemedText type="subtitle">{note.title}</ThemedText>
              <ThemedText style={styles.noteDate}>
                {formatDate(note.date)}
              </ThemedText>
            </View>
            <ThemedText style={styles.noteBody}>{note.body}</ThemedText>
            {note.appointmentId && (
              <View style={styles.noteFooter}>
                <Feather name="paperclip" size={16} color={Colors.light.textGray[300]} />
                <ThemedText style={styles.noteAttachment}>
                  Attached to session on {formatDate(note.date)}
                </ThemedText>
              </View>
            )}
          </ThemedView>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderDetailsTab = () => (
    <View>
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Student Information</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>ID</ThemedText>
          <ThemedText style={styles.value}>{student.id}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Phone</ThemedText>
          <ThemedText style={styles.value}>{extendedStudentInfo[student.id].phone}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.value}>{extendedStudentInfo[student.id].email}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Date of Birth</ThemedText>
          <ThemedText style={styles.value}>
            {formatDate(extendedStudentInfo[student.id].dateOfBirth)} ({student.age})
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Grade</ThemedText>
          <ThemedText style={styles.value}>{student.grade}</ThemedText>
        </View>
      </ThemedView>
  
      <View style={styles.buttonContainer}>
      <Pressable 
              style={styles.actionButton} 
              onPress={() => router.push({
                pathname: "/appointment-create",
                params: { 
                  studentId: student.id,
                  studentName: student.name 
                }
              })}
            >
          <Feather name="calendar" size={20} color={Colors.light.background} />
          <ThemedText style={styles.actionButtonText}>Book Appointment</ThemedText>
        </Pressable>
        <Pressable 
  style={styles.actionButton} 
  onPress={() => router.push({
    pathname: "/create-referral",
    params: { 
      studentId: student.id,
      studentName: student.name 
    }
  })}
>
  <Feather name="file-plus" size={20} color={Colors.light.background} />
  <ThemedText style={styles.actionButtonText}>Create Referral</ThemedText>
</Pressable>
      </View>
  
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Upcoming Appointments</ThemedText>
        {studentAppointments
          .filter(apt => apt.status === 'pending')
          .map((apt) => (
            <View key={apt.id} style={styles.appointmentItem}>
              <View style={styles.appointmentHeader}>
                <ThemedText style={styles.appointmentType}>{apt.type}</ThemedText>
                <ThemedText style={styles.appointmentDate}>
                  {formatDate(apt.time.date)} at {formatTime(apt.time.time)}
                </ThemedText>
              </View>
              <ThemedText style={styles.appointmentCounselor}>
                with {apt.counselor.name}
              </ThemedText>
            </View>
          ))}
      </ThemedView>
    </View>
  );
  
  const renderReferralsTab = () => (
    <View>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Active Referrals</ThemedText>
      {referrals
        .filter(ref => ref.studentId === student.id && ref.status === 'Active')
        .map(ref => (
          <ThemedView key={ref.id} variant="elevated" style={styles.referralCard}>
            <View style={styles.referralHeader}>
              <ThemedText style={styles.referralType}>{ref.type}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: Colors.light.success }]}>
                <ThemedText style={styles.statusText}>{ref.status}</ThemedText>
              </View>
            </View>
            <View style={styles.referralDetails}>
              <ThemedText style={styles.referralText}>
                By: {ref.referrer.name} ({ref.referrer.role})
              </ThemedText>
              <ThemedText style={styles.referralDate}>Created: {formatDate(ref.createdDate)}</ThemedText>
              <ThemedText style={styles.referralComment}>{ref.comment}</ThemedText>
            </View>
          </ThemedView>
        ))}
  
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>
        Past Referrals
      </ThemedText>
      {referrals
        .filter(ref => ref.studentId === student.id && ref.status !== 'Active')
        .map(ref => (
          <ThemedView key={ref.id} variant="elevated" style={styles.referralCard}>
            <View style={styles.referralHeader}>
              <ThemedText style={styles.referralType}>{ref.type}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: Colors.light.textGray[300] }]}>
                <ThemedText style={styles.statusText}>{ref.status}</ThemedText>
              </View>
            </View>
            <View style={styles.referralDetails}>
              <ThemedText style={styles.referralText}>
                By: {ref.referrer.name} ({ref.referrer.role})
              </ThemedText>
              <ThemedText style={styles.referralDate}>Created: {formatDate(ref.createdDate)}</ThemedText>
              <ThemedText style={styles.referralComment}>{ref.comment}</ThemedText>
            </View>
          </ThemedView>
        ))}
    </View>
  );
  
  const renderFormsTab = () => (
    <View style={styles.tabContent}>
      <FileUploadForms 
        studentId={student.id}
        existingForms={forms}
      />
    </View>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsTab();
      case 'referrals':
        return renderReferralsTab();
      case 'appointments':
        return renderAppointmentsTab();
      case 'progress-notes':
        return renderProgressNotesTab();
      case 'forms':
        return renderFormsTab();
      default:
        return renderDetailsTab();
    }
  };

  if (!student) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <ThemedText>No student found.</ThemedText>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.background} />
        </Pressable>
        <View style={styles.headerContent}>
          {profileImage && (
            <Image source={profileImage} style={styles.headerProfileImage} />
          )}
          <ThemedText type="title" style={styles.headerTitle}>
            {student.name}
          </ThemedText>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Feather 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.id ? 
                Colors.light.green[200] : 
                Colors.light.textGray[300]
              } 
            />
            <ThemedText
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        ))}
        </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.green[200]} />
          </View>
        ) : (
          renderActiveTabContent()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.green[200],
    paddingTop: Platform.OS === 'ios' ? 20 : 8, 
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Colors.light.background,
  },
  headerTitle: {
    color: Colors.light.background,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.green[200],
  },
  tabText: {
    fontSize: 12,
    color: Colors.light.textGray[300],
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.light.green[200],
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  backButtonText: {
    color: Colors.light.green[200],
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  mentalStateCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  mentalStateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  mentalStateIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mentalStateText: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.textGray[500] + "10",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.light.green[100],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    marginBottom: 12,
    color: Colors.light.textGray[100],
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  label: {
    color: Colors.light.textGray[300],
    fontSize: 16,
  },
  value: {
    color: Colors.light.textGray[100],
    fontSize: 16,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  sectionTitle: {
    marginBottom: 16,
    color: Colors.light.textGray[100],
  },
  sessionCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sessionTime: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginTop: 4,
  },
  sessionDetails: {
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.textGray[100],
  },
  sessionNotes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.textGray[500] + "20",
  },
  sessionNote: {
    color: Colors.light.textGray[100],
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  attendanceCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  attendanceRate: {
    alignItems: 'center',
  },
  attendancePercentage: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.light.success,
  },
  attendanceLabel: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginTop: 4,
  },
  attendanceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  attendanceStatItem: {
    alignItems: "center",
  },
  monthlyBreakdown: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  monthlyStats: {
    marginTop: 16,
  },
  monthItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  monthName: {
    width: 50,
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  monthBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.textGray[500] + "20",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  monthBarFill: {
    height: "100%",
    backgroundColor: Colors.light.green[200],
    borderRadius: 4,
  },
  monthPercentage: {
    width: 40,
    fontSize: 14,
    color: Colors.light.textGray[100],
    textAlign: "right",
  },
  sessionHistory: {
    padding: 16,
    borderRadius: 12,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  historyDate: {
    width: 50,
    alignItems: "center",
  },
  historyDay: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.textGray[100],
  },
  historyMonth: {
    fontSize: 12,
    color: Colors.light.textGray[300],
  },
  historyDetails: {
    flex: 1,
    marginLeft: 16,
  },
  historyType: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  historyStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 16,
  },
  notesContainer: {
    flex: 1,
  },
  addNoteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  noteInput: {
    minHeight: 100,
    backgroundColor: Colors.light.textGray[500] + "10",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: Colors.light.textGray[100],
    fontSize: 16,
    textAlignVertical: "top",
  },
  addNoteButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addNoteButtonDisabled: {
    opacity: 0.5,
  },
  addNoteButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteDate: {
    color: Colors.light.textGray[300],
    fontSize: 14,
  },
  noteBody: {
    color: Colors.light.textGray[100],
    fontSize: 16,
    lineHeight: 24,
  },
  noteFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.textGray[500] + "20",
    gap: 8,
  },
  noteAttachment: {
    color: Colors.light.textGray[300],
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  backButtonText: {
    color: Colors.light.green[200],
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.green[200],
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: "600",
  },
  appointmentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    fontWeight: "500",
  },
  appointmentDate: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  appointmentCounselor: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  referralCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  referralType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.textGray[100],
  },
  referralDetails: {
    gap: 4,
  },
  referralText: {
    fontSize: 14,
    color: Colors.light.textGray[100],
  },
  referralDate: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  referralComment: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    marginTop: 8,
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.textGray[100],
  },
  formDetails: {
    gap: 4,
  },
  formText: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
});