module.exports = (sequelize, DataTypes) => {
    const PlanTranslation = sequelize.define('PlanTranslation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plans', // Use the correct table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      language: {
        type: DataTypes.STRING(2), // 'en', 'fr', 'de', 'es', 'ar'
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      features: {
        type: DataTypes.JSON, // Stores features as JSON array
        allowNull: false,
      },
    }, {
      timestamps: false,
      underscored: true,
    });
  
    return PlanTranslation;
  };
  