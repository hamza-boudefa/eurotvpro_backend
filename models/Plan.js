module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define('Plan', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      promoPrice:{
        type:DataTypes.FLOAT,
        allowNull:true
      },
      isBestValue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      timestamps: true,
      underscored: true,
    });
  
    return Plan;
  };
  