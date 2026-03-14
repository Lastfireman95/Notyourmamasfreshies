# Firebase Setup Guide for Not Your Mama's Freshies

## Steps to Complete Firebase Integration

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Name your project: `notyourmamasfreshies` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this project)
5. Click "Create project"

### 2. Set Up Realtime Database

1. In your Firebase project, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (e.g., United States)
4. Start in **Test mode** for now (we'll secure it later)
5. Click "Enable"

### 3. Get Your Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>` to add a web app
5. Register app name: "Not Your Mama's Freshies Website"
6. You'll see your Firebase config object - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};
```

### 4. Update Your Configuration File

1. Open `/workspaces/Notyourmamasfreshies/firebase-config.js`
2. Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. with your actual values from step 3
3. Save the file

### 5. Set Up Database Security Rules (Important!)

1. Go back to "Realtime Database" in Firebase Console
2. Click on the "Rules" tab
3. Replace the rules with the contents of `database.rules.json` (included in this repository):

```json
{
  "rules": {
    "pendingOrders": {
      ".read": true,
      ".write": true
    },
    "filledOrders": {
      ".read": true,
      ".write": true
    },
    "products": {
      ".read": true,
      ".write": true
    },
    "scents": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Click **"Publish"** to save the rules.

**Important:** The `products` and `scents` rules are required for the admin dashboard to manage products and scents. Without them, you will receive a permission-denied error when trying to add, edit, or delete products or scents from the admin page.

**Note:** These rules allow anyone to read/write. For production, you should add authentication.

### 6. (Optional) Add Admin Authentication

For better security, you can restrict admin dashboard access:

1. Enable Email/Password authentication in Firebase Console
2. Go to "Authentication" > "Sign-in method"
3. Enable "Email/Password"
4. Create an admin user
5. Update the security rules to require authentication

### 7. Test Your Setup

1. **Test Order Submission:**
   - Open your website on any device
   - Add items to cart
   - Submit an order
   - Order should appear in Firebase Console under "Realtime Database" > "Data" > "pendingOrders"

2. **Test Admin Dashboard:**
   - Open admin dashboard on your PC
   - You should see the order
   - Open admin dashboard on your mobile device
   - The same order should appear there too!

3. **Test Cross-Device Sync:**
   - Submit another order from mobile
   - It should instantly appear on your PC admin dashboard

## Troubleshooting

### Orders not showing up?
- Check browser console for errors (F12 > Console tab)
- Verify firebase-config.js has correct credentials
- Make sure Firebase Realtime Database is enabled
- Check Database Rules allow read/write access

### "Firebase is not defined" error?
- Make sure you're accessing the site via http:// or https:// (not file://)
- Check that firebase-config.js is loading correctly
- Verify the Firebase SDK scripts are loading

### Need Help?
- Check Firebase Console > Realtime Database > Data to see if orders are being saved
- Look at browser console for error messages
- Make sure all files are uploaded to your web hosting

## Files Modified

The following files have been updated with Firebase integration:
- `/firebase-config.js` - Firebase configuration (YOU NEED TO UPDATE THIS)
- `/database.rules.json` - Firebase Realtime Database security rules (apply these in Firebase Console)
- `/HTML/cart.html` - Saves orders to Firebase
- `/HTML/admin-dashboard.html` - Reads orders from Firebase

## Next Steps

After Firebase is working:
1. Add proper authentication for admin dashboard
2. Set up more secure database rules
3. Add backup/export functionality
4. Consider adding email notifications when orders are received
