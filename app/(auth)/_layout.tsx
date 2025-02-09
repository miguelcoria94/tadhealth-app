import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext"

export default function AuthLayout() {
  const router = useRouter();
  const { userToken, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && userToken) {
      router.replace("(tabs)");
    }
  }, [userToken, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      {/* If you have more auth screens, list them here */}
    </Stack>
  );
}
