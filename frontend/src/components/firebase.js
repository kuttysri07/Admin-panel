// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDrYahoYAOAT6qZCzRkjcCfibnqolY0I8",
  authDomain: "spicy-world.firebaseapp.com",
  projectId: "spicy-world",
  storageBucket: "spicy-world.appspot.com",
  messagingSenderId: "1031827976221",
  appId: "1:1031827976221:web:0f07de9078aae355ad16f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app ;