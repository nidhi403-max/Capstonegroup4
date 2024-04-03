const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('./service-account-file.json');

// Initializing Firebase account credentials
admin.initializeApp({
  apiKey: "AIzaSyAn1VbLnDmhFpM7Ehpv-Cge4PPy6JPDbmo",
  authDomain: "eventxo-78aca.firebaseapp.com",
  projectId: "eventxo-78aca",
  storageBucket: "eventxo-78aca.appspot.com",
  messagingSenderId: "635835160931",
  appId: "1:635835160931:web:7a3c0a70c3e227d0751b56",
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eventxo-78aca-default-rtdb.firebaseio.com/",
  storageBucket: "eventxo-78aca.appspot.com"

});

const storage = new Storage();
const bucket = admin.storage().bucket(); 
module.exports = { admin, storage, bucket, PDFDocument, fs, path };
