// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo_4AYPOi52SK4ah5I7Wk1JvJV465jHgU",
  authDomain: "myomi-4555c.firebaseapp.com",
  projectId: "myomi-4555c",
  storageBucket: "myomi-4555c.firebasestorage.app",
  messagingSenderId: "876319512682",
  appId: "1:876319512682:web:8ea54aa1beeab7d4ea9213",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export { messaging, getToken, onMessage };
