// models/Order.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://hamza:1234@eurotvpro_database:3306/eurotvprodb');

const Order = sequelize.define('Order', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSON, // to store items as JSON
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type:DataTypes.ENUM("on hold","confirmed"),
    defaultValue:"on hold"
  }
}, {
  timestamps: true,
  underscored: true,
});
sequelize.sync({ force: false })  // Set force: true if you want to drop tables and recreate them
  .then(() => {
    console.log("Database sync complete.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

module.exports = Order;
