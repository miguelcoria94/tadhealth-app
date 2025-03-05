import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  Pressable, 
  View, 
  StyleSheet, 
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
import { appointments } from "@/assets/dummyData/appointments";
import { extendedStudentInfo, referrals, forms } from "@/assets/dummyData/appointments";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// Types
interface Activity {
  author: string;
  comment: string;
  timestamp: string;
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
    endTime?: string;
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
  activity?: Activity[];
  attendance?: string;
  sessionPurpose?: string;
  progressNote?: string;
  referenceNo?: string;
  billingStatus?: string;
  billingSubmissionDate?: string;
}

const TABS = [
  { id: 'details', label: 'Details', icon: 'info' },
  { id: 'activity', label: 'Activity', icon: 'message-square' },
  { id: 'forms', label: 'Forms', icon: 'file-text' },
  { id: 'referrals', label: 'Referrals', icon: 'git-pull-request' },
  { id: 'review', label: 'Review', icon: 'check-square' },
  { id: 'billing', label: 'Billing', icon: 'dollar-sign' },
] as const;

type TabId = typeof TABS[number]['id'];

// Priority and status colors
const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return Colors.light.pink[100];
    case 'medium': return Colors.light.orange[100];
    case 'low': return Colors.light.mint[100];
    default: return Colors.light.textGray[300];
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return Colors.light.success;
    case 'pending': return Colors.light.warning;
    case 'missed': return Colors.light.pink[100];
    default: return Colors.light.textGray[300];
  }
};

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  
  // For the Review tab
  const [attendance, setAttendance] = useState('present');
  const [showAttendanceDropdown, setShowAttendanceDropdown] = useState(false);
  const [sessionPurpose, setSessionPurpose] = useState('Ongoing');
  const [showSessionPurposeDropdown, setShowSessionPurposeDropdown] = useState(false);
  const [progressNote, setProgressNote] = useState('');

  // Convert to a number
  const idNumber = appointmentId ? parseInt(appointmentId.toString(), 10) : NaN;
  
  // Find the appointment
  const appointment = appointments.find((a) => a.id === idNumber);
  
  // Get relevant student info
  const student = appointment ? extendedStudentInfo[appointment.student.id] : null;
  
  // Get relevant forms for this appointment/student
  const relevantForms = forms.filter(form => form.studentId === appointment?.student.id);
  
  // Get relevant referrals for this appointment/student
  const relevantReferrals = referrals.filter(ref => ref.studentId === appointment?.student.id);

  // Local state for activities/comments
  const [activities, setActivities] = useState<Activity[]>(
    appointment?.activity || []
  );

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newActivity: Activity = {
        author: "Dr. Sarah Wilson",  // This would come from auth context
        comment: newComment,
        timestamp: new Date().toISOString()
      };

      setActivities(prev => [newActivity, ...prev]);
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsAddingComment(false);
    }
  }, [newComment]);

  const handleSaveReview = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
  }, [attendance, sessionPurpose, progressNote]);

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

  if (!appointment) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <ThemedText>No appointment found.</ThemedText>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  const renderActivityTab = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.tabContent}
    >
      {/* Add Comment */}
      <ThemedView variant="elevated" style={styles.addCommentCard}>
        <ThemedText type="subtitle">Add Comment</ThemedText>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.light.textGray[300]}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={4}
        />
        <Pressable 
          style={[
            styles.saveButton,
            !newComment.trim() && styles.disabledButton
          ]}
          onPress={handleAddComment}
          disabled={!newComment.trim() || isAddingComment}
        >
          {isAddingComment ? (
            <ActivityIndicator color={Colors.light.background} />
          ) : (
            <>
              <Feather name="save" size={20} color={Colors.light.background} />
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </>
          )}
        </Pressable>
      </ThemedView>

      {/* Activity/Comments List */}
      <ScrollView>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ThemedView key={index} variant="elevated" style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <ThemedText type="subtitle">{activity.author}</ThemedText>
                <ThemedText style={styles.activityDate}>
                  {formatDate(activity.timestamp)} {new Date(activity.timestamp).toLocaleTimeString()}
                </ThemedText>
              </View>
              <ThemedText style={styles.activityComment}>{activity.comment}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedView variant="elevated" style={styles.emptyStateCard}>
            <ThemedText style={styles.emptyStateText}>No activity recorded yet.</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderFormsTab = () => (
    <View style={styles.tabContent}>
      {relevantForms.length > 0 ? (
        relevantForms.map((form, index) => (
          <ThemedView key={index} variant="elevated" style={styles.formCard}>
            <View style={styles.formHeader}>
              <ThemedText type="subtitle">{form.name}</ThemedText>
              <View style={styles.badgeContainer}>
                <ThemedView 
                  style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: form.status === 'Complete' 
                        ? Colors.light.success 
                        : Colors.light.warning
                    }
                  ]}
                >
                  <ThemedText style={styles.statusBadgeText}>{form.status}</ThemedText>
                </ThemedView>
              </View>
            </View>
            <View style={styles.formDetails}>
              <ThemedText style={styles.formText}>Uploaded: {formatDate(form.uploadDate)}</ThemedText>
              <ThemedText style={styles.formText}>Type: {form.type}</ThemedText>
              {form.description && (
                <ThemedText style={styles.formDescription}>{form.description}</ThemedText>
              )}
            </View>
            <Pressable style={styles.formActionButton}>
              <Feather name="eye" size={20} color={Colors.light.background} />
              <ThemedText style={styles.buttonText}>View Form</ThemedText>
            </Pressable>
          </ThemedView>
        ))
      ) : (
        <ThemedView variant="elevated" style={styles.emptyStateCard}>
          <ThemedText style={styles.emptyStateText}>No forms found for this appointment.</ThemedText>
          <Pressable style={styles.actionButton}>
            <Feather name="share" size={20} color={Colors.light.background} />
            <ThemedText style={styles.buttonText}>Share Form</ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </View>
  );

  const renderReferralsTab = () => (
    <View style={styles.tabContent}>
      {relevantReferrals.length > 0 ? (
        relevantReferrals.map((referral, index) => (
          <ThemedView key={index} variant="elevated" style={styles.referralCard}>
            <View style={styles.referralHeader}>
              <ThemedText type="subtitle">{referral.type}</ThemedText>
              <View style={styles.badgeContainer}>
                <ThemedView 
                  style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: referral.status === 'Active' 
                        ? Colors.light.success 
                        : Colors.light.textGray[300] 
                    }
                  ]}
                >
                  <ThemedText style={styles.statusBadgeText}>{referral.status}</ThemedText>
                </ThemedView>
              </View>
            </View>
            <View style={styles.referralDetails}>
              <ThemedText style={styles.referralText}>
                By: {referral.referrer.name} ({referral.referrer.role})
              </ThemedText>
              <ThemedText style={styles.referralDate}>Created: {formatDate(referral.createdDate)}</ThemedText>
              <ThemedText style={styles.referralComment}>{referral.comment}</ThemedText>
            </View>
          </ThemedView>
        ))
      ) : (
        <ThemedView variant="elevated" style={styles.emptyStateCard}>
          <ThemedText style={styles.emptyStateText}>No referrals found for this appointment.</ThemedText>
          <Pressable style={styles.actionButton}>
            <Feather name="link" size={20} color={Colors.light.background} />
            <ThemedText style={styles.buttonText}>Attach Referral</ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </View>
  );

  const renderReviewTab = () => (
    <View style={styles.tabContent}>
      <ThemedView variant="elevated" style={styles.reviewCard}>
        <ThemedText type="subtitle">Attendance</ThemedText>
        <Pressable 
          style={styles.dropdownButton}
          onPress={() => setShowAttendanceDropdown(!showAttendanceDropdown)}
        >
          <ThemedText style={styles.dropdownButtonText}>
            {attendance.charAt(0).toUpperCase() + attendance.slice(1)}
          </ThemedText>
          <Feather 
            name={showAttendanceDropdown ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.light.textGray[300]} 
          />
        </Pressable>
        {showAttendanceDropdown && (
          <View style={styles.dropdownContent}>
            {['present', 'absent', 'late', 'excused'].map((option) => (
              <Pressable
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  setAttendance(option);
                  setShowAttendanceDropdown(false);
                }}
              >
                <ThemedText style={styles.dropdownItemText}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}
      </ThemedView>

      <ThemedView variant="elevated" style={styles.reviewCard}>
        <ThemedText type="subtitle">Session Purpose</ThemedText>
        <Pressable 
          style={styles.dropdownButton}
          onPress={() => setShowSessionPurposeDropdown(!showSessionPurposeDropdown)}
        >
          <ThemedText style={styles.dropdownButtonText}>
            {sessionPurpose}
          </ThemedText>
          <Feather 
            name={showSessionPurposeDropdown ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.light.textGray[300]} 
          />
        </Pressable>
        {showSessionPurposeDropdown && (
          <View style={styles.dropdownContent}>
            {['Initial Assessment', 'Ongoing', 'Crisis Intervention', 'Follow-up', 'Termination'].map((option) => (
              <Pressable
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  setSessionPurpose(option);
                  setShowSessionPurposeDropdown(false);
                }}
              >
                <ThemedText style={styles.dropdownItemText}>{option}</ThemedText>
              </Pressable>
            ))}
          </View>
        )}
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
        disabled={isLoading}
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
    </View>
  );

  const renderBillingTab = () => (
    <View style={styles.tabContent}>
      {appointment.billingStatus ? (
        <ThemedView variant="elevated" style={styles.billingCard}>
          <View style={styles.billingHeader}>
            <ThemedText type="subtitle">Billing Information</ThemedText>
            <View style={styles.badgeContainer}>
              <ThemedView 
                style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: appointment.billingStatus === 'Submitted' 
                      ? Colors.light.success 
                      : Colors.light.warning 
                  }
                ]}
              >
                <ThemedText style={styles.statusBadgeText}>{appointment.billingStatus}</ThemedText>
              </ThemedView>
            </View>
          </View>
          <View style={styles.billingDetails}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>Reference No.</ThemedText>
              <ThemedText style={styles.value}>{appointment.referenceNo || 'IS9JY12345'}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>Submission Date</ThemedText>
              <ThemedText style={styles.value}>
                {appointment.billingSubmissionDate || '02/24/2025 at 8:40 AM'}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>Appointment</ThemedText>
              <ThemedText style={styles.value}>
                {formatDate(appointment.time.date)} at {appointment.time.time}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      ) : (
        <ThemedView variant="elevated" style={styles.emptyStateCard}>
          <ThemedText style={styles.emptyStateText}>No billing information found for this appointment.</ThemedText>
          <Pressable style={styles.actionButton}>
            <Feather name="file-plus" size={20} color={Colors.light.background} />
            <ThemedText style={styles.buttonText}>Create Claim</ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </View>
  );

  const renderDetailsTab = () => (
    <>
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Appointment Information</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Type</ThemedText>
          <ThemedText style={styles.value}>{appointment.type}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Date</ThemedText>
          <ThemedText style={styles.value}>{formatDate(appointment.time.date)}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Time</ThemedText>
          <ThemedText style={styles.value}>{appointment.time.time}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Location</ThemedText>
          <ThemedText style={styles.value}>{appointment.time.location}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Status</ThemedText>
          <ThemedText 
            style={[
              styles.statusValue,
              { color: getStatusColor(appointment.status) }
            ]}
          >
            {appointment.status.toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Priority</ThemedText>
          <ThemedText 
            style={[
              styles.priorityValue,
              { color: getPriorityColor(appointment.priority) }
            ]}
          >
            {appointment.priority.toUpperCase()}
          </ThemedText>
        </View>
      </ThemedView>
  
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Student Information</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <ThemedText style={styles.value}>{appointment.student.name}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>ID</ThemedText>
          <ThemedText style={styles.value}>{appointment.student.id}</ThemedText>
        </View>
      </ThemedView>
  
      <ThemedView variant="elevated" style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Professional Information</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <ThemedText style={styles.value}>{appointment.counselor.name}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Specialization</ThemedText>
          <ThemedText style={styles.value}>{appointment.counselor.specialization}</ThemedText>
        </View>
      </ThemedView>
  
      {appointment.notes && appointment.notes.length > 0 && (
        <ThemedView variant="elevated" style={styles.infoCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Notes</ThemedText>
          {appointment.notes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <ThemedText style={styles.noteTitle}>{note.title}</ThemedText>
              <ThemedText style={styles.noteBody}>{note.body}</ThemedText>
            </View>
          ))}
        </ThemedView>
      )}
    </>
  );
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsTab();
      case 'activity':
        return renderActivityTab();
      case 'forms':
        return renderFormsTab();
      case 'referrals':
        return renderReferralsTab();
      case 'review':
        return renderReviewTab();
      case 'billing':
        return renderBillingTab();
      default:
        return renderDetailsTab();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.background} />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Appointment Details
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {appointment.student.name} - {appointment.type}
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
  headerTitle: {
    color: Colors.light.background,
    textAlign: "center",
  },
  headerSubtitle: {
    color: Colors.light.background,
    opacity: 0.9,
    fontSize: 16,
    marginTop: 4,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    marginTop: 4,
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
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500] + '20',
  },
  infoDetails: {
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.textGray[100],
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
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
  tabContentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  tabContent: {
    flex: 1,
    padding: 16,
    gap: 16,
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
  addCommentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginVertical: 12,
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
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.light.textGray[300],
  },
  activityComment: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    lineHeight: 22,
  },
  emptyStateCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyStateText: {
    color: Colors.light.textGray[300],
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 180,
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
    flexWrap: 'wrap',
  },
  statusText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
  },
  formDetails: {
    marginBottom: 16,
    gap: 4,
  },
  formText: {
    color: Colors.light.textGray[300],
    fontSize: 14,
  },
  formDescription: {
    color: Colors.light.textGray[100],
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  formActionButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
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
    lineHeight: 20,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
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
  billingCard: {
    padding: 16,
    borderRadius: 12,
  },
  billingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  billingDetails: {
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 12,
    color: Colors.light.textGray[100],
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
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
  priorityValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    maxWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  billingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
});