// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCnmOeKX504_sA3DR6NNU6Y2RZgYVzBYv0",
	authDomain: "projektsda-d31aa.firebaseapp.com",
	projectId: "projektsda-d31aa",
	storageBucket: "projektsda-d31aa.appspot.com",
	messagingSenderId: "733111748832",
	appId: "1:733111748832:web:f84e1784177a37804ae885",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage();
