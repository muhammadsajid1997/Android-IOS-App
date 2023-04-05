// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithPopup, GoogleAuthProvider,signOut } from "firebase/auth";

// import { collection, getFirestore } from "firebase/firestore";
// import firebase from 'firebase/compat/app'
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';

import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';

// import 'firebase/compat/firestore'
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvoUblLa8gV_zwFOsyECsTBuX2Ge8782E",
  authDomain: "heyalli-86d32.firebaseapp.com",
  projectId: "heyalli-86d32",
  storageBucket: "heyalli-86d32.appspot.com",
  messagingSenderId: "249729703415",
  appId: "1:249729703415:android:451b25f9bdc48a008ee2f2"
};


// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);
const db = firestore(app);
const auth = getAuth()
const signOutFunc = signOut(auth)

export {signOutFunc,auth}

// Get a list of cities from your database
export async function getCities() {
  const citiesCol = collection(db, 'users');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  console.log(cityList)
  return cityList;
}

export async function createUser(data,dbCollection){
  try {
    const docRef = await addDoc(collection(db, dbCollection), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}







// https://heyalli-39ff3.firebaseapp.com/__/auth/handler


export default getCities



// import firebase from '@react-native-firebase/app';



// const firebaseConfig = {
//   apiKey: "AIzaSyDvoUblLa8gV_zwFOsyECsTBuX2Ge8782E",
//   authDomain: "heyalli-86d32.firebaseapp.com",
//   projectId: "heyalli-86d32",
//   storageBucket: "heyalli-86d32.appspot.com",
//   messagingSenderId: "249729703415",
//   appId: "1:249729703415:android:451b25f9bdc48a008ee2f2"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const db = firestore(app);
// const auth = getAuth()
// const signOutFunc = signOut(auth)
// const citiesCol = collection(db, 'users');



// export{firebase}