import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Real-world: call API, verify credentials, get back a token
    const mockToken = "abc123";
    await signIn(mockToken);
    // The user is now authenticated, (auth) layout will redirect to (tabs)
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={Colors.light.textGray[300]}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.light.textGray[300]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Sign In</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderColor: Colors.light.textGray[300],
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    color: Colors.light.textGray[100],
  },
  button: {
    backgroundColor: Colors.light.green[200],
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: "600",
    fontSize: 16,
  },
});
