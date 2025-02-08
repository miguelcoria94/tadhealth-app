import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { appointments } from "@/assets/dummyData/appointments";
import { Image } from "react-native";

export default function ClaimsScreen() {
  // Mock claims data (in reality, this would come from appointments)
  const claims = appointments.map((apt) => ({
    id: `CLAIM-${apt.id}`,
    referenceNo: `IS9JY${Math.floor(Math.random() * 90000) + 10000}`,
    submissionDate: new Date().toLocaleDateString(),
    student: apt.student,
    appointment: {
      date: apt.time.date,
      time: apt.time.time,
    },
    status: Math.random() > 0.5 ? "Submitted" : "In Progress",
  }));

  const analytics = {
    monthlyEarnings: 4850.0,
    pendingClaims: claims.filter((c) => c.status === "In Progress").length,
    submittedClaims: claims.filter((c) => c.status === "Submitted").length,
    averagePerSession: 125.0,
    unbilledSessions: 3,
    projectedEarnings: 5750.0,
  };

  const renderAnalyticsCards = () => (
    <View style={styles.analyticsContainer}>
      {/* Main Earnings Card */}
      <ThemedView variant="elevated" style={styles.mainAnalyticsCard}>
        <ThemedText type="label" >Monthly Earnings</ThemedText>
        <ThemedText type="title" style={styles.earningsText}>
          ${analytics.monthlyEarnings.toLocaleString()}
        </ThemedText>
        <View style={styles.projectionRow}>
          <Feather name="trending-up" size={16} color={Colors.light.success} />
          <ThemedText type="caption" style={styles.projectionText}>
            Projected: ${analytics.projectedEarnings.toLocaleString()}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Claims Stats Row */}
      <View style={styles.statsRow}>
        <ThemedView variant="elevated" style={styles.statsCard}>
          <ThemedText type="title" style={styles.statNumber}>
            ${analytics.averagePerSession}
          </ThemedText>
          <ThemedText type="caption">Avg. per Session</ThemedText>
        </ThemedView>

        <ThemedView variant="elevated" style={styles.statsCard}>
          <ThemedText type="title" style={styles.statNumber}>
            {analytics.pendingClaims}
          </ThemedText>
          <ThemedText type="caption">Pending Claims</ThemedText>
        </ThemedView>

        <ThemedView variant="elevated" style={styles.statsCard}>
          <ThemedText type="title" style={styles.statNumber}>
            {analytics.unbilledSessions}
          </ThemedText>
          <ThemedText type="caption">Unbilled Sessions</ThemedText>
        </ThemedView>
      </View>
    </View>
  );

  const renderClaimCard = (claim) => (
    <ThemedView key={claim.id} variant="elevated" style={styles.claimCard}>
      <View style={styles.claimHeader}>
        <View>
          <ThemedText type="subtitle" style={styles.studentName}>
            {claim.student.name}
          </ThemedText>
          <ThemedText type="caption" style={styles.studentId}>
            Student ID: {claim.student.id}
          </ThemedText>
        </View>
        <ThemedView
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                claim.status === "Submitted"
                  ? Colors.light.success
                  : Colors.light.warning,
            },
          ]}
        >
          <ThemedText style={styles.statusText}>{claim.status}</ThemedText>
        </ThemedView>
      </View>

      <View style={styles.divider} />

      <View style={styles.claimDetails}>
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>Reference No.</ThemedText>
          <ThemedText style={styles.value}>{claim.referenceNo}</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>Submission Date</ThemedText>
          <ThemedText style={styles.value}>{claim.submissionDate}</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>Appointment</ThemedText>
          <ThemedText style={styles.value}>
            {new Date(claim.appointment.date).toLocaleDateString()} at{" "}
            {claim.appointment.time}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );

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
            Claims
          </ThemedText>
        </View>
      }
    >
      <View style={styles.container}>
        {/* Analytics Section */}
        {renderAnalyticsCards()}

        {/* Create Claim Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => console.log("Create claim pressed")}
        >
          <Feather name="plus" size={20} color={Colors.light.background} />
          <ThemedText style={styles.createButtonText}>Create Claim</ThemedText>
        </TouchableOpacity>

        {/* Claims List */}
        <View style={styles.claimsList}>{claims.map(renderClaimCard)}</View>
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
  analyticsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  mainAnalyticsCard: {
    padding: 16,
    backgroundColor: Colors.light.green[100],
  },
  earningsText: {
    fontSize: 32,
    color: "white",
    marginVertical: 8,
  },
  projectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  projectionText: {
    color: Colors.light.success,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statsCard: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  createButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  createButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  claimsList: {
    gap: 16,
  },
  claimCard: {
    padding: 16,
  },
  claimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  studentName: {
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  studentId: {
    color: Colors.light.textGray[300],
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
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500],
    opacity: 0.1,
    marginVertical: 16,
  },
  claimDetails: {
    gap: 12,
  },
  detailRow: {
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
