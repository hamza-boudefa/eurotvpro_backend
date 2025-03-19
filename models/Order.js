module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      items: {
        type: Sequelize.JSON, // Stores items as JSON
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      status: {
        type: Sequelize.ENUM('on hold', 'confirmed'),
        defaultValue: 'on hold',
      },
    });
  
    return Order;
  };
  