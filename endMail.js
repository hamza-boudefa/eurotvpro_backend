// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ subject, to, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any email service like SendGrid, Mailgun, etc.
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password', // You may use environment variables for safety
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
