module.exports = (sequelize, DataTypes) =>
  sequelize.define('MenuItem', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Item name is required.' }, len: { args: [2, 100], msg: 'Item name must be 2-100 characters.' } },
    },
    description: { type: DataTypes.STRING(255), allowNull: true },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { isDecimal: { msg: 'Price must be a number.' }, min: { args: [0.01], msg: 'Price must be greater than 0.' } },
    },
    imageUrl: { type: DataTypes.STRING(255), allowNull: true },
    isVegetarian: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
