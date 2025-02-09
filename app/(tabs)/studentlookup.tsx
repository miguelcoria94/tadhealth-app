import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { students } from "@/assets/dummyData/appointments";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

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
}

export default function StudentLookupScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  // Filter the students by name
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (studentId: number) => {
    // Navigate to the student detail screen with a param
    navigation.navigate("StudentDetailScreen", { studentId });
  };

  const renderStudentCard = (student: any) => {
    const profileImage = getProfileImage(student);

    return (
      <Pressable
        key={student.id}
        style={styles.pressableArea}
        onPress={() => handleCardPress(student.id)}
      >
        <ThemedView style={styles.card}>
          {profileImage ? (
            <Image source={profileImage} style={styles.profileImage} />
          ) : (
            <ThemedText style={styles.noImageText}>No Image</ThemedText>
          )}
          <ThemedText
            style={styles.studentName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {student.name}
          </ThemedText>
          <ThemedText style={styles.grade} numberOfLines={1} ellipsizeMode="tail">
            Grade: {student.grade}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.green[200], dark: "#1D3D47" }}
      headerImage={
        <View style={styles.headerContent}>
          <Image
            source={require("@/assets/images/tad.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="title" style={styles.headerTitle}>
            Students
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
            placeholder="Search students..."
            placeholderTextColor={Colors.light.textGray[300]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>

        {/* Grid of Student Cards (two columns) */}
        <View style={styles.grid}>
          {filteredStudents.length > 0 ? (
            filteredStudents.map(renderStudentCard)
          ) : (
            <ThemedText>No students found.</ThemedText>
          )}
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  pressableArea: {
    width: "48%",
    marginBottom: 16,
  },
  // Main container below the parallax header
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
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

  // Search Bar
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

  // 2-column layout for the cards
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    height: 160,
    borderRadius: 16,
    backgroundColor: Colors.light.background,

    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,

    // Shadow/elevation
    shadowColor: Colors.light.textGray[100],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImageText: {
    color: Colors.light.textGray[300],
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    marginBottom: 4,
    maxWidth: "90%",
    textAlign: "center",
  },
  grade: {
    fontSize: 14,
    color: Colors.light.textGray[400],
    maxWidth: "90%",
    textAlign: "center",
  },
});
