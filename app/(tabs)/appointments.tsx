import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView as SafeAreaContext } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { appointments } from "@/assets/dummyData/appointments";

// Define type for appointment and student
interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
  mentalState: string;
  consent: {
    studentConsent: boolean;
    parentConsent: boolean;
  };
}

interface Appointment {
  id: number;
  student: Student;
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
  notes: any[];
}

export default function AppointmentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Calculate stats
  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === "completed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    today: appointments.filter((a) => {
      const today = new Date().toISOString().split("T")[0];
      return a.time.date === today;
    }).length,
  };

  // Filter appointments based on search and filter
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return matchesSearch && appointment.time.date === today;
    }
    return matchesSearch && appointment.status === activeFilter;
  });

  // Enhanced filter buttons data with counts
  const filters = [
    { id: "all", label: "All", count: stats.total },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "completed", label: "Completed", count: stats.completed },
    { id: "today", label: "Today", count: stats.today },
  ];

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerInner}>
        <Image
          source={require("@/assets/images/tad.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/appointment-create")}
        >
          <Feather name="calendar" size={20} color={Colors.light.background} />
          <ThemedText style={styles.createButtonText}>New</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText type="title" style={styles.headerTitle}>
        Appointments
      </ThemedText>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.today}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersScrollContent}
      >
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                filter.id === activeFilter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter.id === activeFilter && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  filter.id === activeFilter && styles.activeFilterCount,
                ]}
              >
                {filter.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return Colors.light.success;
      case "pending":
        return Colors.light.warning;
      case "cancelled":
        return Colors.light.error;
      default:
        return Colors.light.textGray[300];
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return Colors.light.error;
      case "medium":
        return Colors.light.warning;
      case "low":
        return Colors.light.success;
      default:
        return Colors.light.textGray[300];
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Keep existing image arrays
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

  const getProfileImage = (student: Student) => {
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
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const profileImage = getProfileImage(appointment.student);

    return (
      <Pressable
        key={appointment.id}
        onPress={() =>
          router.push({
            pathname: "/appointment-detail",
            params: { appointmentId: appointment.id },
          })
        }
      >
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={styles.nameAndStatus}>
                <Image source={profileImage} style={styles.profileImage} />
                <View style={styles.nameTypeContainer}>
                  <Text style={styles.studentName}>
                    {appointment.student.name}
                  </Text>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Feather
                  name="more-vertical"
                  size={20}
                  color={Colors.light.textGray[300]}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.statusRow}>
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(appointment.status) },
                ]}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Text>
              <Text style={styles.priorityText}>
                {appointment.priority.toUpperCase()} Priority
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <View style={styles.iconLabel}>
                  <Feather
                    name="clock"
                    size={16}
                    color={Colors.light.textGray[300]}
                  />
                  <Text style={[styles.label, { marginLeft: 8 }]}>Time</Text>
                </View>
                <Text style={styles.value}>
                  {`${formatDate(appointment.time.date)} at ${
                    appointment.time.time
                  }`}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconLabel}>
                  <Feather
                    name="map-pin"
                    size={16}
                    color={Colors.light.textGray[300]}
                  />
                  <Text style={[styles.label, { marginLeft: 8 }]}>
                    Location
                  </Text>
                </View>
                <Text style={styles.value}>{appointment.time.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconLabel}>
                  <Feather
                    name="message-square"
                    size={16}
                    color={Colors.light.textGray[300]}
                  />
                  <Text style={[styles.label, { marginLeft: 8 }]}>Notes</Text>
                </View>
                <Text style={styles.value} numberOfLines={2}>
                  {appointment.notes.length > 0
                    ? appointment.notes.join("\n")
                    : "No notes available"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaContext style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.light.textGray[300]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            placeholderTextColor={Colors.light.textGray[300]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {renderStatsCard()}
        {renderFilters()}

        <ScrollView
          style={styles.appointmentsScrollView}
          contentContainerStyle={styles.appointmentsContentContainer}
        >
          <View style={styles.listContainer}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(renderAppointmentCard)
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  No appointments found.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaContext>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    backgroundColor: Colors.light.background,
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    alignItems: "flex-start",
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 20,
    tintColor: Colors.light.background,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.green[200],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: Colors.light.background,
    fontWeight: "600",
  },
  headerTitle: {
    color: Colors.light.background,
    fontSize: 28,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  statsCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: Colors.light.green[200],
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.textGray[500] + "20",
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersScrollView: {
    flexGrow: 0,
  },
  filtersScrollContent: {
    paddingRight: 8,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingVertical: 4,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.textGray[500] + "10",
    gap: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeFilterButton: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.green[200],
  },
  filterText: {
    fontSize: 15,
    color: Colors.light.textGray[300],
    fontWeight: "500",
  },
  activeFilterText: {
    color: Colors.light.green[200],
    fontWeight: "600",
  },
  filterCount: {
    fontSize: 13,
    color: Colors.light.textGray[300],
  },
  activeFilterCount: {
    color: Colors.light.green[200],
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textGray[300],
    textAlign: "center",
    height: 400,
    paddingTop: -200,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    shadowColor: Colors.light.textGray[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  nameAndStatus: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nameTypeContainer: {
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  moreButton: {
    padding: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  priorityText: {
    fontSize: 13,
    color: Colors.light.textGray[300],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500] + "10",
    marginBottom: 12,
  },
  infoContainer: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  value: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.light.green[200],
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  declineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "30",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: Colors.light.background,
    fontWeight: "600",
  },
  declineButtonText: {
    color: Colors.light.textGray[300],
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  appointmentsScrollView: {
    flex: 1,
  },
  appointmentsContentContainer: {
    paddingTop: 4,
    paddingBottom: 20,
  },
});
