const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');
const sendEmail = require('../utils/sendEmail');

// Rate limiting to prevent spam (5 requests per 15 minutes)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many contact attempts, please try again later.'
});

// Input validation rules
const validateContact = [
  body('firstName').trim().notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name too long'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name too long'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('phone').trim().isMobilePhone().withMessage('Invalid phone number'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message too long')
];

// Contact form submission
router.post('/submit', contactLimiter, validateContact, async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize inputs
  const { firstName, lastName, email, phone, message } = req.body;
  const cleanMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {}
  });

  try {
    // Send email
    await sendEmail({
      subject: 'New Contact Form Submission',
      to: process.env.CONTACT_EMAIL || 'admin@eurotvpro.com',
      html: `
        <h3>New Contact Submission</h3>
        <p><strong>Name:</strong> ${sanitizeHtml(firstName)} ${sanitizeHtml(lastName)}</p>
        <p><strong>Email:</strong> ${sanitizeHtml(email)}</p>
        <p><strong>Phone:</strong> ${sanitizeHtml(phone)}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      `,
      text: `New contact form submission:
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}
        Message: ${cleanMessage}`
    });

    // Log successful submission
    console.log(`Contact form submitted by ${email}`);
    
    return res.status(200).json({ 
      success: true,
      message: 'Your message has been sent successfully.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: ' Please try again later.' 
    });
  }
});

module.exports = router;
