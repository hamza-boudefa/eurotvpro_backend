// routes/contactRoutes.js
const express = require('express');
const router = express.Router();

// Placeholder for any validation library or email sending mechanism
const sendEmail = require('../utils/sendEmail'); // Assuming a utility function for sending email

// Route to handle contact form submission
router.post('/submit', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Send email with form data (or save to a database, etc.)
    const emailSent = await sendEmail({
      subject: 'New Contact Form Submission',
      to: 'admin@yourdomain.com',
      text: `New contact form submission:
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}`,
    });

    // Respond back with success message
    return res.status(200).json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'So,' });
  }
});

module.exports = router;
