importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
