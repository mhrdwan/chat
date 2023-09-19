// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
const firebaseConfig = {
  apiKey: "AIzaSyCTMyawgEETMDIDeyXLHJvNigxCUrzLkek",
  authDomain: "test-b2d2a.firebaseapp.com",
  databaseURL:
    "https://test-b2d2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-b2d2a",
  storageBucket: "test-b2d2a.appspot.com",
  messagingSenderId: "74244801255",
  appId: "1:74244801255:web:ea9a56ebdfc6e459d79842",
  measurementId: "G-N6MSQ27DHZ",
};
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const messaging = getMessaging(app);
export const db = getFirestore(app);
export const database = getDatabase(app)

// Add the public key generated from the console here.
export const requestMessagingPermission = async () => {
  try {
    console.log("Trying to request permission");
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      getToken(messaging, { vapidKey: "BNv7qfDGPqIdETB0kL8dO5wZBy-kijuqFyZtLrBcR05bqSLWT8y_7nb1XmiS0ZsrKITa2N8_ekYKS5o3l4gAEFU", })
        .then((curren) => {
          if (curren) {
            console.log(`asuu`, curren);
          } else {
            console.log('gagal');
          }
        })
    } else {
      console.log('User did not grant permission');
    }
  } catch (error) {
    console.error("Permission or token error:", error);
  }
};
