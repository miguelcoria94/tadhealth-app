import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { students } from "@/assets/dummyData/appointments";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Boy and Girl Images
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
    case 101:
      return boyImages[0];
    case 102:
      return girlImages[0];
    case 103:
      return boyImages[1];
    case 104:
      return girlImages[1];
    case 105:
      return boyImages[2];
    case 106:
      return girlImages[2];
    case 107:
      return boyImages[3];
    case 108:
      return girlImages[3];
    case 109:
      return boyImages[4];
    case 110:
      return girlImages[4];
    default:
      return null;
  }
}

export default function StudentLookupScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Mock statistics for a better UI representation
  const studentStats = {
    total: students.length,
    needAttention: 3, // Students who need immediate attention
    withAppointments: 4, // Hardcoded for now: 4 out of 10 students with appointments
  };

  // Filter the students by name
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation handler
  const handleCardPress = (studentId: number) => {
    router.push({
      pathname: "/studentdetail",
      params: { studentId },
    });
  };

  const renderStudentCard = (student: any) => {
    const profileImage = getProfileImage(student);
    const hasUpcomingAppointments = student.appointments.length > 0;
    // Determine if student needs attention based on mental state
    const needsAttention = student.mentalState !== "Good";

    return (
      <Pressable
        key={student.id}
        style={styles.listItem}
        onPress={() => handleCardPress(student.id)}
      >
        <View style={styles.listItemContent}>
          {/* Left: Profile image */}
          {profileImage ? (
            <Image source={profileImage} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <ThemedText style={styles.profileInitial}>
                {student.name.charAt(0)}
              </ThemedText>
            </View>
          )}

          {/* Middle: Student info */}
          <View style={styles.studentInfo}>
            <ThemedText
              style={styles.studentName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {student.name}
            </ThemedText>

            <ThemedText
              style={styles.grade}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Grade: {student.grade}
            </ThemedText>

            {/* Appointment info */}
            <View style={styles.metadataItem}>
              <Feather
                name="calendar"
                size={12}
                color={Colors.light.textGray[300]}
              />
              <ThemedText style={styles.metadataText}>
                {hasUpcomingAppointments
                  ? `${student.appointments.length} appt(s)`
                  : "No appointments"}
              </ThemedText>
            </View>
          </View>

          {/* Right: Status indicator and chevron */}
          <View style={styles.listItemRight}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: needsAttention
                    ? Colors.light.warning
                    : Colors.light.success,
                },
              ]}
            />
            <Feather
              name="chevron-right"
              size={20}
              color={Colors.light.textGray[300]}
              style={styles.chevron}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Search Bar with Action Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color={Colors.light.textGray[300]}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              placeholderTextColor={Colors.light.textGray[300]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather
                  name="x"
                  size={20}
                  color={Colors.light.textGray[300]}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Student Summary */}
        <ThemedView style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryNumber}>
              {studentStats.total}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Total</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <ThemedText style={[styles.summaryNumber, styles.attentionNumber]}>
              {studentStats.needAttention}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Need Attention</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryNumber}>
              {studentStats.withAppointments}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>With Appts</ThemedText>
          </View>
        </ThemedView>

        {/* Student List - Scrollable */}
        <ScrollView
          style={styles.listScrollView}
          contentContainerStyle={styles.listContentContainer}
        >
          <View style={styles.listContainer}>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(renderStudentCard)
            ) : (
              <ThemedText style={styles.noResultsText}>
                No students found
              </ThemedText>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
    paddingTop: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    flex: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.green[200],
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 0,
  },
  createButtonText: {
    display: "none", // Not needed anymore as we only show the icon
  },
  headerAccent: {
    display: "none", // Hide this as it's not used in main pages
  },
  logo: {
    display: "none", // Hiding it rather than removing in case it's referenced elsewhere
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    backgroundColor: Colors.light.background,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.light.green[200],
    marginBottom: 4,
  },
  attentionNumber: {
    color: Colors.light.warning,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textGray[200],
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.textGray[500] + "20",
  },
  listContainer: {
    width: "100%",
  },
  listItem: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: Colors.light.background, // White background
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20", // Lighter gray border
    overflow: "hidden",
    shadowColor: Colors.light.textGray[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemContent: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  listItemRight: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.light.green[200] + "30",
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.green[200] + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.green[200],
  },
  studentName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.textGray[100],
    marginBottom: 2,
  },
  grade: {
    fontSize: 14,
    color: Colors.light.textGray[400],
    marginBottom: 4,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: Colors.light.textGray[300],
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  noResultsText: {
    textAlign: "center",
    width: "100%",
    marginTop: 20,
    color: Colors.light.textGray[300],
  },
  header: {
    display: "none", // Remove unused style
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  listScrollView: {
    flex: 1,
  },
  listContentContainer: {
    paddingTop: 4,
    paddingBottom: 20,
  },
});
