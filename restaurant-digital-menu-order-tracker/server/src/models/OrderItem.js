// Junction table between Orders and MenuItems (many-to-many).
module.exports = (sequelize, DataTypes) =>
  sequelize.define('OrderItem', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'Quantity must be a whole number.' }, min: { args: [1], msg: 'Quantity must be at least 1.' } },
    },
    // Price at the time of ordering, so old orders stay correct if the menu price changes.
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  });
