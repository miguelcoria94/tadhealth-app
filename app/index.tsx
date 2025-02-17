// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { userToken } = useAuth();

  return <Redirect href={userToken ? "/(tabs)" : "/(auth)/login"} />;
}
