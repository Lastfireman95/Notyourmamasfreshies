// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get them from: https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "AIzaSyA14e3SnF1mRPjwz--y75kGJLYzgdMoPLg",
  authDomain: "notyourmamasfreshies.firebaseapp.com",
  databaseURL: "https://notyourmamasfreshies-default-rtdb.firebaseio.com",
  projectId:  "notyourmamasfreshies",
  storageBucket: "notyourmamasfreshies.firebasestorage.app",
  messagingSenderId: "282135423700",
  appId: "1:282135423700:web:2b47fb049b6cb858386941"
  measurementId: ""G-KPZJTQ4Y9J""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Export database reference
window.firebaseDB = database;
