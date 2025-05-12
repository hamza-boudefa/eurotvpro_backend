const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('iptvdb', '', '', {
  host: '127.0.0.1', // Ne pas utiliser 'localhost' ici
  port: 3306,
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully.'))
  .catch((err) => console.error('❌ Database connection failed:', err));
