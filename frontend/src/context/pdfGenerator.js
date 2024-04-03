import { jsPDF } from "jspdf";
import { storage } from "./firebaseConfig";

//Creating a PDF using jsPDF and uploading to Firebase Storage
const createAndUploadPDF = async (pdfContent, fileName) => {
  const doc = new jsPDF();
  doc.text(pdfContent, 10, 10);

  const pdfBlob = doc.output("blob");

  try {
    const fileRef = storage.ref(`pdfs/${fileName}.pdf`);
    await fileRef.put(pdfBlob);
    console.log("PDF uploaded successfully!");

    const downloadURL = await fileRef.getDownloadURL();
    console.log("File available at", downloadURL);

    return downloadURL;
  } catch (error) {
    // Handling errors
    console.error("Error uploading PDF to Firebase:", error);
  }
};

createAndUploadPDF("Hello, this is a PDF.", "testPdf");
