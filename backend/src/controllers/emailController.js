const axios = require('axios');

const sendEmail = async (req, res) => {
  try {
    const emailParams = req.body;
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: 'service_ktwqzr8',
      template_id: 'template_5dydp4s',
      user_id: 'UdWcIFHzOFb9W8lp7',
      template_params: emailParams,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Email sent successfully:', response.data);
    res.status(200).json({ message: 'Email sent successfully', data: response.data });

  } catch (error) {
    console.error('Failed to send email:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to send email', error: error.toString() });
  }
};

module.exports = { sendEmail };
