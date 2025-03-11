import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Text,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView as SafeAreaContext } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { appointments } from "@/assets/dummyData/appointments";

// Define the Claim type
interface Claim {
  id: string;
  referenceNo: string;
  submissionDate: string;
  student: {
    id: number;
    name: string;
    age: number;
    grade: number;
    mentalState: string;
    consent: {
      studentConsent: boolean;
      parentConsent: boolean;
    };
  };
  appointment: {
    date: string;
    time: string;
  };
  status: string;
}

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
      <View style={styles.mainAnalyticsCard}>
        <ThemedText type="label">Monthly Earnings</ThemedText>
        <Text style={styles.earningsText}>
          ${analytics.monthlyEarnings.toLocaleString()}
        </Text>
        <View style={styles.projectionRow}>
          <Feather name="trending-up" size={16} color={Colors.light.success} />
          <Text style={styles.projectionText}>
            Projected: ${analytics.projectedEarnings.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Claims Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>${analytics.averagePerSession}</Text>
          <ThemedText type="caption">Avg. per Session</ThemedText>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>{analytics.pendingClaims}</Text>
          <ThemedText type="caption">Pending Claims</ThemedText>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>{analytics.unbilledSessions}</Text>
          <ThemedText type="caption">Unbilled Sessions</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderClaimCard = (claim: Claim) => (
    <View key={claim.id} style={styles.claimCard}>
      <View style={styles.claimHeader}>
        <View>
          <Text style={styles.studentName}>{claim.student.name}</Text>
          <Text style={styles.studentId}>Student ID: {claim.student.id}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                claim.status === "Submitted"
                  ? Colors.light.success
                  : Colors.light.textGray[300],
            },
          ]}
        >
          <Text style={styles.statusText}>{claim.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.claimDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Reference No.</Text>
          <Text style={styles.value}>{claim.referenceNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Submission Date</Text>
          <Text style={styles.value}>{claim.submissionDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Appointment</Text>
          <Text style={styles.value}>
            {new Date(claim.appointment.date).toLocaleDateString()} at{" "}
            {claim.appointment.time}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaContext style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Analytics Section */}
          {renderAnalyticsCards()}

          {/* Create Claim Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => console.log("Create claim pressed")}
          >
            <Feather name="plus" size={20} color={Colors.light.background} />
            <Text style={styles.createButtonText}>Create Claim</Text>
          </TouchableOpacity>

          {/* Claims List */}
          <View style={styles.claimsList}>{claims.map(renderClaimCard)}</View>
        </View>
      </ScrollView>
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
  headerTitle: {
    color: Colors.light.background,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 20,
    tintColor: Colors.light.background,
  },
  analyticsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  mainAnalyticsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
  },
  earningsText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.green[200],
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
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    borderRadius: 12,
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
    gap: 12,
  },
  claimCard: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "20",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.light.textGray[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  claimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  studentName: {
    color: Colors.light.textGray[100],
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  studentId: {
    color: Colors.light.textGray[300],
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.background,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500] + "10",
    marginVertical: 12,
  },
  claimDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
});
