# API Integration Setup Guide

## Overview
The app has been integrated with your authentication APIs running on `http://localhost:5000/api/auth`.

## API Endpoints Integrated

### Authentication Endpoints
- `POST /register` - User registration
- `POST /send-otp` - Send OTP to email
- `POST /verify-otp` - Verify OTP for login
- `POST /login` - Login with email/password
- `POST /logout` - User logout

## Configuration

### API Base URL
The app is configured to use:
- **Development**: `http://localhost:5000/api/auth`
- **Production**: `https://your-production-domain.com/api/auth` (update this)

### Environment Setup
1. Update the production URL in `src/config/api.ts` when deploying
2. The app automatically uses DEV environment for development builds

## Required Dependencies

### Install AsyncStorage
```bash
npm install @react-native-async-storage/async-storage
```

### For Android - Network Security Config
Create `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

Update `android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### For iOS - Info.plist
Add to `ios/Todo/Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## Features Implemented

### Login Screen
- Email/Password authentication
- Email/OTP authentication with toggle
- Form validation
- Loading states
- Error handling

### Signup Screen
- Complete registration form with all required fields
- Real-time validation
- Password confirmation
- Mobile number validation (10 digits)
- Email format validation

### Authentication Context
- Global authentication state management
- Automatic token storage and retrieval
- Conditional navigation based on auth status
- Loading states during auth checks

### Profile Screen
- Logout functionality with confirmation
- Integration with auth context

## API Response Format Expected

The app expects API responses in this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  },
  "token": "jwt_token_here"
}
```

## Error Handling
- Network errors are caught and displayed to users
- API error messages are shown in alerts
- Loading states prevent multiple submissions
- Form validation prevents invalid requests

## Testing
1. Start your backend server on `localhost:5000`
2. Run the React Native app
3. Test registration flow
4. Test login with both password and OTP methods
5. Test logout functionality

## Troubleshooting

### Common Issues
1. **Network Error**: Ensure your backend server is running on port 5000
2. **CORS Issues**: Configure your backend to allow requests from the app
3. **Android Network**: Check network security config for localhost access
4. **iOS Network**: Verify Info.plist settings for localhost

### Debug Mode
Enable debug logging by checking console output for API calls and responses.

## Next Steps
1. Install AsyncStorage dependency
2. Configure network security for your platform
3. Test the integration with your backend
4. Update production URLs when deploying 