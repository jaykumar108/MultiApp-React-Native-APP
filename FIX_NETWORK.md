# Fix Network Connection for Actual API

## Current Status
✅ Mock service removed  
✅ App configured for actual API only  
✅ Multiple URL retry logic active  

## The Issue
Windows Firewall is blocking port 5000, preventing the Android emulator from reaching your server.

## Quick Fix (Choose One)

### Option 1: Allow Port 5000 in Firewall (Recommended)
1. **Press `Windows + R`**
2. **Type `wf.msc` and press Enter**
3. **Click "Inbound Rules" in left panel**
4. **Click "New Rule..." in right panel**
5. **Select "Port" and click Next**
6. **Select "TCP" and enter `5000` in "Specific local ports"**
7. **Select "Allow the connection" and click Next**
8. **Select all profiles (Domain, Private, Public) and click Next**
9. **Name it "Node.js Server" and click Finish**

### Option 2: Temporarily Disable Firewall (For Testing)
1. **Press `Windows + R`**
2. **Type `firewall.cpl` and press Enter**
3. **Click "Turn Windows Defender Firewall on or off"**
4. **Select "Turn off Windows Defender Firewall" for both Private and Public**
5. **Click OK**

⚠️ **Warning**: Only disable firewall temporarily for testing. Re-enable after testing.

### Option 3: Use Physical Device
If emulator still doesn't work:
1. **Connect your phone via USB**
2. **Enable USB debugging**
3. **Run**: `npx react-native run-android --deviceId=YOUR_DEVICE_ID`

## Test After Fix
1. **Restart your Node.js server**
2. **Try login/signup in the app**
3. **Check console logs for successful connections**

## Expected Results
- ✅ No more "Network request failed" errors
- ✅ Successful API connections
- ✅ Real authentication with your backend
- ✅ OTP functionality working

## Troubleshooting
If still not working:
1. **Check if server is running**: `http://10.197.154.121:5000`
2. **Verify CORS settings** in your backend
3. **Try different network** (mobile hotspot)
4. **Check antivirus software** blocking connections 