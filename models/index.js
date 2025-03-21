const { Sequelize } = require('sequelize');

// Database Connection
const sequelize = new Sequelize(process.env.DB_NAME || 'iptvdb', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost', // Removed '@' symbol before 'localhost'
  dialect: 'mysql',
  logging: false,
});
console.log(process.env.DB_NAME)
// Import Models
const Plan = require('./Plan')(sequelize, Sequelize);
const PlanTranslation = require('./PlanTranslation')(sequelize, Sequelize);
const Order = require('./Order')(sequelize, Sequelize);
const User=require('./user')(sequelize,Sequelize)
const Apps=require('./Apps')(sequelize,Sequelize)
// Define Relationships (Joins)
Plan.hasMany(PlanTranslation, { foreignKey: 'planId', onDelete: 'CASCADE' });
PlanTranslation.belongsTo(Plan, { foreignKey: 'planId' });

// Sync Database
(async () => {
  try {
    await sequelize.sync({ alter: true }); // Keep `alter: true` for non-destructive updates
    console.log('✅ Database synced successfully.');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
})();

module.exports = {
  sequelize, // Sequelize instance
  Order,
  Plan,
  PlanTranslation,
  User,
  Apps
};
