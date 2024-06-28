import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDScrrNfuRpcDNWewAvYBg8s9X9qB6TyP4",
  authDomain: "clone-netflix-886c3.firebaseapp.com",
  projectId: "clone-netflix-886c3",
  storageBucket: "clone-netflix-886c3.appspot.com",
  messagingSenderId: "441945427794",
  appId: "1:441945427794:web:8a7eaf2486d7c5201b748b",
  measurementId: "G-Y3SSGP7QV2"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;
