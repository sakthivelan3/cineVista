// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDtQuafn2pl5BNpsItlbrTy64Rg6d52nM",
    authDomain: "omdb-movie-app-441aa.firebaseapp.com",
    projectId: "omdb-movie-app-441aa",
    storageBucket: "omdb-movie-app-441aa.appspot.com",
    messagingSenderId: "353786647204",
    appId: "1:353786647204:web:eb3597cc3065f821d38c31",
    measurementId: "G-N0EB52WMVR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Set persistence to SESSION
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Auth persistence set to session");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error.message);
  });

export { auth, firestore }; 