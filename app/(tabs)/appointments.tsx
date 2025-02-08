import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { appointments } from "@/assets/dummyData/appointments";
import { students } from "@/assets/dummyData/students";
import { Colors } from "@/constants/Colors";

export default function AppointmentsScreen() {
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
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{ color: Colors.light.textGray[100] }}
          >
            Appointments
          </ThemedText>
        </ThemedView>

        <View style={styles.listContainer}>
          {appointments.map(renderAppointmentCard)}
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
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
});
