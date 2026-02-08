# 🚀 Quick Start Guide

This guide will help you test the **Driver Trip Management System** with the new **Simplified Login Flow**.

## 📋 Prerequisites

- Node.js installed
- Modern web browser (Chrome, Edge, Firefox, Safari)
- `npm install` completed

## 🏃‍♂️ Start the App

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🧪 Testing the New Flow

The system now uses **Vehicle-Based Mapping**. This means you don't need to assign "Driver 1" or "Driver 2". Just select the vehicle and log in!

### Scenario 1: Two Drivers Starting a Trip

**Step 1: Open Driver 1 (Tab 1)**
1. Open http://localhost:5173
2. Select Vehicle: **TN-01-AB-1234**
3. Enter Phone: `9876543210`
4. Enter Name: **John**
5. Click **Login & Continue**
   - *You will see "Waiting for Other Drivers"*

**Step 2: Open Driver 2 (Tab 2)**
1. Open a new tab (http://localhost:5173)
2. Select **SAME** Vehicle: **TN-01-AB-1234**
3. Enter **DIFFERENT** Phone: `9876543211`
4. Enter Name: **Mike**
5. Click **Login & Continue**
   - *Both tabs will automatically update to show the "Start Trip" screen!* 🚀

**Step 3: Start the Trip**
(Perform this in either tab)
1. **GPS Check**: Click "Allow" if prompted
   - *System checks if both drivers are within 90m (simulated)*
2. **Selfie**: Click camera icon → Capture/Select photo
3. **Bus Photos**: Capture 3 photos of the bus
4. Click **🚀 Start Trip**

**Step 4: Active Trip**
- View the real-time timer
- See trip details
- Notice the "Location Tracking Active" badge

**Step 5: End Trip**
1. Click **🛑 End Trip**
2. System verifies location (must be near other driver)
3. Click **End Trip Now** to finish

---

### Scenario 2: Admin Dashboard

**Step 1: Access Admin**
1. Click the **💻 Admin** button in the top-right corner
2. Or go to http://localhost:5173 and switch mode

**Step 2: Monitor Vehicles**
- You will see a card for **TN-01-AB-1234**
- It lists both **John** and **Mike**
- Shows their login status and times
- Shows active trip status "● Trip Running"

**Step 3: Check Notifications**
- Go to "Notifications" tab
- Any distance violations will appear here

---

## 🐛 Troubleshooting

### "Waiting for Other Drivers" Stuck?
- Make sure both drivers selected the **SAME** vehicle number.
- Make sure you used **DIFFERENT** phone numbers.

### "Location Access Required"?
- Allow location permissions in your browser.
- If testing on mobile, ensure GPS is on.

### Camera Not Working?
- Allow camera permissions.
- On some desktops, you may need a webcam or use file selection fallback.

---

## 📱 Mobile Testing Tips

To test on your phone:
1. Find your computer's IP address (`ipconfig` or `ifconfig`)
2. Run `npm run dev -- --host`
3. On phone, visit `http://YOUR_COMPUTER_IP:5173`
4. Ensure both computer and phone are on the same Wi-Fi

---

## 🗺️ How Mapping Works

- **Vehicle Number** is the key.
- Any driver who logs in with **Vehicle A** is added to **Vehicle A's** group.
- The system automatically detects when 2 or more drivers are present.
- Admin dashboard groups everyone by their selected vehicle.

---

**Enjoy testing!** 🚀
