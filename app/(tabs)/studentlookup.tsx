import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

// You can import the students array from the same file where appointments are:
import { students } from "@/assets/dummyData/appointments";

// Replicate the same images used in appointments.tsx
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
      return boyImages[0]; // boy1
    case 102:
      return girlImages[0]; // girl1
    case 103:
      return boyImages[1]; // boy2
    case 104:
      return girlImages[1]; // girl2
    case 105:
      return boyImages[2]; // boy3
    case 106:
      return girlImages[2]; // girl3
    case 107:
      return boyImages[3]; // boy4
    case 108:
      return girlImages[3]; // girl4
    case 109:
      return boyImages[4]; // boy5
    case 110:
      return girlImages[4]; // girl5
    default:
      return null; // fallback
  }
}

export default function studentlookup() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.green[200], dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <ThemedText type="title" style={styles.screenTitle}>
          Student Lookup
        </ThemedText>

        <View style={styles.grid}>
          {students.map((student) => {
            const profileImage = getProfileImage(student);

            return (
              <ThemedView key={student.id} variant="elevated" style={styles.card}>
                {profileImage ? (
                  <Image source={profileImage} style={styles.profileImage} />
                ) : (
                  <Text style={styles.placeholderText}>No Image</Text>
                )}
                <ThemedText style={styles.studentName}>{student.name}</ThemedText>
              </ThemedView>
            );
          })}
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  screenTitle: {
    marginBottom: 16,
    color: Colors.light.textGray[100],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "30%", // 3 cards per row
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    padding: 8,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  studentName: {
    fontSize: 14,
    color: Colors.light.textGray[100],
  },
  placeholderText: {
    fontSize: 12,
    color: Colors.light.textGray[300],
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
