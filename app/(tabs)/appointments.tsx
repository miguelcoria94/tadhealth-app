<<<<<<< HEAD
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
=======
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
>>>>>>> 47ddf78 (updated appointments)
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { appointments } from "@/assets/dummyData/appointments";
import { students } from "@/assets/dummyData/students";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

export default function AppointmentsScreen() {
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

  // Filter buttons data
  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "today", label: "Today" },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return Colors.light.success;
      case "pending":
        return Colors.light.warning;
      default:
        return Colors.light.textGray[300];
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return Colors.light.pink[100];
      case "medium":
        return Colors.light.orange[100];
      case "low":
        return Colors.light.mint[100];
      default:
        return Colors.light.textGray[300];
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

<<<<<<< HEAD
  // Define the images for boys and girls
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

  // Dynamically determine the profile image based on student gender and their index
  const getProfileImage = (student) => {
    const genderImages = student.gender === "male" ? boyImages : girlImages;
    const index = (student.id % 5) - 1; // Modulo by 5 to cycle between the images
    return genderImages[index];
  };

  const renderAppointmentCard = (appointment) => {
    const profileImage = getProfileImage(appointment.student);

    return (
      <ThemedView key={appointment.id} style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.nameAndStatus}>
              <Image
                source={profileImage}
                style={styles.profileImage}
              />
              <ThemedText
                type="subtitle"
                style={[
                  styles.studentName,
                  { color: Colors.light.textGray[100] },
                ]}
              >
                {appointment.student.name}
              </ThemedText>
            </View>
=======
  const renderStatsCard = () => (
    <ThemedView variant="elevated" style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText type="title" style={styles.statNumber}>
            {stats.total}
          </ThemedText>
          <ThemedText type="caption">Total</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText type="title" style={styles.statNumber}>
            {stats.today}
          </ThemedText>
          <ThemedText type="caption">Today</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText type="title" style={styles.statNumber}>
            {stats.pending}
          </ThemedText>
          <ThemedText type="caption">Pending</ThemedText>
        </View>
      </View>
    </ThemedView>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => setActiveFilter(filter.id)}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.activeFilterButton,
          ]}
        >
          <ThemedText
            style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText,
            ]}
          >
            {filter.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAppointmentCard = (appointment) => (
    <ThemedView key={appointment.id} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.nameAndStatus}>
            <ThemedText
              type="subtitle"
              style={[
                styles.studentName,
                { color: Colors.light.textGray[100] },
              ]}
            >
              {appointment.student.name}
            </ThemedText>
>>>>>>> 47ddf78 (updated appointments)
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment.status) },
              ]}
            >
              <ThemedText style={styles.statusText}>
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(appointment.priority) },
            ]}
          >
            <ThemedText style={styles.priorityText}>
              {appointment.priority.toUpperCase()} Priority
            </ThemedText>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Time</ThemedText>
              <ThemedText style={styles.value}>
                {`${formatDate(appointment.time.date)} at ${appointment.time.time}`}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Location</ThemedText>
              <ThemedText style={styles.value}>
                {appointment.time.location}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Counselor</ThemedText>
              <ThemedText style={styles.value}>
                {appointment.counselor.name}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Type</ThemedText>
              <ThemedText style={styles.value}>{appointment.type}</ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.green[200],
        dark: "#1D3D47",
      }}
      headerImage={
        <View style={styles.headerContent}>
          <Image
            source={require("@/assets/images/tad.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="title" style={styles.headerTitle}>
            Appointments
          </ThemedText>
        </View>
      }
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <ThemedView variant="elevated" style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.light.textGray[300]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            placeholderTextColor={Colors.light.textGray[300]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Filters */}
        {renderFilters()}

        {/* Appointments List */}
        <View style={styles.listContainer}>
          {filteredAppointments.map(renderAppointmentCard)}
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    alignItems: "flex-start",
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 20,
    tintColor: Colors.light.background,
  },
  headerTitle: {
    color: Colors.light.background,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
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
    color: Colors.light.green[100],
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.textGray[500],
    opacity: 0.2,
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.textGray[500] + "10",
  },
  activeFilterButton: {
    backgroundColor: Colors.light.green[200],
  },
  filterText: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  activeFilterText: {
    color: Colors.light.background,
    fontWeight: "600",
  },
  listContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    shadowColor: Colors.light.textGray[100],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row", // Align header in a row to keep the profile on the left and status/priority on the right
    justifyContent: "space-between", // Space out the elements to opposite ends
    alignItems: "flex-start", // Align the profile and name to the top left
    gap: 12,
  },
  nameAndStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8, // Adjust space between image and name
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500],
    opacity: 0.1,
    marginVertical: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.light.textGray[300],
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    fontWeight: "500",
  },
<<<<<<< HEAD
=======
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
>>>>>>> 47ddf78 (updated appointments)
});
