# Windows Firewall Fix for Android App Connection

## Issue
The Android emulator cannot connect to your Node.js server due to Windows Firewall blocking the connection.

## Solution

### Method 1: Allow Node.js through Windows Firewall (Recommended)

1. **Open Windows Defender Firewall**:
   - Press `Windows + R`
   - Type `wf.msc` and press Enter

2. **Click "Inbound Rules"** in the left panel

3. **Click "New Rule..."** in the right panel

4. **Select "Port"** and click Next

5. **Select "TCP"** and enter **5000** in "Specific local ports"

6. **Select "Allow the connection"** and click Next

7. **Select all profiles** (Domain, Private, Public) and click Next

8. **Name it "Node.js Server"** and click Finish

### Method 2: Temporarily Disable Firewall (For Testing Only)

1. **Open Windows Defender Firewall**:
   - Press `Windows + R`
   - Type `firewall.cpl` and press Enter

2. **Click "Turn Windows Defender Firewall on or off"**

3. **Select "Turn off Windows Defender Firewall"** for both Private and Public networks

4. **Click OK**

⚠️ **Warning**: Only do this temporarily for testing. Re-enable firewall after testing.

### Method 3: Command Line (Run as Administrator)

Open PowerShell as Administrator and run:

```powershell
netsh advfirewall firewall add rule name="Allow Node.js Server" dir=in action=allow protocol=TCP localport=5000
```

## Test the Connection

After applying the firewall fix:

1. **Restart your Node.js server**
2. **Test the app again**
3. **Check console logs** for successful connections

## Alternative: Use Physical Device

If emulator still doesn't work:
1. **Connect your phone via USB**
2. **Enable USB debugging**
3. **Run**: `npx react-native run-android --deviceId=YOUR_DEVICE_ID`

## Expected Result

After fixing the firewall:
- ✅ Network requests should succeed
- ✅ Login functionality should work
- ✅ No more "Network request failed" errors

## Troubleshooting

If still not working:
1. **Check if server is running**: `http://10.197.154.121:5000`
2. **Verify CORS settings** in your backend
3. **Try different network** (mobile hotspot)
4. **Check antivirus software** blocking connections 