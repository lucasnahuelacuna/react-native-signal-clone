import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAA6PhAvpJyfJP7uZSYdB8x35dlxh_KVVo",
    authDomain: "signal-clone-f0bfc.firebaseapp.com",
    projectId: "signal-clone-f0bfc",
    storageBucket: "signal-clone-f0bfc.appspot.com",
    messagingSenderId: "340140263154",
    appId: "1:340140263154:web:047496740272835981726b"
};

let app;

if(firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth();

export { db, auth }