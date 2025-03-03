# TADHealth Mobile App Authentication Implementation

## Overview
This document outlines the authentication implementation for the TADHealth mobile app, built with React Native and Expo Router. The system includes protected routes, secure token management, and a complete login/logout flow.

## Project Structure
```
app/
  ├── _layout.tsx        # Root layout with auth navigation
  ├── index.tsx          # Root redirect
  ├── create-referral.tsx          # Root redirect
  ├── studentdetail.tsx          # Root redirect
  ├── appointment-create.tsx          # Root redirect
  ├── (auth)/
  │   ├── _layout.tsx    # Auth layout with navigation logic
  │   └── login.tsx      # Login screen
  ├── studentdetail.tsx    # Auth layout with navigation logic
  └── (tabs)/           # Protected routes
      ├── _layout.tsx    # Tab navigation layout
      ├── index.tsx      # Home screen
      ├── appointments.tsx      # Home screen
      ├── claims.tsx      # Home screen
      ├── studentlookup.tsx      # Home screen
      └── [...other tab screens]
```
assets/
├── dummyData /  
    ├── appointments.js   # dummy data


## Key Components

### 1. Root Layout (_layout.tsx)
Handles the global app configuration and authentication state:
```typescript
- ThemeProvider setup
- Auth state management
- Protected route navigation
- Font loading
- Splash screen management
```

### 2. Authentication Context (context/AuthContext.tsx)
Manages global authentication state using React's Context API and Expo SecureStore:
```typescript
- Token storage and retrieval
- Authentication state management
- Sign in/out functionality
- Loading state handling
- Navigation integration with expo-router
```

### 3. Auth Service (services/auth.service.ts)
Manages authentication-related API calls with mock data for testing:

#### Test Credentials
```
Counselor Account:
- Email: test@tadhealth.com
- Password: password

Student Account:
- Email: student@tadhealth.com
- Password: password
```

## Authentication Flow

### Initial Load
1. App starts → Root layout checks for stored token
2. Loading screen shown during token check
3. Route determined based on auth state:
   - No token → (auth)/login
   - Valid token → (tabs)

### Login Process
1. User enters credentials
2. Client-side validation
3. AuthService.login() called
4. On success:
   - Token stored in SecureStore
   - Auth state updated
   - Auto-navigation to (tabs)
5. On failure:
   - Error displayed
   - User remains on login screen

### Logout Process
1. User taps logout button
2. AuthService.logout() called
3. Token removed from SecureStore
4. Auth state cleared
5. Auto-navigation to login screen

## Implementation Details

### Protected Routes
Using Expo Router's group directory structure:
- `(auth)`: Public authentication screens
- `(tabs)`: Protected app screens
- Root layout handles protection logic

### Token Management
```typescript
// Storing token
await SecureStore.setItemAsync("userToken", token);

// Retrieving token
const token = await SecureStore.getItemAsync("userToken");

// Removing token
await SecureStore.deleteItemAsync("userToken");
```

## Security Features
- Secure token storage using Expo SecureStore
- Automatic token removal on logout
- Protected route enforcement
- Client-side validation
- Error handling for all auth operations

## Testing Procedures

### Login Testing
1. Launch app
2. Enter test credentials
3. Verify successful navigation to home
4. Check token storage
5. Verify protected route access

### Logout Testing
1. Navigate to home screen
2. Press logout button
3. Verify token removal
4. Check auto-navigation to login
5. Verify protected routes are inaccessible

### Error Testing
1. Test invalid credentials
2. Test network failures
3. Test token storage errors
4. Verify error messages

## Future Improvements
1. Refresh token implementation
2. Biometric authentication
3. Password reset flow
4. Remember me functionality
5. Multi-factor authentication
6. Session timeout handling
7. Rate limiting for login attempts

## Troubleshooting

### Common Issues
1. Navigation after login/logout
   - Solution: Check router.replace() calls
   - Verify route names match file structure

2. Token persistence
   - Solution: Verify SecureStore operations
   - Check async/await usage

3. Protected route access
   - Solution: Verify _layout.tsx navigation logic
   - Check userToken state updates

## Development Guidelines

### Adding Protected Routes
1. Create route in (tabs) directory
2. Use useAuth() hook for token access
3. Add to navigation layout

### Auth Flow Modifications
1. Update AuthContext for new requirements
2. Modify navigation logic in layouts
3. Update auth service as needed

## API Integration Notes
Currently using mock service:
```typescript
const response = await authService.login({ email, password });
await signIn(response.token);
```

For real API integration:
1. Update auth.service.ts with actual endpoints
2. Implement proper error handling
3. Add token refresh mechanism
4. Update response typing

## Service Implementations

### Auth Service Implementation
```typescript
// services/auth.service.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'counselor' | 'student';
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

// Mock user data for testing
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'test@tadhealth.com',
    name: 'Test Counselor',
    role: 'counselor',
    createdAt: '2024-02-15T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'student@tadhealth.com',
    name: 'Test Student',
    role: 'student',
    createdAt: '2024-02-15T00:00:00.000Z'
  }
];

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (credentials.email === 'test@tadhealth.com' && credentials.password === 'password') {
      return {
        token: 'dummy-jwt-token-' + Date.now(),
        user: MOCK_USERS[0]
      };
    }

    if (credentials.email === 'student@tadhealth.com' && credentials.password === 'password') {
      return {
        token: 'dummy-jwt-token-' + Date.now(),
        user: MOCK_USERS[1]
      };
    }

    throw new Error('Invalid email or password');
  },

  verifyToken: async (token: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (token.startsWith('dummy-jwt-token-')) {
      return MOCK_USERS[0];
    }
    return null;
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};
```

### Auth Context Implementation
```typescript
// context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from 'expo-router';

interface AuthContextProps {
  userToken: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const signIn = async (token: string) => {
    setIsLoading(true);
    try {
      await SecureStore.setItemAsync("userToken", token);
      setUserToken(token);
    } catch (error) {
      console.log("Error storing user token:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync("userToken");
      setUserToken(null);
    } catch (error) {
      console.log("Error deleting user token:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

These implementations provide:
1. Complete mock authentication service
2. Token management
3. User type definitions
4. Error handling
5. Loading states
6. Context provider setup

For production deployment, replace the mock service with actual API calls while maintaining the same interface.