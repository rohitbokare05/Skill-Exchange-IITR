// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCQAWduUPttv_HPwOoLV-JfmSxiZ0eWlto",
  authDomain: "skill-exchange-iitr.firebaseapp.com",
  projectId: "skill-exchange-iitr",
  storageBucket: "skill-exchange-iitr.firebasestorage.app",
  messagingSenderId: "770091439573",
  appId: "1:770091439573:web:875f8ee37727a03965d95c",
  measurementId: "G-CCFE13GCCL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Import necessary Firebase functions
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // import { getAnalytics } from "firebase/analytics";

// // Your actual Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCQAWduUPttv_HPwOoLV-JfmSxiZ0eWlto",
//   authDomain: "skill-exchange-iitr.firebaseapp.com",
//   projectId: "skill-exchange-iitr",
//   storageBucket: "skill-exchange-iitr.firebasestorage.app",
//   messagingSenderId: "770091439573",
//   appId: "1:770091439573:web:875f8ee37727a03965d95c",
//   measurementId: "G-CCFE13GCCL"
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Initialize Analytics (optional)
// // const analytics = getAnalytics(app);

// // Export Firebase services for use in your app
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
// export const db = getFirestore(app);
// export default app;
