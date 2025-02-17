// context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store"; // For storing tokens on device

interface AuthContextProps {
  userToken: string | null;      // The token or null if not logged in
  isLoading: boolean;            // Whether we're checking storage or signing in/out
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with default placeholder values
const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// Export a handy custom hook to consume this context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component that wraps your app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check SecureStore for a stored token
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        if (storedToken) {
          setUserToken(storedToken);
        }
      } catch (error) {
        console.log("Error loading user token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // Called when user logs in
  const signIn = async (token: string) => {
    setIsLoading(true);
    try {
      await SecureStore.setItemAsync("userToken", token);
      setUserToken(token);
    } catch (error) {
      console.log("Error storing user token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Called when user logs out\
 const signOut = async () => {
   setIsLoading(true);
   try {
     await SecureStore.deleteItemAsync("userToken"); // Clears the stored token
     setUserToken(null);
   } catch (error) {
     console.log("Error deleting user token:", error);
   } finally {
     setIsLoading(false);
   }
 };

  // Provide these values to the rest of the app
  const value: AuthContextProps = {
    userToken,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

