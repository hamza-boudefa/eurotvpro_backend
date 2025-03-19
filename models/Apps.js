module.exports = (sequelize, DataTypes) => {

const Apps = sequelize.define("Apps", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 }, 
  },
  promo:{
    type: DataTypes.STRING, 
      allowNull: true,
      defaultValue: null, 
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
return Apps
}
