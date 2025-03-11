import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

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
  "Room 101, School Building A",
  "Room 103, School Building A",
  "Room 209, School Building A",
  "Room 305, School Building A",
  "Room 402, School Building B",
  "Room 405, School Building B",
  "Room 101, School Building C",
  "Room 502, School Building C",
  "Room 204, School Building D",
  "Room 307, School Building E",
  "Room 305, School Building F",
];

const APPOINTMENT_TYPES = [
  "Mental Health",
  "Career Counseling",
  "Academic Counseling",
];

const PRIORITY_LEVELS = ["low", "medium", "high"];

export default function AppointmentCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userToken } = useAuth(); // Changed from { user } to { userToken } to match AuthContextProps
  const studentId = params.studentId;
  const studentName = params.studentName;

  // Form state
  const [selectedStudent, setSelectedStudent] = useState(
    typeof studentName === "string"
      ? studentName
      : Array.isArray(studentName)
      ? studentName[0]
      : ""
  );
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [showCounselorDropdown, setShowCounselorDropdown] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [comments, setComments] = useState("");
  const [postSessionLog, setPostSessionLog] = useState("");
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // For development/testing purposes, you can toggle this to true to see post-session UI
  // In production, this would be determined by comparing session date/time with current time
  const [showPostSessionUI, setShowPostSessionUI] = useState(false);

  // Set default counselor based on logged-in user
  useEffect(() => {
    // This is a placeholder - in a real app, you would get the user's name from the auth context
    // Assuming the logged-in professional is in the COUNSELORS array
    const currentUser = COUNSELORS.find((c) => c.id === 201); // Replace with actual user ID
    if (currentUser) {
      setSelectedCounselor(currentUser.name);
    }
  }, []);

  // Check if session is complete (past date/time)
  useEffect(() => {
    const checkSessionStatus = () => {
      const sessionDateTime = new Date(date);
      const sessionStartTime = new Date(startTime);

      sessionDateTime.setHours(
        sessionStartTime.getHours(),
        sessionStartTime.getMinutes()
      );

      const now = new Date();

      // Session is in the past
      if (sessionDateTime < now) {
        setShowPostSessionUI(true);
      } else {
        setShowPostSessionUI(false);
      }
    };

    checkSessionStatus();
    // Set up an interval to check every minute
    const interval = setInterval(checkSessionStatus, 60000);

    return () => clearInterval(interval);
  }, [date, startTime]);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (
        !selectedStudent ||
        !selectedCounselor ||
        !selectedRoom ||
        !selectedType
      ) {
        Alert.alert("Please fill in all required fields");
        return;
      }

      // Create appointment object
      const newAppointment = {
        id: Date.now(), // Simple way to generate unique ID
        student: {
          id: studentId || null,
          name: selectedStudent,
        },
        counselor: COUNSELORS.find((c) => c.name === selectedCounselor) || {
          name: selectedCounselor,
          specialization: selectedType,
        },
        time: {
          date: date.toISOString().split("T")[0],
          time: startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          endTime: endTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          location: selectedRoom,
        },
        type: selectedType,
        status: "pending",
        priority: selectedPriority,
        notes: comments
          ? [
              {
                title: "Initial Notes",
                body: comments,
                date: new Date().toISOString(),
              },
            ]
          : [],
        postSessionLog: postSessionLog || "",
        isClaimReady: showPostSessionUI && postSessionLog ? true : false,
      };

      // Get existing appointments
      const existingAppointments = await AsyncStorage.getItem("appointments");
      const appointments = existingAppointments
        ? JSON.parse(existingAppointments)
        : [];

      // Add new appointment
      appointments.push(newAppointment);

      // Save back to storage
      await AsyncStorage.setItem("appointments", JSON.stringify(appointments));

      Alert.alert("Success", "Appointment scheduled successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving appointment:", error);
      Alert.alert("Failed to save appointment");
    }
  };

  const handleStartClaim = () => {
    // Validate claim requirements
    if (!selectedStudent) {
      Alert.alert("Cannot start claim", "Please select a student");
      return;
    }

    if (!showPostSessionUI) {
      Alert.alert(
        "Cannot start claim",
        "Claims can only be submitted after the session is complete"
      );
      return;
    }

    if (!postSessionLog) {
      Alert.alert(
        "Cannot start claim",
        "Please complete the post-session log before submitting a claim"
      );
      return;
    }

    // Navigate to claims screen with appointment data
    Alert.alert("Success", "Redirecting to claims submission...");
    // router.push({ pathname: "/claims-create", params: { appointmentId: Date.now() } });
    // For now, just go back
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather
              name="arrow-left"
              size={24}
              color={Colors.light.textGray[100]}
            />
          </Pressable>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.headerTitle}>
              Session Details
            </ThemedText>
            <View style={styles.headerAccent} />
          </View>
        </View>

        <View style={styles.content}>
          {/* Student Selection */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Student (S)
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
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Professional (P)
            </ThemedText>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowCounselorDropdown(!showCounselorDropdown)}
            >
              <ThemedText style={styles.dropdownButtonText}>
                {selectedCounselor || "Select Professional"}
              </ThemedText>
              <Feather
                name={showCounselorDropdown ? "chevron-up" : "chevron-down"}
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
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Appointment Type
            </ThemedText>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <ThemedText style={styles.dropdownButtonText}>
                {selectedType || "Select Type"}
              </ThemedText>
              <Feather
                name={showTypeDropdown ? "chevron-up" : "chevron-down"}
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
                    <ThemedText style={styles.dropdownItemText}>
                      {type}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </ThemedView>

          {/* Location Selection */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Location
            </ThemedText>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowRoomDropdown(!showRoomDropdown)}
            >
              <ThemedText style={styles.dropdownButtonText}>
                {selectedRoom || "Select Room"}
              </ThemedText>
              <Feather
                name={showRoomDropdown ? "chevron-up" : "chevron-down"}
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
                    <ThemedText style={styles.dropdownItemText}>
                      {room}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </ThemedView>

          {/* Priority Selection */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Priority Level
            </ThemedText>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
            >
              <ThemedText style={styles.dropdownButtonText}>
                {selectedPriority.charAt(0).toUpperCase() +
                  selectedPriority.slice(1)}
              </ThemedText>
              <Feather
                name={showPriorityDropdown ? "chevron-up" : "chevron-down"}
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

          {/* Date & Time Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Date & Time
            </ThemedText>

            {/* Date & Time Section */}
            <View style={styles.dateTimeContainer}>
              {/* Date Selection */}
              <Pressable
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateTimeIconContainer}>
                  <Feather
                    name="calendar"
                    size={20}
                    color={Colors.light.green[200]}
                  />
                </View>
                <View style={styles.dateTimeTextContainer}>
                  <ThemedText style={styles.dateTimeLabel}>Date</ThemedText>
                  <ThemedText style={styles.dateTimeValue}>
                    {formatDate(date)}
                  </ThemedText>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={Colors.light.textGray[300]}
                />
              </Pressable>

              <View style={styles.timeContainer}>
                {/* Start Time Selection */}
                <Pressable
                  style={styles.timeButton}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <View style={styles.dateTimeIconContainer}>
                    <Feather
                      name="clock"
                      size={20}
                      color={Colors.light.green[200]}
                    />
                  </View>
                  <View style={styles.dateTimeTextContainer}>
                    <ThemedText style={styles.dateTimeLabel}>Start</ThemedText>
                    <ThemedText style={styles.dateTimeValue}>
                      {formatTime(startTime)}
                    </ThemedText>
                  </View>
                </Pressable>

                {/* End Time Selection */}
                <Pressable
                  style={styles.timeButton}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <View style={styles.dateTimeIconContainer}>
                    <Feather
                      name="clock"
                      size={20}
                      color={Colors.light.green[200]}
                    />
                  </View>
                  <View style={styles.dateTimeTextContainer}>
                    <ThemedText style={styles.dateTimeLabel}>End</ThemedText>
                    <ThemedText style={styles.dateTimeValue}>
                      {formatTime(endTime)}
                    </ThemedText>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Date/Time Pickers */}
            {(showDatePicker || showStartTimePicker || showEndTimePicker) && (
              <DateTimePicker
                value={
                  showDatePicker
                    ? date
                    : showStartTimePicker
                    ? startTime
                    : endTime
                }
                mode={showDatePicker ? "date" : "time"}
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
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Comments
            </ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={comments}
              onChangeText={setComments}
              placeholder="Add any pre-session notes or comments..."
              placeholderTextColor={Colors.light.textGray[300]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </ThemedView>

          {/* Post-Session Log Section - Only shown after session date/time has passed */}
          {showPostSessionUI && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Post-Session Log
              </ThemedText>
              <ThemedText style={styles.infoText}>
                This session has completed. Please fill in the post-session log
                to enable claim submission.
              </ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={postSessionLog}
                onChangeText={setPostSessionLog}
                placeholder="Enter details about the completed session..."
                placeholderTextColor={Colors.light.textGray[300]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </ThemedView>
          )}

          {/* Claim Section - Only shown after session completion */}
          {showPostSessionUI && (
            <ThemedView style={[styles.section, styles.claimSection]}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Ready to Submit a Claim?
              </ThemedText>

              <View style={styles.claimRequirements}>
                <ThemedText style={styles.requirementText}>
                  Please complete all required steps to enable claim submission:
                </ThemedText>

                <View style={styles.requirementItem}>
                  <Feather
                    name={selectedStudent ? "check-circle" : "circle"}
                    size={16}
                    color={
                      selectedStudent
                        ? Colors.light.success
                        : Colors.light.textGray[300]
                    }
                  />
                  <ThemedText style={styles.requirementText}>
                    Select a student
                  </ThemedText>
                </View>

                <View style={styles.requirementItem}>
                  <Feather
                    name={showPostSessionUI ? "check-circle" : "circle"}
                    size={16}
                    color={
                      showPostSessionUI
                        ? Colors.light.success
                        : Colors.light.textGray[300]
                    }
                  />
                  <ThemedText style={styles.requirementText}>
                    Provide past session date and time
                  </ThemedText>
                </View>

                <View style={styles.requirementItem}>
                  <Feather
                    name={postSessionLog ? "check-circle" : "circle"}
                    size={16}
                    color={
                      postSessionLog
                        ? Colors.light.success
                        : Colors.light.textGray[300]
                    }
                  />
                  <ThemedText style={styles.requirementText}>
                    Complete post-session log
                  </ThemedText>
                </View>
              </View>

              <Pressable
                style={[
                  styles.claimButton,
                  (!selectedStudent || !showPostSessionUI || !postSessionLog) &&
                    styles.disabledButton,
                ]}
                disabled={
                  !selectedStudent || !showPostSessionUI || !postSessionLog
                }
                onPress={handleStartClaim}
              >
                <Feather
                  name="file-text"
                  size={20}
                  color={Colors.light.background}
                />
                <ThemedText style={styles.buttonText}>
                  Save & Start Claim
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}
        </View>
      </ScrollView>

      {/* Save Button - Fixed at bottom */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Schedule</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.textGray[500] + "20",
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "15",
  },
  headerContent: {
    alignItems: "center",
    marginTop: 12,
  },
  headerAccent: {
    width: 40,
    height: 3,
    backgroundColor: Colors.light.green[200],
    marginTop: 8,
    borderRadius: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: Colors.light.textGray[100],
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingTop: 24,
    gap: 28,
    backgroundColor: Colors.light.background,
  },
  section: {
    padding: 0,
    paddingBottom: 20,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
    marginBottom: 0,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.green[200],
  },
  input: {
    backgroundColor: Colors.light.textGray[500] + "10",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.textGray[500] + "10",
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
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
    borderColor: Colors.light.textGray[500] + "20",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  dateTimeContainer: {
    marginTop: 8,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  timeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
  },
  dateTimeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.green[200] + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dateTimeTextContainer: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: Colors.light.textGray[300],
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.textGray[100],
  },
  saveButton: {
    backgroundColor: Colors.light.green[200],
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginVertical: 16,
  },
  saveButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    color: Colors.light.textGray[300],
    fontSize: 14,
    marginBottom: 12,
  },
  claimSection: {
    borderWidth: 1,
    borderColor: Colors.light.green[200] + "40",
    borderStyle: "dashed",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    borderBottomWidth: 1,
  },
  claimRequirements: {
    marginVertical: 12,
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    color: Colors.light.textGray[200],
    fontSize: 14,
  },
  claimButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: Colors.light.textGray[300],
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
});
