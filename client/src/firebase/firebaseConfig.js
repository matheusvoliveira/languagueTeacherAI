
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/database"

const firebaseConfig = {
  apiKey: "AIzaSyBCpMKCYxJ0IxciesZDS6jkFCC2jh2PP5E",
  authDomain: "nathan-stripe.firebaseapp.com",
  projectId: "nathan-stripe",
  storageBucket: "nathan-stripe.appspot.com",
  messagingSenderId: "811763611592",
  appId: "1:811763611592:web:337d387bb40f4527b532fd",
  measurementId: "G-5650206QYC"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

const {auth} = firebase.auth()

export {auth};
export default firebase
