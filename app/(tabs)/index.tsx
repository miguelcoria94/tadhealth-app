import {
  Image,
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { appointments } from "@/assets/dummyData/appointments";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    console.log("Logout pressed");
    try {
      await signOut();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
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
        light: Colors.light.green[300],
        dark: "#1D3D47",
      }}
      headerImage={
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Image
              source={require("@/assets/images/tad.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Feather
                name="log-out"
                size={22}
                color={Colors.light.background}
              />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={styles.welcomeText}>
            Welcome back, Dr. Wilson
          </ThemedText>
        </View>
      }
    >
      {/* Crisis Alerts Section */}
      {counselorInfo.alerts.length > 0 && (
        <ThemedView style={[styles.alertCard]}>
          <View style={styles.alertHeader}>
            <Feather name="alert-circle" size={22} color={Colors.light.error} />
            <ThemedText style={styles.alertTitle}>Crisis Alerts</ThemedText>
          </View>
          {counselorInfo.alerts.map((alert) => (
            <Pressable key={alert.id} style={styles.alertItem}>
              <ThemedText type="defaultSemiBold">{alert.student}</ThemedText>
              <ThemedText type="caption">{alert.time}</ThemedText>
            </Pressable>
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
      <ThemedView style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Today's Schedule</ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/appointments")}
            style={styles.viewAllButton}
          >
            <ThemedText type="caption" style={styles.viewAllText}>
              View All
            </ThemedText>
            <Feather
              name="chevron-right"
              size={16}
              color={Colors.light.green[300]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.scheduleList}>
          {counselorInfo.todaysSessions.map((session, index) => (
            <Pressable
              key={index}
              style={[
                styles.sessionItem,
                index === counselorInfo.todaysSessions.length - 1 &&
                  styles.lastItem,
              ]}
              onPress={() => {
                // In a real app, you would have appointment IDs here
                const appointmentId =
                  appointments.find(
                    (a) =>
                      a.student.name === session.student &&
                      a.type === session.type
                  )?.id || appointments[0].id;

                router.push({
                  pathname: "/appointment-detail",
                  params: { appointmentId },
                });
              }}
            >
              <View style={styles.timeContainer}>
                <ThemedText type="defaultSemiBold" style={styles.sessionTime}>
                  {session.time}
                </ThemedText>
                <View style={styles.timeDot} />
              </View>
              <View style={styles.sessionDetails}>
                <ThemedText type="defaultSemiBold" style={styles.studentName}>
                  {session.student}
                </ThemedText>
                <ThemedText type="caption" style={styles.sessionType}>
                  {session.type}
                </ThemedText>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={Colors.light.textGray[300]}
                style={styles.chevron}
              />
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Notifications */}
      <ThemedView style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recent Notifications</ThemedText>
        </View>
        {counselorInfo.notifications.map((notification, index) => (
          <Pressable
            key={notification.id}
            style={[
              styles.notificationItem,
              index === counselorInfo.notifications.length - 1 &&
                styles.lastItem,
            ]}
          >
            <View style={styles.notificationIcon}>
              <Feather name="bell" size={16} color={Colors.light.green[300]} />
            </View>
            <View style={styles.notificationContent}>
              <ThemedText>{notification.message}</ThemedText>
              <ThemedText type="caption">{notification.time}</ThemedText>
            </View>
          </Pressable>
        ))}
      </ThemedView>

      {/* Billing Summary */}
      <ThemedView style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Billing Summary</ThemedText>
        </View>
        <View style={styles.billingGrid}>
          <View style={styles.billingItem}>
            <Feather
              name="file-text"
              size={20}
              color={Colors.light.green[300]}
            />
            <View style={styles.billingContent}>
              <ThemedText type="defaultSemiBold">
                {counselorInfo.billing.pendingReports}
              </ThemedText>
              <ThemedText type="caption">Pending Reports</ThemedText>
            </View>
          </View>
          <View style={styles.billingItem}>
            <Feather name="clock" size={20} color={Colors.light.green[300]} />
            <View style={styles.billingContent}>
              <ThemedText type="defaultSemiBold">
                {counselorInfo.billing.unbilledSessions}
              </ThemedText>
              <ThemedText type="caption">Unbilled Sessions</ThemedText>
            </View>
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
    paddingBottom: 24,
    alignItems: "flex-start",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 20,
    tintColor: Colors.light.background,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  welcomeText: {
    color: Colors.light.background,
    marginBottom: 8,
    fontSize: 28,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    shadowColor: Colors.light.textGray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "25",
  },
  metricTitle: {
    marginBottom: 8,
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.light.green[300],
    marginBottom: 4,
  },
  metricSubtitle: {
    color: Colors.light.textGray[300],
    fontSize: 12,
  },
  alertCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
    shadowColor: Colors.light.textGray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "25",
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
    color: Colors.light.error,
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    shadowColor: Colors.light.textGray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "25",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: Colors.light.green[300],
    marginRight: 4,
  },
  scheduleList: {
    marginTop: 8,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "10",
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 8,
  },
  timeContainer: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.green[300],
    marginLeft: 8,
  },
  sessionTime: {
    color: Colors.light.green[300],
    fontSize: 16,
  },
  sessionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  studentName: {
    fontSize: 16,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 13,
  },
  chevron: {
    marginLeft: 8,
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "10",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.green[300] + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  billingGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  billingItem: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.light.textGray[500] + "08",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + "25",
  },
  billingContent: {
    marginLeft: 12,
  },
});
