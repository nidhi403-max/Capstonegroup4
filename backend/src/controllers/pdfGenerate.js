const { bucket, PDFDocument, fs, path } = require('./firebaseConfig'); 

async function createAndUploadPDF(booking) {
   
    const pdfPath = await generatePDF(booking);
    const destinationPath = `receipt/${booking.booking._id}.pdf`;
  
    // Uploading the PDF to Firebase Storage
    const pdfUrl = await uploadPDFAndGetURL(pdfPath, destinationPath);
    fs.unlinkSync(pdfPath);
  
    return pdfUrl;
  }

  async function uploadPDFAndGetURL(filePath, destinationPath) {
    await bucket.upload(filePath, { destination: destinationPath });
    const file = bucket.file(destinationPath);
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(destinationPath)}`;
    return publicUrl;
  }
async function generatePDF(booking) {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, `${booking.booking._id}.pdf`);
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);
   
  const imagePath = path.join(__dirname, 'EventXo.png');
  doc.image(imagePath, 50, 50, { 
    width: 100,
  });
  
  doc.moveDown(2);
  doc.fontSize(20).text('EventXO Booking Confirmation', { align: 'center' });


  doc.moveDown(2); 

  // Title
  doc.fontSize(20).text('EventXO Booking Confirmation', { align: 'center' });
  doc.moveDown();

  // Introduction
  doc.fontSize(14).text(`Dear ${booking.user.username},`, { align: 'left' });
  doc.moveDown();
  doc.text("Thank you for choosing EventXO for your special day! We're thrilled to have the opportunity to make your event unforgettable.", { align: 'left' });
  doc.moveDown();

  // Event Details
  doc.fontSize(16).text('Event Details:', { underline: true });
  doc.fontSize(12).text(`Event Type: ${booking.eventName.title}`);
  doc.text(`Event Date: ${booking.booking.eventDate.toDateString()}`);
  doc.moveDown();

  // Venue Details
  doc.fontSize(16).text('Venue Details:', { underline: true });
  doc.fontSize(12).text(`Venue Name: ${booking.venue.name}`);
  doc.text(`Location: ${booking.venue.location}`);
  doc.text(`Capacity: ${booking.venue.capacity}`);
  doc.text(`Status: ${booking.venue.status}`);
  doc.text(`Schedule Date: ${booking.venue.schedule.toDateString()}`);
  doc.moveDown();

  // Booking Summary
  doc.fontSize(16).text('Booking Summary:', { underline: true });
  doc.fontSize(12).text(`Decoration Package: ${booking.booking.decorationPackage}`);
  doc.text(`Special Requests: ${booking.booking.specialRequests}`);
  doc.text(`Total Price: $${booking.booking.totalPrice}`);
  doc.text(`Booking Status: ${booking.booking.status}`);
  doc.text(`Comments: ${booking.booking.comment}`);
  doc.moveDown();

  // Conclusion
  doc.fontSize(14).text("We look forward to making your event a day to remember!", { align: 'left' });
  doc.text("Should you have any questions or need further assistance, please don't hesitate to reach out.", { align: 'left' });
  doc.moveDown();
  doc.text("Warm regards,", { align: 'left' });
  doc.text("The EventXO Team", { align: 'left' });

  // Finalize the PDF and end the stream
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', (error) => reject(error));
  });
}



module.exports = { createAndUploadPDF };
