// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route to handle order placement
router.post('/placeOrder', async (req, res) => {
    console.log(req.body)
  const { firstName, lastName, country, phoneNumber, email, paymentMethod, items, totalAmount } = req.body;

  try {
    const newOrder = await Order.create({
      firstName,
      lastName,
      country,
      phoneNumber,
      email,
      paymentMethod,
      items,
      totalAmount
    });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

router.put('/updateOrderStatus/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    try {
      const order = await Order.findByPk(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.status = status;
  
    //   if (status === 'confirmed') {
    //     order.confirmationDate = new Date();
    //   }
  
      await order.save();
  
      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  });
  

module.exports = router;
