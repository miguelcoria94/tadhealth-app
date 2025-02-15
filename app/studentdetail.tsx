import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View, StyleSheet, Image, ScrollView, SafeAreaView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { students } from "@/assets/dummyData/appointments";

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

export default function StudentDetailScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams();

  // Convert to a number
  const idNumber = studentId ? parseInt(studentId.toString(), 10) : NaN;
  const student = students.find((s) => s.id === idNumber);

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

  const renderInfoCard = (title: string, items: { label: string; value: string | number }[]) => (
    <ThemedView variant="elevated" style={styles.infoCard}>
      <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
      {items.map((item, index) => (
        <View key={index} style={styles.infoRow}>
          <ThemedText style={styles.label}>{item.label}</ThemedText>
          <ThemedText style={styles.value}>{item.value}</ThemedText>
        </View>
      ))}
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.green[100]} />
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

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status Badges */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: Colors.light.success }]}>
            <ThemedText style={styles.statusText}>Active</ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: Colors.light.green[100] }]}>
            <ThemedText style={styles.statusText}>Grade {student.grade}</ThemedText>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>8</ThemedText>
            <ThemedText style={styles.statLabel}>Sessions</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>3.8</ThemedText>
            <ThemedText style={styles.statLabel}>GPA</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>95%</ThemedText>
            <ThemedText style={styles.statLabel}>Attendance</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>12th</ThemedText>
            <ThemedText style={styles.statLabel}>Class Rank</ThemedText>
          </View>
        </View>

        {/* Info Cards */}
        {renderInfoCard("Personal Information", [
          { label: "Student ID", value: student.id },
          { label: "Gender", value: student.gender },
          { label: "Grade Level", value: student.grade },
          { label: "Academic Year", value: "2023-2024" },
        ])}

        {renderInfoCard("Counseling History", [
          { label: "First Session", value: "2023-09-15" },
          { label: "Last Session", value: "2024-02-10" },
          { label: "Next Session", value: "2024-02-24" },
          { label: "Session Frequency", value: "Bi-weekly" },
        ])}

        {/* Notes Section */}
        <ThemedView variant="elevated" style={styles.infoCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Counselor Notes</ThemedText>
          <ThemedText style={styles.notes}>
            Student has shown significant progress in managing academic stress. 
            Regular check-ins have been helpful in maintaining positive momentum.
            Continue to monitor study habits and social integration.
          </ThemedText>
        </ThemedView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => console.log('Schedule session')}
          >
            <Feather name="calendar" size={20} color={Colors.light.background} />
            <ThemedText style={styles.actionButtonText}>Schedule Session</ThemedText>
          </Pressable>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => console.log('View records')}
          >
            <Feather name="file-text" size={20} color={Colors.light.textGray[100]} />
            <ThemedText style={[styles.actionButtonText, styles.secondaryButtonText]}>
              View Records
            </ThemedText>
          </Pressable>
          <Pressable 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => console.log('Contact parent')}
          >
            <Feather name="mail" size={20} color={Colors.light.textGray[100]} />
            <ThemedText style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Contact Parent
            </ThemedText>
          </Pressable>
        </View>
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
    paddingTop: 20,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  notes: {
    color: Colors.light.textGray[100],
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: "500",
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
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.light.green[200],
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.light.textGray[500] + "20",
  },
  secondaryButtonText: {
    color: Colors.light.textGray[100],
  },
});