const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Order } = require('../models');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Route to handle order placement
router.post('/placeOrder', async (req, res) => {
  const { firstName, lastName, country, phoneNumber, email, paymentMethod, items, totalAmount } = req.body;

  try {
    // Create the order in the database
    const newOrder = await Order.create({
      firstName,
      lastName,
      country,
      phoneNumber,
      email,
      paymentMethod,
      items,
      totalAmount,
    });

    // Prepare email content
    const orderDetails = `
      <h2>New Order Placed</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p><strong>Total Amount:</strong> ${totalAmount}€</p>
      <h3>Items:</h3>
      <ul>
        ${items.map((item) => `<li>${item.name} - ${item.price}€</li>`).join('')}
      </ul>
      <a href="${process.env.BASE_URL}/orders" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        View Orders
      </a>
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: 'contact@eurotvpro.com', // Receiver address
      subject: 'New Order Placed', // Email subject
      html: orderDetails, // Email content (HTML)
    };

    // await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Route to update order status
router.put('/updateOrderStatus/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;