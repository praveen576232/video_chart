import firebase from 'firebase';

  const firebaseApp =firebase.initializeApp({
    apiKey: "AIzaSyAWHnTh5pte8RpJSnyYgrx1DXjACqUS6-0",
    authDomain: "praveen-e94c0.firebaseapp.com",
    databaseURL: "https://praveen-e94c0.firebaseio.com",
    projectId: "praveen-e94c0",
    storageBucket: "praveen-e94c0.appspot.com",
    messagingSenderId: "1048739874272",
    appId: "1:1048739874272:web:6bd96bbc22fefb1bb29785"
  });
  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();

  export { db,auth }