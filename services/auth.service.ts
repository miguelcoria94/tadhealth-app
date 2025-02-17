// services/auth.service.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: "counselor" | "student";
  createdAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// Dummy user data
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "test@tadhealth.com",
    name: "Test User",
    role: "counselor",
    createdAt: "2024-02-15T00:00:00.000Z",
  },
  {
    id: "2",
    email: "student@tadhealth.com",
    name: "Test Student",
    role: "student",
    createdAt: "2024-02-15T00:00:00.000Z",
  },
];

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials
    if (
      credentials.email === "test@tadhealth.com" &&
      credentials.password === "password"
    ) {
      return {
        token: "dummy-jwt-token-" + Date.now(), // Simulate a JWT token
        user: MOCK_USERS[0],
      };
    }

    if (
      credentials.email === "student@tadhealth.com" &&
      credentials.password === "password"
    ) {
      return {
        token: "dummy-jwt-token-" + Date.now(),
        user: MOCK_USERS[1],
      };
    }

    // If credentials don't match, throw error
    throw new Error("Invalid email or password");
  },

  // Simulate verifying a token
  verifyToken: async (token: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (token.startsWith("dummy-jwt-token-")) {
      return MOCK_USERS[0];
    }
    return null;
  },

  // Simulate logout
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },
};
