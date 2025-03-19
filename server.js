const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Routes
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const planRoutes = require('./routes/plans');
const appsRoutes=require('./routes/apps')
const auth= require ('./routes/auth')

// Initialize Express App
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/admin/orders', adminRoutes);
app.use('/admin/plans', planRoutes);
app.use('/admin/apps',appsRoutes)
app.use('/admin/auth', auth);

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
