// server.js
const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const contactusRoutes = require('./routes/contactusRoutes');
const sequelize = require('./models/Order'); // Sequelize connection
const cors=require('cors')
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', orderRoutes); // For user order placement
app.use('/admin', adminRoutes); // For admin to view orders
// app.use('/api/contact', contactusRoutes);

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
