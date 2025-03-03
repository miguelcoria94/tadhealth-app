// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

// Add this component to handle protected routes
function RootLayoutNav() {
  const { userToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!userToken && !inAuthGroup) {
      // Redirect to the login page if not logged in
      router.replace("/(auth)/login");
    } else if (userToken && inAuthGroup) {
      // Redirect to the main app if logged in
      router.replace("/(tabs)");
    }
  }, [userToken, segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="studentdetail"
        options={{
          headerShown: false,
          presentation: "push",
        }}
      />
      <Stack.Screen
        name="create-referral"
        options={{
          headerShown: false,
          presentation: "push",
        }}
      />
      <Stack.Screen
        name="appointment-create"
        options={{
          headerShown: false,
          presentation: "push", 
        }}
      />
      <Stack.Screen
        name="appointment-detail"
        options={{
          headerShown: false,
          presentation: "push", 
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}