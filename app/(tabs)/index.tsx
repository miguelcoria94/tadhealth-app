import { Image, StyleSheet, Platform, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  // Dummy data
  const counselorInfo = {
    name: "Dr. Sarah Wilson",
    todaysAppointments: 5,
    upcomingAppointments: 12,
    alerts: [
      {
        id: 1,
        type: "crisis",
        student: "Lucas Brown",
        status: "high",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "missed",
        student: "Emily White",
        status: "medium",
        time: "1 day ago",
      },
    ],
    notifications: [
      {
        id: 1,
        message: "New consent form submitted by Jane Smith",
        time: "1 hour ago",
      },
      {
        id: 2,
        message: "Appointment rescheduled with John Doe",
        time: "3 hours ago",
      },
      { id: 3, message: "Monthly report due in 2 days", time: "5 hours ago" },
    ],
    billing: {
      monthlyHours: 87,
      pendingReports: 3,
      unbilledSessions: 5,
    },
    todaysSessions: [
      { time: "10:00 AM", student: "Alice Johnson", type: "Mental Health" },
      { time: "11:30 AM", student: "Tom Davis", type: "Career Counseling" },
      { time: "2:00 PM", student: "Sarah Miller", type: "Academic" },
    ],
  };

  const renderMetricCard = (
    title: string,
    value: number | string,
    subtitle: string
  ) => (
    <ThemedView variant="elevated" style={styles.metricCard}>
      <ThemedText type="label" style={styles.metricTitle}>
        {title}
      </ThemedText>
      <ThemedText type="title" style={styles.metricValue}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={styles.metricSubtitle}>
        {subtitle}
      </ThemedText>
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
          <ThemedText type="title" style={styles.welcomeText}>
            Welcome back, Dr. Wilson
          </ThemedText>
        </View>
      }
    >
      {/* Crisis Alerts Section */}
      {counselorInfo.alerts.length > 0 && (
        <ThemedView
          variant="elevated"
          style={[
            styles.alertCard,
            { backgroundColor: Colors.light.pink[400] },
          ]}
        >
          <View style={styles.alertHeader}>
            <Feather
              name="alert-circle"
              size={24}
              color={Colors.light.pink[100]}
            />
            <ThemedText style={styles.alertTitle}>Crisis Alerts</ThemedText>
          </View>
          {counselorInfo.alerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <ThemedText type="defaultSemiBold">{alert.student}</ThemedText>
              <ThemedText type="caption">{alert.time}</ThemedText>
            </View>
          ))}
        </ThemedView>
      )}

      {/* Metrics Row */}
      <View style={styles.metricsContainer}>
        {renderMetricCard(
          "Today",
          counselorInfo.todaysAppointments,
          "appointments"
        )}
        {renderMetricCard(
          "Upcoming",
          counselorInfo.upcomingAppointments,
          "sessions"
        )}
        {renderMetricCard(
          "Hours",
          counselorInfo.billing.monthlyHours,
          "this month"
        )}
      </View>

      {/* Today's Schedule */}
      <ThemedView variant="elevated" style={styles.sectionCard}>
        <ThemedText type="subtitle">Today's Schedule</ThemedText>
        {counselorInfo.todaysSessions.map((session, index) => (
          <View key={index} style={styles.sessionItem}>
            <ThemedText type="defaultSemiBold" style={styles.sessionTime}>
              {session.time}
            </ThemedText>
            <View style={styles.sessionDetails}>
              <ThemedText>{session.student}</ThemedText>
              <ThemedText type="caption">{session.type}</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Notifications */}
      <ThemedView variant="elevated" style={styles.sectionCard}>
        <ThemedText type="subtitle">Recent Notifications</ThemedText>
        {counselorInfo.notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <ThemedText>{notification.message}</ThemedText>
            <ThemedText type="caption">{notification.time}</ThemedText>
          </View>
        ))}
      </ThemedView>

      {/* Billing Summary */}
      <ThemedView variant="elevated" style={styles.sectionCard}>
        <ThemedText type="subtitle">Billing Summary</ThemedText>
        <View style={styles.billingGrid}>
          <View style={styles.billingItem}>
            <ThemedText type="label">Pending Reports</ThemedText>
            <ThemedText type="defaultSemiBold">
              {counselorInfo.billing.pendingReports}
            </ThemedText>
          </View>
          <View style={styles.billingItem}>
            <ThemedText type="label">Unbilled Sessions</ThemedText>
            <ThemedText type="defaultSemiBold">
              {counselorInfo.billing.unbilledSessions}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
  welcomeText: {
    color: Colors.light.background,
    marginBottom: 20,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  metricTitle: {
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    marginBottom: 2,
  },
  metricSubtitle: {
    color: Colors.light.textGray[300],
  },
  alertCard: {
    marginBottom: 16,
    padding: 16,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.pink[100],
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.pink[300],
  },
  sectionCard: {
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  sessionTime: {
    width: 100,
    color: Colors.light.green[100],
  },
  sessionDetails: {
    flex: 1,
  },
  notificationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  billingGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  billingItem: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.light.textGray[500] + "10",
    borderRadius: 8,
  },
});
