import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
// Add this line at the top with other imports
import { useRouter } from 'expo-router';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { appointments } from "@/assets/dummyData/appointments";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

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

  // Add this before the return statement

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
    <ThemedView variant="elevated" style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.total}</ThemedText>
          <ThemedText type="caption">Total</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.completed}</ThemedText>
          <ThemedText type="caption">Completed</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.pending}</ThemedText>
          <ThemedText type="caption">Pending</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.today}</ThemedText>
          <ThemedText type="caption">Today</ThemedText>
        </View>
      </View>
    </ThemedView>
  );

 const renderFilters = () => (
   <ScrollView
     horizontal
     showsHorizontalScrollIndicator={false}
     style={styles.filtersScrollView}
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
           <ThemedText
             style={[
               styles.filterText,
               filter.id === activeFilter && styles.activeFilterText,
             ]}
           >
             {filter.label}
           </ThemedText>
           <ThemedText
             style={[
               styles.filterCount,
               filter.id === activeFilter && styles.activeFilterCount,
             ]}
           >
             {filter.count}
           </ThemedText>
         </TouchableOpacity>
       ))}
     </View>
   </ScrollView>
 );


  // Existing functions remain unchanged
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

  const getProfileImage = (student) => {
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

  const renderAppointmentCard = (appointment) => {
    const profileImage = getProfileImage(appointment.student);

    return (
      <ThemedView key={appointment.id} variant="elevated" style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.nameAndStatus}>
              <Image source={profileImage} style={styles.profileImage} />
              <View style={styles.nameTypeContainer}>
                <ThemedText type="subtitle" style={styles.studentName}>
                  {appointment.student.name}
                </ThemedText>
                <ThemedText style={styles.appointmentType}>
                  {appointment.type}
                </ThemedText>
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
            <ThemedText
              style={[
                styles.statusText,
                { color: getStatusColor(appointment.status) },
              ]}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </ThemedText>
            <ThemedText style={styles.priorityText}>
              {appointment.priority.toUpperCase()} Priority
            </ThemedText>
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
                <ThemedText style={[styles.label, { marginLeft: 8 }]}>
                  Time
                </ThemedText>
              </View>
              <ThemedText style={styles.value}>
                {`${formatDate(appointment.time.date)} at ${
                  appointment.time.time
                }`}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconLabel}>
                <Feather
                  name="map-pin"
                  size={16}
                  color={Colors.light.textGray[300]}
                />
                <ThemedText style={[styles.label, { marginLeft: 8 }]}>
                  Location
                </ThemedText>
              </View>
              <ThemedText style={styles.value}>
                {appointment.time.location}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconLabel}>
                <Feather
                  name="user"
                  size={16}
                  color={Colors.light.textGray[300]}
                />
                <ThemedText style={[styles.label, { marginLeft: 8 }]}>
                  Counselor
                </ThemedText>
              </View>
              <ThemedText style={styles.value}>
                {appointment.counselor.name}
              </ThemedText>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.acceptButton}>
              <ThemedText style={styles.actionButtonText}>Accept</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <ThemedText style={styles.declineButtonText}>Decline</ThemedText>
            </TouchableOpacity>
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
      headerImage={renderHeader()}
    >
      <View style={styles.container}>
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

        {renderStatsCard()}
        {renderFilters()}

        <View style={styles.listContainer}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(renderAppointmentCard)
          ) : (
            <View style={styles.emptyStateContainer}>
              <ThemedText style={styles.emptyStateText}>
                No appointments found.
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerContent: {
    height: 180,
    justifyContent: "flex-end",
    padding: 20,
    paddingBottom: 30,
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
    tintColor: Colors.light.background,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.green[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
    marginHorizontal: 10,
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  statsCard: {
    marginHorizontal: 10,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.textGray[500],
    opacity: 0.2,
  },
  filtersScrollView: {
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
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
  emptyStateContainer: {
    // Stretches to fill remaining space, so we can center content
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // or 10, depending on your preference
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textGray[300],
    textAlign: "center", // optional
    height: 400, // optional
    paddingTop: -200, // optional
    
  },

  activeFilterCount: {
    color: Colors.light.green[200],
  },
  listContainer: {
    gap: 0,
  },
  card: {
    marginHorizontal: 10,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderRadius: 8,
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
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.green[200],
  },
  priorityText: {
    fontSize: 13,
    color: Colors.light.textGray[300],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[300] + "20",
    marginVertical: 12,
  },
  infoContainer: {
    gap: 12,
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
    fontWeight: "500",
    color: Colors.light.textGray[400],
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.textGray[100],
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.light.green[200],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  declineButton: {
    flex: 1,
    backgroundColor: Colors.light.textGray[500] + "10",
    paddingVertical: 12,
    borderRadius: 8,
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
  noAppointments: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.light.textGray[300],
  },
});