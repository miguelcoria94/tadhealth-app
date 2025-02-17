# TADHealth Mobile App Authentication Implementation

## Overview
This document outlines the authentication implementation for the TADHealth mobile app, including the setup of protected routes, token management, and login functionality.

## Project Structure
```
app/
  ├── (auth)/
  │   ├── _layout.tsx    # Auth layout with navigation logic
  │   └── login.tsx      # Login screen
  ├── (tabs)/            # Protected routes
  └── index.tsx          # Root redirect
```

## Key Components

### 1. Authentication Context (context/AuthContext.tsx)
The authentication context manages the global authentication state using React's Context API and Expo SecureStore for token persistence.

```typescript
// Main features:
- Token storage and retrieval
- Authentication state management
- Sign in/out functionality
- Loading state handling
```

### 2. Auth Service (services/auth.service.ts)
Handles authentication-related API calls and currently includes mock data for testing.

#### Test Credentials
```
Counselor Account:
- Email: test@tadhealth.com
- Password: password

Student Account:
- Email: student@tadhealth.com
- Password: password
```

### 3. Auth Layout (app/(auth)/_layout.tsx)
Manages authentication flow and protected route access.

## How It Works

### Authentication Flow
1. App starts → Checks for stored token
2. If no token → Shows login screen
3. If token exists → Redirects to main app
4. Failed login → Shows error message
5. Successful login → Stores token and redirects to main app

### Token Management
- Tokens are stored securely using Expo SecureStore
- Token is checked on app launch
- Token is included in API requests
- Token is cleared on logout

## Implementation Details

### Setting Up Protected Routes
The app uses Expo Router's file-based routing system with group directories:
- `(auth)` group for authentication screens
- `(tabs)` group for protected app screens

### Login Process
1. User enters credentials
2. Client-side validation
3. API call to authentication endpoint
4. Token storage on success
5. Redirect to main app

## Testing Authentication

### Steps to Test Login:
1. Launch the app
2. You should be redirected to the login screen
3. Enter test credentials:
   ```
   Email: test@tadhealth.com
   Password: password
   ```
4. Upon successful login, you'll be redirected to the main app
5. To test logout, use the logout function from useAuth hook

### Error Cases Handled:
- Empty email/password
- Invalid credentials
- Network errors
- Token storage failures

## Security Considerations
- Tokens are stored securely using Expo SecureStore
- Sensitive data is not stored in plain text
- API calls use HTTPS
- Passwords are never stored locally

## Future Improvements
1. Implement refresh tokens
2. Add biometric authentication
3. Add password reset functionality
4. Implement remember me feature
5. Add multi-factor authentication

## Common Issues and Solutions

### "Screen does not exist" Error
Solution: Ensure file names match exactly with the route names in the Stack navigator.

### Token Persistence Issues
Solution: Check SecureStore implementation and error handling.

### Navigation Issues
Solution: Verify the routing structure and navigation logic in _layout.tsx files.

## Development Guidelines

### Adding New Protected Routes
1. Add route in (tabs) directory
2. Ensure useAuth hook is implemented
3. Add necessary navigation logic

### Modifying Auth Flow
1. Update AuthContext as needed
2. Modify auth service endpoints
3. Update navigation logic in layouts

## API Integration
Currently using mock data, but prepared for real API integration:
```typescript
const response = await authService.login({ email, password });
await signIn(response.token);
```

Replace mock service with real API calls when ready.