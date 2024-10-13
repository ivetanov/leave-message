import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAZuMTD1oaXCNQY__QV3nKpopntGfU2PKQ",
    authDomain: "project-leave-message.firebaseapp.com",
    projectId: "project-leave-message",
    storageBucket: "project-leave-message.appspot.com",
    messagingSenderId: "367275093546",
    appId: "1:367275093546:web:61fa6cecf9e591a8fc9d53"
  };

  firebase.initializeApp(firebaseConfig)

  const projectFirestore = firebase.firestore()

  export { projectFirestore }