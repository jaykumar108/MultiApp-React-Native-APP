# Backend CORS Configuration Update

## Current Issue
Your backend CORS is configured for `localhost:3000`, but React Native needs different settings.

## Required Changes to Your Backend

### Update your server.js or app.js file:

```javascript
// Current CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Updated CORS configuration for React Native
app.use(cors({
  origin: [
    "http://localhost:3000",           // Web frontend
    "http://localhost:8081",           // React Native Metro bundler
    "http://10.0.2.2:5000",           // Android emulator
    "http://10.0.2.2:8081",           // Android emulator Metro
    "http://192.168.1.100:5000",      // Physical device (replace with your IP)
    "http://192.168.1.100:8081",      // Physical device Metro (replace with your IP)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Alternative: Allow all origins for development
```javascript
app.use(cors({
  origin: true,  // Allow all origins in development
  credentials: true
}));
```

## Environment Variables
Add these to your `.env` file:
```env
# Development
FRONTEND_URL=http://localhost:3000
REACT_NATIVE_URL=http://10.0.2.2:5000

# Production (update with your actual domain)
PRODUCTION_FRONTEND_URL=https://yourdomain.com
```

## Testing Steps
1. Update your backend CORS configuration
2. Restart your backend server
3. Test the React Native app login functionality
4. Check console logs for successful API calls

## Network Configuration for Different Devices

### Android Emulator
- Uses `10.0.2.2` to access host machine's localhost
- Metro bundler runs on port 8081

### Physical Android Device
- Needs your computer's actual IP address
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Update `deviceConfig.ts` with your IP address

### iOS Simulator
- Uses `localhost` directly
- No special configuration needed

## Troubleshooting
- If you get CORS errors, check the console logs
- Make sure your backend server is running
- Verify the IP address is correct for your network
- Test with Postman or curl first to verify API endpoints 