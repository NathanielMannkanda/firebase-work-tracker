import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//import { useAuthState} from 'react-firebase-hooks/auth';

const firebaseConfig =({
  //for config
  apiKey: "AIzaSyAzsDV9bRFbh5xQuHcfVRXNLLYt_b1X7io",
  authDomain: "work-tracker-2cf46.firebaseapp.com",
  projectId: "work-tracker-2cf46",
  storageBucket: "work-tracker-2cf46.firebasestorage.app",
  messagingSenderId: "322115869487",
  appId: "1:322115869487:web:75225910a4aa498803dfda",
  measurementId: "G-99KR7EJ7WL"
});

//firebase.initializeApp(firebaseConfig)
//init app
const app = initializeApp(firebaseConfig);

//services 
const auth = getAuth(app);
const firestore = getFirestore(app);

export {auth, firestore};