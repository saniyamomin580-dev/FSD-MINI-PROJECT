const { ORDER_STATUSES } = require('../utils/orderUtils');

module.exports = (sequelize, DataTypes) =>
  sequelize.define('Order', {
    customerName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: { notEmpty: { msg: 'Customer name is required.' } },
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'Table number must be a whole number.' }, min: { args: [1], msg: 'Table number must be at least 1.' } },
    },
    notes: { type: DataTypes.STRING(255), allowNull: true },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'Total cannot be negative.' } },
    },
    status: {
      type: DataTypes.ENUM(...ORDER_STATUSES),
      allowNull: false,
      defaultValue: 'Pending',
      validate: { isIn: { args: [ORDER_STATUSES], msg: `Status must be one of: ${ORDER_STATUSES.join(', ')}.` } },
    },
  });
