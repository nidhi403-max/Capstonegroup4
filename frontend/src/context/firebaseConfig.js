import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAn1VbLnDmhFpM7Ehpv-Cge4PPy6JPDbmo",
    authDomain: "eventxo-78aca.firebaseapp.com",
    projectId: "eventxo-78aca",
    storageBucket: "eventxo-78aca.appspot.com",
    messagingSenderId: "635835160931",
    appId: "1:635835160931:web:7a3c0a70c3e227d0751b56"
  };

  const app = initializeApp(firebaseConfig);

  const storage = getStorage(app);
  
  export { storage };